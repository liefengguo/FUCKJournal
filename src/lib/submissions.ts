import crypto from "node:crypto";

import type {
  Prisma,
  SubmissionStatus,
  UserRole,
} from "@prisma/client";

import { db } from "@/lib/db";
import {
  canUserEditSubmission,
  canUserSubmitSubmission,
  canUserUpdateSubmissionStatus,
} from "@/lib/permissions";
import { getEditorStatusTransitions } from "@/lib/submission-status";
import {
  submissionDraftSchema,
  submitManuscriptSchema,
  type SubmissionDraftInput,
} from "@/lib/validations/submission";

const submissionListSelect = {
  id: true,
  publicId: true,
  title: true,
  status: true,
  createdAt: true,
  updatedAt: true,
  submittedAt: true,
  manuscriptLanguage: true,
} satisfies Prisma.SubmissionSelect;

const submissionDetailInclude = {
  author: {
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  },
  versions: {
    orderBy: {
      versionNumber: "desc",
    },
    take: 10,
  },
  statusEvents: {
    orderBy: {
      createdAt: "desc",
    },
    include: {
      actor: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      },
    },
  },
} satisfies Prisma.SubmissionInclude;

export type SubmissionListItem = Prisma.SubmissionGetPayload<{
  select: typeof submissionListSelect;
}>;

export type SubmissionDetail = Prisma.SubmissionGetPayload<{
  include: typeof submissionDetailInclude;
}>;

type Viewer = {
  id: string;
  role: UserRole;
};

export class SubmissionError extends Error {}

function normalizeDraftInput(input: SubmissionDraftInput) {
  const parsed = submissionDraftSchema.parse(input);

  return {
    title: parsed.title,
    abstract: parsed.abstract ?? null,
    coverLetter: parsed.coverLetter ?? null,
    manuscriptLanguage: parsed.manuscriptLanguage ?? null,
    manuscriptFileName: parsed.manuscriptFileName ?? null,
    manuscriptMimeType: parsed.manuscriptMimeType ?? null,
    manuscriptSizeBytes: parsed.manuscriptSizeBytes ?? null,
  };
}

function buildVersionSnapshotData(
  submission: {
    title: string;
    abstract: string | null;
    coverLetter: string | null;
    manuscriptLanguage: string | null;
    manuscriptFileName: string | null;
    manuscriptStorageKey: string | null;
    manuscriptMimeType: string | null;
    manuscriptSizeBytes: number | null;
  },
  createdById: string,
  versionNumber: number,
) {
  return {
    createdById,
    versionNumber,
    title: submission.title,
    abstract: submission.abstract,
    coverLetter: submission.coverLetter,
    manuscriptLanguage: submission.manuscriptLanguage,
    manuscriptFileName: submission.manuscriptFileName,
    manuscriptStorageKey: submission.manuscriptStorageKey,
    manuscriptMimeType: submission.manuscriptMimeType,
    manuscriptSizeBytes: submission.manuscriptSizeBytes,
  };
}

async function createVersionSnapshot(
  tx: Prisma.TransactionClient,
  submissionId: string,
  createdById: string,
  submission: {
    title: string;
    abstract: string | null;
    coverLetter: string | null;
    manuscriptLanguage: string | null;
    manuscriptFileName: string | null;
    manuscriptStorageKey: string | null;
    manuscriptMimeType: string | null;
    manuscriptSizeBytes: number | null;
  },
) {
  const latestVersion = await tx.submissionVersion.findFirst({
    where: { submissionId },
    orderBy: { versionNumber: "desc" },
    select: { versionNumber: true },
  });

  await tx.submissionVersion.create({
    data: {
      submissionId,
      ...buildVersionSnapshotData(
        submission,
        createdById,
        (latestVersion?.versionNumber ?? 0) + 1,
      ),
    },
  });
}

async function generateSubmissionPublicId(client: typeof db | Prisma.TransactionClient = db) {
  for (let attempt = 0; attempt < 10; attempt += 1) {
    const publicId = `FJ-${crypto.randomBytes(5).toString("hex").toUpperCase()}`;
    const existing = await client.submission.findUnique({
      where: { publicId },
      select: { id: true },
    });

    if (!existing) {
      return publicId;
    }
  }

  throw new SubmissionError("Unable to generate a stable public submission id.");
}

function getEditableError(status: SubmissionStatus) {
  switch (status) {
    case "SUBMITTED":
      return "Submitted manuscripts are locked while they wait for editorial review.";
    case "UNDER_REVIEW":
      return "Manuscripts under review are locked until the editorial team requests changes or reaches a decision.";
    case "ACCEPTED":
      return "Accepted manuscripts are no longer editable in the author workspace.";
    case "REJECTED":
      return "Rejected manuscripts remain read-only in the archive.";
    default:
      return "This submission is not editable.";
  }
}

export async function createDraftSubmission(authorId: string) {
  return db.$transaction(async (tx) => {
    const publicId = await generateSubmissionPublicId(tx);

    const submission = await tx.submission.create({
      data: {
        publicId,
        authorId,
      },
    });

    await tx.submissionVersion.create({
      data: {
        submissionId: submission.id,
        ...buildVersionSnapshotData(
          {
            title: submission.title,
            abstract: submission.abstract,
            coverLetter: submission.coverLetter,
            manuscriptLanguage: submission.manuscriptLanguage,
            manuscriptFileName: submission.manuscriptFileName,
            manuscriptStorageKey: submission.manuscriptStorageKey,
            manuscriptMimeType: submission.manuscriptMimeType,
            manuscriptSizeBytes: submission.manuscriptSizeBytes,
          },
          authorId,
          1,
        ),
      },
    });

    return submission;
  });
}

export async function listAuthorSubmissions(authorId: string) {
  return db.submission.findMany({
    where: { authorId },
    select: submissionListSelect,
    orderBy: { updatedAt: "desc" },
  });
}

export async function getAuthorSubmissionDetail(
  authorId: string,
  publicId: string,
) {
  return db.submission.findFirst({
    where: { authorId, publicId },
    include: submissionDetailInclude,
  });
}

export async function listEditorialSubmissions() {
  return db.submission.findMany({
    where: {
      status: {
        not: "DRAFT",
      },
    },
    select: {
      ...submissionListSelect,
      author: {
        select: {
          name: true,
          email: true,
        },
      },
    },
    orderBy: [
      { updatedAt: "desc" },
      { createdAt: "desc" },
    ],
  });
}

export async function getEditorialSubmissionDetail(publicId: string) {
  return db.submission.findFirst({
    where: {
      publicId,
      status: {
        not: "DRAFT",
      },
    },
    include: submissionDetailInclude,
  });
}

export async function saveAuthorSubmissionDraft(
  viewer: Viewer,
  publicId: string,
  input: SubmissionDraftInput,
) {
  const normalized = normalizeDraftInput(input);

  return db.$transaction(async (tx) => {
    const submission = await tx.submission.findUnique({
      where: { publicId },
    });

    if (!submission || submission.authorId !== viewer.id) {
      throw new SubmissionError("Submission not found.");
    }

    if (!canUserEditSubmission(viewer, submission)) {
      throw new SubmissionError(getEditableError(submission.status));
    }

    const hasChanges =
      submission.title !== normalized.title ||
      submission.abstract !== normalized.abstract ||
      submission.coverLetter !== normalized.coverLetter ||
      submission.manuscriptLanguage !== normalized.manuscriptLanguage ||
      submission.manuscriptFileName !== normalized.manuscriptFileName ||
      submission.manuscriptMimeType !== normalized.manuscriptMimeType ||
      submission.manuscriptSizeBytes !== normalized.manuscriptSizeBytes;

    if (!hasChanges) {
      return submission;
    }

    const updatedSubmission = await tx.submission.update({
      where: { id: submission.id },
      data: normalized,
    });

    await createVersionSnapshot(tx, submission.id, viewer.id, updatedSubmission);

    return updatedSubmission;
  });
}

export async function submitAuthorSubmission(viewer: Viewer, publicId: string) {
  return db.$transaction(async (tx) => {
    const submission = await tx.submission.findUnique({
      where: { publicId },
    });

    if (!submission || submission.authorId !== viewer.id) {
      throw new SubmissionError("Submission not found.");
    }

    if (!canUserSubmitSubmission(viewer, submission)) {
      throw new SubmissionError(getEditableError(submission.status));
    }

    const validation = submitManuscriptSchema.safeParse({
      title: submission.title,
      abstract: submission.abstract ?? "",
      coverLetter: submission.coverLetter ?? "",
      manuscriptLanguage: submission.manuscriptLanguage ?? null,
      manuscriptFileName: submission.manuscriptFileName ?? null,
      manuscriptMimeType: submission.manuscriptMimeType ?? null,
      manuscriptSizeBytes: submission.manuscriptSizeBytes ?? null,
    });

    if (!validation.success) {
      throw new SubmissionError(
        "Add a title and a substantive abstract before submitting the manuscript.",
      );
    }

    const updatedSubmission = await tx.submission.update({
      where: { id: submission.id },
      data: {
        status: "SUBMITTED",
        submittedAt: new Date(),
      },
    });

    await tx.submissionStatusEvent.create({
      data: {
        submissionId: submission.id,
        actorId: viewer.id,
        fromStatus: submission.status,
        toStatus: "SUBMITTED",
      },
    });

    return updatedSubmission;
  });
}

export async function updateEditorialSubmissionStatus(
  viewer: Viewer,
  publicId: string,
  nextStatus: SubmissionStatus,
  note?: string,
) {
  if (!canUserUpdateSubmissionStatus(viewer.role)) {
    throw new SubmissionError("Only editors and administrators can update submission status.");
  }

  return db.$transaction(async (tx) => {
    const submission = await tx.submission.findUnique({
      where: { publicId },
    });

    if (!submission || submission.status === "DRAFT") {
      throw new SubmissionError("Submission not found.");
    }

    const transitions = getEditorStatusTransitions(submission.status);

    if (!transitions.includes(nextStatus)) {
      throw new SubmissionError("That status change is not allowed from the current state.");
    }

    const updatedSubmission = await tx.submission.update({
      where: { id: submission.id },
      data: {
        status: nextStatus,
      },
    });

    await tx.submissionStatusEvent.create({
      data: {
        submissionId: submission.id,
        actorId: viewer.id,
        fromStatus: submission.status,
        toStatus: nextStatus,
        note: note?.trim() ? note.trim() : null,
      },
    });

    return updatedSubmission;
  });
}
