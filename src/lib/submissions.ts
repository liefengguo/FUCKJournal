import crypto from "node:crypto";

import type {
  Prisma,
  ReviewerAssignmentStatus,
  SubmissionStatus,
  UserRole,
} from "@prisma/client";
import { ZodError } from "zod";

import { db } from "@/lib/db";
import type { SubmissionFeedbackCode } from "@/lib/feedback";
import { sendNotification } from "@/lib/notifications";
import {
  canReviewerAccessAssignment,
  canUserEditSubmission,
  canUserManagePublication,
  canUserManageReviewAssignments,
  canUserSubmitReview,
  canUserSubmitSubmission,
  canUserUpdateSubmissionStatus,
  canUserViewSubmission,
} from "@/lib/permissions";
import {
  deleteStoredFile,
  StorageError,
  storeSubmissionFile,
} from "@/lib/storage";
import { getEditorStatusTransitions } from "@/lib/submission-status";
import {
  publicationSettingsSchema,
  reviewInputSchema,
  reviewerAssignmentSchema,
  type ReviewInput,
} from "@/lib/validations/review";
import {
  submissionDraftSchema,
  submitManuscriptSchema,
  type SubmissionDraftInput,
  type UploadKind,
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
  keywords: true,
  manuscriptFileName: true,
  sourceArchiveFileName: true,
  isPublicationReady: true,
  publicationSlug: true,
} satisfies Prisma.SubmissionSelect;

const personSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
} satisfies Prisma.UserSelect;

const versionInclude = {
  createdBy: {
    select: {
      id: true,
      name: true,
      email: true,
    },
  },
} satisfies Prisma.SubmissionVersionInclude;

const reviewInclude = {
  reviewer: {
    select: personSelect,
  },
} satisfies Prisma.ReviewInclude;

const reviewerAssignmentInclude = {
  reviewer: {
    select: personSelect,
  },
  assignedBy: {
    select: personSelect,
  },
  review: {
    include: reviewInclude,
  },
} satisfies Prisma.ReviewerAssignmentInclude;

const authorSubmissionInclude = {
  author: {
    select: personSelect,
  },
  versions: {
    orderBy: {
      versionNumber: "desc",
    },
    take: 20,
    include: versionInclude,
  },
  statusEvents: {
    orderBy: {
      createdAt: "desc",
    },
    include: {
      actor: {
        select: personSelect,
      },
    },
  },
} satisfies Prisma.SubmissionInclude;

const editorSubmissionInclude = {
  ...authorSubmissionInclude,
  internalNotes: {
    orderBy: {
      createdAt: "desc",
    },
    include: {
      author: {
        select: personSelect,
      },
    },
  },
  reviewerAssignments: {
    where: {
      status: {
        not: "REMOVED",
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    include: reviewerAssignmentInclude,
  },
  reviews: {
    orderBy: {
      updatedAt: "desc",
    },
    include: reviewInclude,
  },
} satisfies Prisma.SubmissionInclude;

const reviewerQueueInclude = {
  assignedBy: {
    select: personSelect,
  },
  review: {
    include: reviewInclude,
  },
  submission: {
    select: {
      ...submissionListSelect,
      author: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  },
} satisfies Prisma.ReviewerAssignmentInclude;

export type SubmissionListItem = Prisma.SubmissionGetPayload<{
  select: typeof submissionListSelect;
}>;

export type SubmissionDetail = Prisma.SubmissionGetPayload<{
  include: typeof authorSubmissionInclude;
}>;

export type EditorialSubmissionDetail = Prisma.SubmissionGetPayload<{
  include: typeof editorSubmissionInclude;
}>;

export type ReviewerQueueItem = Prisma.ReviewerAssignmentGetPayload<{
  include: typeof reviewerQueueInclude;
}>;

type Viewer = {
  id: string;
  role: UserRole;
  email?: string | null;
  name?: string | null;
};

type SubmissionSnapshotSource = {
  title: string;
  abstract: string | null;
  keywords: string[];
  coverLetter: string | null;
  introduction: string | null;
  mainContent: string | null;
  conclusion: string | null;
  references: string | null;
  manuscriptLanguage: string | null;
  manuscriptFileName: string | null;
  manuscriptStorageKey: string | null;
  manuscriptStorageProvider: string | null;
  manuscriptMimeType: string | null;
  manuscriptSizeBytes: number | null;
  sourceArchiveFileName: string | null;
  sourceArchiveStorageKey: string | null;
  sourceArchiveStorageProvider: string | null;
  sourceArchiveMimeType: string | null;
  sourceArchiveSizeBytes: number | null;
};

type VersionLabel =
  | "Draft Created"
  | "Draft Save"
  | "Revision Draft Save"
  | "Submission"
  | "Revision Resubmission";

export class SubmissionError extends Error {
  constructor(public code: SubmissionFeedbackCode) {
    super(code);
    this.name = "SubmissionError";
  }
}

function uniqueKeywords(keywords: string[]) {
  return Array.from(new Set(keywords.map((keyword) => keyword.trim()).filter(Boolean)));
}

function normalizeDraftInput(input: SubmissionDraftInput) {
  const parsed = submissionDraftSchema.parse(input);

  return {
    title: parsed.title,
    abstract: parsed.abstract ?? null,
    keywords: uniqueKeywords(parsed.keywords ?? []),
    coverLetter: parsed.coverLetter ?? null,
    introduction: parsed.introduction ?? null,
    mainContent: parsed.mainContent ?? null,
    conclusion: parsed.conclusion ?? null,
    references: parsed.references ?? null,
    manuscriptLanguage: parsed.manuscriptLanguage ?? null,
    manuscriptFileName: parsed.manuscriptFileName ?? null,
    manuscriptStorageProvider: parsed.manuscriptStorageProvider ?? null,
    manuscriptMimeType: parsed.manuscriptMimeType ?? null,
    manuscriptSizeBytes: parsed.manuscriptSizeBytes ?? null,
    sourceArchiveFileName: parsed.sourceArchiveFileName ?? null,
    sourceArchiveStorageProvider: parsed.sourceArchiveStorageProvider ?? null,
    sourceArchiveMimeType: parsed.sourceArchiveMimeType ?? null,
    sourceArchiveSizeBytes: parsed.sourceArchiveSizeBytes ?? null,
  };
}

function buildVersionSnapshotData(
  submission: SubmissionSnapshotSource,
  createdById: string,
  versionNumber: number,
  label: VersionLabel,
  statusContext: SubmissionStatus,
) {
  return {
    createdById,
    versionNumber,
    label,
    statusContext,
    title: submission.title,
    abstract: submission.abstract,
    keywords: submission.keywords,
    coverLetter: submission.coverLetter,
    introduction: submission.introduction,
    mainContent: submission.mainContent,
    conclusion: submission.conclusion,
    references: submission.references,
    manuscriptLanguage: submission.manuscriptLanguage,
    manuscriptFileName: submission.manuscriptFileName,
    manuscriptStorageKey: submission.manuscriptStorageKey,
    manuscriptStorageProvider: submission.manuscriptStorageProvider,
    manuscriptMimeType: submission.manuscriptMimeType,
    manuscriptSizeBytes: submission.manuscriptSizeBytes,
    sourceArchiveFileName: submission.sourceArchiveFileName,
    sourceArchiveStorageKey: submission.sourceArchiveStorageKey,
    sourceArchiveStorageProvider: submission.sourceArchiveStorageProvider,
    sourceArchiveMimeType: submission.sourceArchiveMimeType,
    sourceArchiveSizeBytes: submission.sourceArchiveSizeBytes,
  };
}

function getSubmissionSnapshotSource(
  submission: SubmissionSnapshotSource,
): SubmissionSnapshotSource {
  return {
    title: submission.title,
    abstract: submission.abstract,
    keywords: submission.keywords,
    coverLetter: submission.coverLetter,
    introduction: submission.introduction,
    mainContent: submission.mainContent,
    conclusion: submission.conclusion,
    references: submission.references,
    manuscriptLanguage: submission.manuscriptLanguage,
    manuscriptFileName: submission.manuscriptFileName,
    manuscriptStorageKey: submission.manuscriptStorageKey,
    manuscriptStorageProvider: submission.manuscriptStorageProvider,
    manuscriptMimeType: submission.manuscriptMimeType,
    manuscriptSizeBytes: submission.manuscriptSizeBytes,
    sourceArchiveFileName: submission.sourceArchiveFileName,
    sourceArchiveStorageKey: submission.sourceArchiveStorageKey,
    sourceArchiveStorageProvider: submission.sourceArchiveStorageProvider,
    sourceArchiveMimeType: submission.sourceArchiveMimeType,
    sourceArchiveSizeBytes: submission.sourceArchiveSizeBytes,
  };
}

async function createVersionSnapshot(
  tx: Prisma.TransactionClient,
  submissionId: string,
  createdById: string,
  submission: SubmissionSnapshotSource,
  label: VersionLabel,
  statusContext: SubmissionStatus,
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
        label,
        statusContext,
      ),
    },
  });
}

async function generateSubmissionPublicId(
  client: typeof db | Prisma.TransactionClient = db,
) {
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

function getDraftSaveLabel(status: SubmissionStatus): VersionLabel {
  return status === "REVISION_REQUESTED" ? "Revision Draft Save" : "Draft Save";
}

function getSubmitLabel(status: SubmissionStatus): VersionLabel {
  return status === "REVISION_REQUESTED" ? "Revision Resubmission" : "Submission";
}

function validateInternalNote(body: string) {
  const normalized = body.trim();

  if (normalized.length < 5 || normalized.length > 5000) {
    throw new SubmissionError("invalid-editor-note");
  }

  return normalized;
}

function getAssetFieldPatch(
  kind: UploadKind,
  asset: {
    fileName: string;
    storageKey: string;
    storageProvider: string;
    mimeType: string;
    sizeBytes: number;
  },
) {
  if (kind === "manuscript") {
    return {
      manuscriptFileName: asset.fileName,
      manuscriptStorageKey: asset.storageKey,
      manuscriptStorageProvider: asset.storageProvider,
      manuscriptMimeType: asset.mimeType,
      manuscriptSizeBytes: asset.sizeBytes,
    };
  }

  return {
    sourceArchiveFileName: asset.fileName,
    sourceArchiveStorageKey: asset.storageKey,
    sourceArchiveStorageProvider: asset.storageProvider,
    sourceArchiveMimeType: asset.mimeType,
    sourceArchiveSizeBytes: asset.sizeBytes,
  };
}

function getExistingAssetFields(
  submission: SubmissionSnapshotSource,
  kind: UploadKind,
) {
  if (kind === "manuscript") {
    return {
      storageKey: submission.manuscriptStorageKey,
      storageProvider: submission.manuscriptStorageProvider,
    };
  }

  return {
    storageKey: submission.sourceArchiveStorageKey,
    storageProvider: submission.sourceArchiveStorageProvider,
  };
}

function isAssignmentVisibleToReviewer(status: ReviewerAssignmentStatus) {
  return canReviewerAccessAssignment(status);
}

function isReviewOpen(status: SubmissionStatus) {
  return status === "UNDER_REVIEW";
}

async function notifyStatusChange(
  submission: {
    publicId: string;
    status: SubmissionStatus;
    author: { email: string; name: string | null };
  },
  previousStatus: SubmissionStatus,
) {
  await sendNotification({
    type: "submission_status_changed",
    submissionPublicId: submission.publicId,
    recipients: [submission.author.email],
    context: {
      previousStatus,
      nextStatus: submission.status,
      authorEmail: submission.author.email,
      authorName: submission.author.name,
    },
  });

  if (submission.status === "REVISION_REQUESTED") {
    await sendNotification({
      type: "submission_revision_requested",
      submissionPublicId: submission.publicId,
      recipients: [submission.author.email],
      context: {
        authorEmail: submission.author.email,
      },
    });
  }

  if (submission.status === "ACCEPTED") {
    await sendNotification({
      type: "submission_accepted",
      submissionPublicId: submission.publicId,
      recipients: [submission.author.email],
      context: {
        authorEmail: submission.author.email,
      },
    });
  }

  if (submission.status === "REJECTED") {
    await sendNotification({
      type: "submission_rejected",
      submissionPublicId: submission.publicId,
      recipients: [submission.author.email],
      context: {
        authorEmail: submission.author.email,
      },
    });
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

    await createVersionSnapshot(
      tx,
      submission.id,
      authorId,
      getSubmissionSnapshotSource(submission),
      "Draft Created",
      "DRAFT",
    );

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

export async function getAuthorSubmissionDetail(authorId: string, publicId: string) {
  return db.submission.findFirst({
    where: { authorId, publicId },
    include: authorSubmissionInclude,
  });
}

export async function listEditorialSubmissions(filters?: {
  status?: SubmissionStatus | "ALL";
  language?: string | "all";
}) {
  return db.submission.findMany({
    where: {
      status:
        filters?.status && filters.status !== "ALL"
          ? filters.status
          : {
              not: "DRAFT",
            },
      ...(filters?.language && filters.language !== "all"
        ? { manuscriptLanguage: filters.language }
        : {}),
    },
    select: {
      ...submissionListSelect,
      author: {
        select: {
          name: true,
          email: true,
        },
      },
      _count: {
        select: {
          reviewerAssignments: {
            where: {
              status: {
                not: "REMOVED",
              },
            },
          },
          reviews: true,
        },
      },
    },
    orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
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
    include: editorSubmissionInclude,
  });
}

export async function listAvailableReviewers() {
  return db.user.findMany({
    where: {
      role: "REVIEWER",
    },
    select: personSelect,
    orderBy: [{ name: "asc" }, { email: "asc" }],
  });
}

export async function listReviewerAssignments(reviewerId: string) {
  return db.reviewerAssignment.findMany({
    where: {
      reviewerId,
      status: {
        in: ["ACTIVE", "COMPLETED"],
      },
    },
    include: reviewerQueueInclude,
    orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
  });
}

export async function getReviewerAssignmentDetail(reviewerId: string, publicId: string) {
  return db.reviewerAssignment.findFirst({
    where: {
      reviewerId,
      status: {
        in: ["ACTIVE", "COMPLETED"],
      },
      submission: {
        publicId,
      },
    },
    include: {
      assignedBy: {
        select: personSelect,
      },
      review: {
        include: reviewInclude,
      },
      submission: {
        include: {
          ...authorSubmissionInclude,
        },
      },
    },
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
      JSON.stringify(submission.keywords) !== JSON.stringify(normalized.keywords) ||
      submission.coverLetter !== normalized.coverLetter ||
      submission.introduction !== normalized.introduction ||
      submission.mainContent !== normalized.mainContent ||
      submission.conclusion !== normalized.conclusion ||
      submission.references !== normalized.references ||
      submission.manuscriptLanguage !== normalized.manuscriptLanguage;

    if (!hasChanges) {
      return submission;
    }

    const updatedSubmission = await tx.submission.update({
      where: { id: submission.id },
      data: {
        title: normalized.title,
        abstract: normalized.abstract,
        keywords: normalized.keywords,
        coverLetter: normalized.coverLetter,
        introduction: normalized.introduction,
        mainContent: normalized.mainContent,
        conclusion: normalized.conclusion,
        references: normalized.references,
        manuscriptLanguage: normalized.manuscriptLanguage,
      },
    });

    await createVersionSnapshot(
      tx,
      submission.id,
      viewer.id,
      getSubmissionSnapshotSource(updatedSubmission),
      getDraftSaveLabel(submission.status),
      submission.status,
    );

    return updatedSubmission;
  });
}

export async function submitAuthorSubmission(viewer: Viewer, publicId: string) {
  const result = await db.$transaction(async (tx) => {
    const submission = await tx.submission.findUnique({
      where: { publicId },
      include: {
        author: {
          select: {
            email: true,
            name: true,
          },
        },
      },
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
      keywords: submission.keywords,
      coverLetter: submission.coverLetter ?? "",
      introduction: submission.introduction ?? "",
      mainContent: submission.mainContent ?? "",
      conclusion: submission.conclusion ?? "",
      references: submission.references ?? "",
      manuscriptLanguage: submission.manuscriptLanguage ?? null,
      manuscriptFileName: submission.manuscriptFileName ?? null,
      manuscriptStorageProvider: submission.manuscriptStorageProvider ?? null,
      manuscriptMimeType: submission.manuscriptMimeType ?? null,
      manuscriptSizeBytes: submission.manuscriptSizeBytes ?? null,
      sourceArchiveFileName: submission.sourceArchiveFileName ?? null,
      sourceArchiveStorageProvider: submission.sourceArchiveStorageProvider ?? null,
      sourceArchiveMimeType: submission.sourceArchiveMimeType ?? null,
      sourceArchiveSizeBytes: submission.sourceArchiveSizeBytes ?? null,
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
      include: {
        author: {
          select: {
            email: true,
            name: true,
          },
        },
      },
    });

    await createVersionSnapshot(
      tx,
      submission.id,
      viewer.id,
      getSubmissionSnapshotSource(updatedSubmission),
      getSubmitLabel(submission.status),
      "SUBMITTED",
    );

    await tx.submissionStatusEvent.create({
      data: {
        submissionId: submission.id,
        actorId: viewer.id,
        fromStatus: submission.status,
        toStatus: "SUBMITTED",
      },
    });

    return {
      previousStatus: submission.status,
      submission: updatedSubmission,
    };
  });

  await sendNotification({
    type: "submission_submitted",
    submissionPublicId: result.submission.publicId,
    recipients: [result.submission.author.email],
    context: {
      authorEmail: result.submission.author.email,
      authorName: result.submission.author.name,
      previousStatus: result.previousStatus,
    },
  });

  return result.submission;
}

export async function replaceSubmissionAsset(
  viewer: Viewer,
  publicId: string,
  kind: UploadKind,
  file: File,
) {
  let uploadedFile:
    | {
        storageKey: string;
        storageProvider: string;
      }
    | undefined;

  try {
    uploadedFile = await storeSubmissionFile(publicId, kind, file);
  } catch (error) {
    if (error instanceof StorageError) {
      throw new SubmissionError(error.code);
    }

    throw new SubmissionError("upload-failed");
  }

  let previousFile:
    | {
        storageKey: string | null;
        storageProvider: string | null;
      }
    | undefined;

  try {
    const updatedSubmission = await db.$transaction(async (tx) => {
      const submission = await tx.submission.findUnique({
        where: { publicId },
      });

      if (!submission || submission.authorId !== viewer.id) {
        throw new SubmissionError("submission-not-found");
      }

      if (!canUserEditSubmission(viewer, submission)) {
        throw new SubmissionError(getEditableErrorCode(submission.status));
      }

      previousFile = getExistingAssetFields(submission, kind);

      const updated = await tx.submission.update({
        where: { id: submission.id },
        data: getAssetFieldPatch(kind, {
          fileName: file.name,
          storageKey: uploadedFile!.storageKey,
          storageProvider: uploadedFile!.storageProvider,
          mimeType: file.type || "application/octet-stream",
          sizeBytes: file.size,
        }),
      });

      await createVersionSnapshot(
        tx,
        submission.id,
        viewer.id,
        getSubmissionSnapshotSource(updated),
        getDraftSaveLabel(submission.status),
        submission.status,
      );

      return updated;
    });

    await deleteStoredFile(previousFile?.storageProvider, previousFile?.storageKey);

    return updatedSubmission;
  } catch (error) {
    await deleteStoredFile(uploadedFile?.storageProvider, uploadedFile?.storageKey);

    if (error instanceof SubmissionError) {
      throw error;
    }

    throw new SubmissionError("upload-failed");
  }
}

export async function getSubmissionAssetForViewer(
  viewer: Viewer,
  publicId: string,
  kind: UploadKind,
) {
  const submission = await db.submission.findUnique({
    where: { publicId },
  });

  if (!submission) {
    throw new SubmissionError("submission-not-found");
  }

  if (viewer.role === "REVIEWER") {
    const assignment = await db.reviewerAssignment.findFirst({
      where: {
        reviewerId: viewer.id,
        submissionId: submission.id,
      },
      select: {
        status: true,
      },
    });

    if (!assignment || !isAssignmentVisibleToReviewer(assignment.status)) {
      throw new SubmissionError("reviewer-not-assigned");
    }
  } else if (!canUserViewSubmission(viewer, submission)) {
    throw new SubmissionError("submission-not-found");
  }

  if (kind === "manuscript") {
    if (!submission.manuscriptStorageKey) {
      throw new SubmissionError("asset-not-found");
    }

    return {
      fileName: submission.manuscriptFileName ?? "manuscript.pdf",
      mimeType: submission.manuscriptMimeType ?? "application/pdf",
      storageKey: submission.manuscriptStorageKey,
      storageProvider: submission.manuscriptStorageProvider,
    };
  }

  if (!submission.sourceArchiveStorageKey) {
    throw new SubmissionError("asset-not-found");
  }

  return {
    fileName: submission.sourceArchiveFileName ?? "source.zip",
    mimeType: submission.sourceArchiveMimeType ?? "application/zip",
    storageKey: submission.sourceArchiveStorageKey,
    storageProvider: submission.sourceArchiveStorageProvider,
  };
}

export async function addInternalEditorNote(
  viewer: Viewer,
  publicId: string,
  body: string,
) {
  if (!canUserUpdateSubmissionStatus(viewer.role)) {
    throw new SubmissionError("status-update-forbidden");
  }

  const normalizedBody = validateInternalNote(body);

  const submission = await db.submission.findUnique({
    where: { publicId },
    select: { id: true, status: true },
  });

  if (!submission || submission.status === "DRAFT") {
    throw new SubmissionError("submission-not-found");
  }

  return db.internalEditorNote.create({
    data: {
      submissionId: submission.id,
      authorId: viewer.id,
      body: normalizedBody,
    },
    include: {
      author: {
        select: personSelect,
      },
    },
  });
}

export async function assignReviewerToSubmission(
  viewer: Viewer,
  publicId: string,
  reviewerId: string,
) {
  if (!canUserManageReviewAssignments(viewer.role)) {
    throw new SubmissionError("status-update-forbidden");
  }

  let parsedReviewerId: string;

  try {
    parsedReviewerId = reviewerAssignmentSchema.parse({ reviewerId }).reviewerId;
  } catch {
    throw new SubmissionError("invalid-reviewer");
  }

  const result = await db.$transaction(async (tx) => {
    const reviewer = await tx.user.findUnique({
      where: { id: parsedReviewerId },
      select: personSelect,
    });

    if (!reviewer || reviewer.role !== "REVIEWER") {
      throw new SubmissionError("invalid-reviewer");
    }

    const submission = await tx.submission.findUnique({
      where: { publicId },
      include: {
        author: {
          select: {
            email: true,
            name: true,
          },
        },
      },
    });

    if (!submission || submission.status === "DRAFT") {
      throw new SubmissionError("submission-not-found");
    }

    if (!["SUBMITTED", "UNDER_REVIEW"].includes(submission.status)) {
      throw new SubmissionError("review-closed");
    }

    const existing = await tx.reviewerAssignment.findUnique({
      where: {
        submissionId_reviewerId: {
          submissionId: submission.id,
          reviewerId: reviewer.id,
        },
      },
      include: {
        review: true,
      },
    });

    if (existing?.status === "ACTIVE") {
      throw new SubmissionError("reviewer-already-assigned");
    }

    const now = new Date();

    const assignment = existing
      ? await tx.reviewerAssignment.update({
          where: {
            submissionId_reviewerId: {
              submissionId: submission.id,
              reviewerId: reviewer.id,
            },
          },
          data: {
            assignedById: viewer.id,
            status: "ACTIVE",
            invitedAt: now,
            respondedAt: existing.respondedAt ?? now,
          },
          include: reviewerAssignmentInclude,
        })
      : await tx.reviewerAssignment.create({
          data: {
            submissionId: submission.id,
            reviewerId: reviewer.id,
            assignedById: viewer.id,
            status: "ACTIVE",
            invitedAt: now,
            respondedAt: now,
          },
          include: reviewerAssignmentInclude,
        });

    return {
      assignment,
      reviewer,
      submission,
    };
  });

  await sendNotification({
    type: "reviewer_assigned",
    submissionPublicId: result.submission.publicId,
    recipients: [result.reviewer.email],
    context: {
      reviewerEmail: result.reviewer.email,
      reviewerName: result.reviewer.name,
      assignedById: viewer.id,
      authorEmail: result.submission.author.email,
    },
  });

  return result.assignment;
}

export async function removeReviewerAssignment(
  viewer: Viewer,
  publicId: string,
  reviewerId: string,
) {
  if (!canUserManageReviewAssignments(viewer.role)) {
    throw new SubmissionError("status-update-forbidden");
  }

  return db.$transaction(async (tx) => {
    const submission = await tx.submission.findUnique({
      where: { publicId },
      select: { id: true, status: true },
    });

    if (!submission || submission.status === "DRAFT") {
      throw new SubmissionError("submission-not-found");
    }

    const assignment = await tx.reviewerAssignment.findUnique({
      where: {
        submissionId_reviewerId: {
          submissionId: submission.id,
          reviewerId,
        },
      },
    });

    if (!assignment || assignment.status === "REMOVED") {
      throw new SubmissionError("reviewer-not-assigned");
    }

    return tx.reviewerAssignment.update({
      where: {
        submissionId_reviewerId: {
          submissionId: submission.id,
          reviewerId,
        },
      },
      data: {
        status: "REMOVED",
      },
      include: reviewerAssignmentInclude,
    });
  });
}

export async function saveReviewerReview(
  viewer: Viewer,
  publicId: string,
  input: ReviewInput,
) {
  if (!canUserSubmitReview(viewer.role)) {
    throw new SubmissionError("status-update-forbidden");
  }

  let parsedInput: ReviewInput;

  try {
    parsedInput = reviewInputSchema.parse(input);
  } catch {
    throw new SubmissionError("invalid-review-input");
  }

  return db.$transaction(async (tx) => {
    const assignment = await tx.reviewerAssignment.findFirst({
      where: {
        reviewerId: viewer.id,
        status: {
          in: ["ACTIVE", "COMPLETED"],
        },
        submission: {
          publicId,
        },
      },
      include: {
        submission: {
          select: {
            id: true,
            status: true,
          },
        },
      },
    });

    if (!assignment || !isAssignmentVisibleToReviewer(assignment.status)) {
      throw new SubmissionError("reviewer-not-assigned");
    }

    if (!isReviewOpen(assignment.submission.status)) {
      throw new SubmissionError("review-closed");
    }

    const review = await tx.review.upsert({
      where: {
        submissionId_reviewerId: {
          submissionId: assignment.submission.id,
          reviewerId: viewer.id,
        },
      },
      create: {
        submissionId: assignment.submission.id,
        reviewerId: viewer.id,
        reviewerAssignmentId: assignment.id,
        decision: parsedInput.decision,
        commentsToAuthor: parsedInput.commentsToAuthor ?? null,
        commentsToEditor: parsedInput.commentsToEditor ?? null,
      },
      update: {
        decision: parsedInput.decision,
        commentsToAuthor: parsedInput.commentsToAuthor ?? null,
        commentsToEditor: parsedInput.commentsToEditor ?? null,
      },
      include: reviewInclude,
    });

    await tx.reviewerAssignment.update({
      where: { id: assignment.id },
      data: {
        status: "COMPLETED",
        respondedAt: new Date(),
      },
    });

    return review;
  });
}

export async function updatePublicationSettings(
  viewer: Viewer,
  publicId: string,
  input: {
    isPublicationReady: boolean;
    publicationSlug: string | null;
    publishedAt: string | null;
  },
) {
  if (!canUserManagePublication(viewer.role)) {
    throw new SubmissionError("status-update-forbidden");
  }

  const parsedInput = publicationSettingsSchema.safeParse(input);

  if (!parsedInput.success) {
    throw new SubmissionError("invalid-publication-input");
  }

  if (parsedInput.data.isPublicationReady && !parsedInput.data.publicationSlug) {
    throw new SubmissionError("invalid-publication-input");
  }

  try {
    return await db.$transaction(async (tx) => {
      const submission = await tx.submission.findUnique({
        where: { publicId },
      });

      if (!submission || submission.status === "DRAFT") {
        throw new SubmissionError("submission-not-found");
      }

      if (submission.status !== "ACCEPTED") {
        throw new SubmissionError("publication-not-allowed");
      }

      return tx.submission.update({
        where: { id: submission.id },
        data: {
          isPublicationReady: parsedInput.data.isPublicationReady,
          publicationSlug: parsedInput.data.publicationSlug ?? null,
          publishedAt: parsedInput.data.publishedAt
            ? new Date(parsedInput.data.publishedAt)
            : null,
        },
      });
    });
  } catch (error) {
    if (error instanceof SubmissionError) {
      throw error;
    }

    throw new SubmissionError("publication-update-failed");
  }
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

  const result = await db.$transaction(async (tx) => {
    const submission = await tx.submission.findUnique({
      where: { publicId },
      include: {
        author: {
          select: {
            email: true,
            name: true,
          },
        },
      },
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
        ...(nextStatus !== "ACCEPTED"
          ? {
              isPublicationReady: false,
              publishedAt: null,
            }
          : {}),
      },
      include: {
        author: {
          select: {
            email: true,
            name: true,
          },
        },
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

    return {
      previousStatus: submission.status,
      submission: updatedSubmission,
    };
  });

  await notifyStatusChange(result.submission, result.previousStatus);

  return result.submission;
}
