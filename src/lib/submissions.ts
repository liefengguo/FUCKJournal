import crypto from "node:crypto";

import type {
  Prisma,
  SubmissionStatus,
  UserRole,
} from "@prisma/client";
import { ZodError } from "zod";

import { db } from "@/lib/db";
import type { SubmissionFeedbackCode } from "@/lib/feedback";
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

export class SubmissionError extends Error {
  constructor(public code: SubmissionFeedbackCode) {
    super(code);
    this.name = "SubmissionError";
  }
}

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

  throw new SubmissionError("public-id-generation-failed");
}

function getEditableErrorCode(status: SubmissionStatus): SubmissionFeedbackCode {
  switch (status) {
    case "SUBMITTED":
      return "submitted-locked";
    case "UNDER_REVIEW":
      return "under-review-locked";
    case "ACCEPTED":
      return "accepted-locked";
    case "REJECTED":
      return "rejected-locked";
    default:
      return "not-editable";
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
  let normalized: ReturnType<typeof normalizeDraftInput>;

  try {
    normalized = normalizeDraftInput(input);
  } catch (error) {
    if (error instanceof ZodError) {
      throw new SubmissionError("invalid-draft-input");
    }

    throw error;
  }

  return db.$transaction(async (tx) => {
    const submission = await tx.submission.findUnique({
      where: { publicId },
    });

    if (!submission || submission.authorId !== viewer.id) {
      throw new SubmissionError("submission-not-found");
    }

    if (!canUserEditSubmission(viewer, submission)) {
      throw new SubmissionError(getEditableErrorCode(submission.status));
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
      throw new SubmissionError("submission-not-found");
    }

    if (!canUserSubmitSubmission(viewer, submission)) {
      throw new SubmissionError(getEditableErrorCode(submission.status));
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
      throw new SubmissionError("missing-required-submission-fields");
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
    throw new SubmissionError("status-update-forbidden");
  }

  return db.$transaction(async (tx) => {
    const submission = await tx.submission.findUnique({
      where: { publicId },
    });

    if (!submission || submission.status === "DRAFT") {
      throw new SubmissionError("submission-not-found");
    }

    const transitions = getEditorStatusTransitions(submission.status);

    if (!transitions.includes(nextStatus)) {
      throw new SubmissionError("status-transition-not-allowed");
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
