"use server";

import type { SubmissionStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import type { Locale } from "@/i18n/routing";
import {
  requireContributorUser,
  requireEditorUser,
  requireReviewerUser,
} from "@/lib/auth-guards";
import {
  addInternalEditorNote,
  assignReviewerToSubmission,
  createDraftSubmission,
  removeReviewerAssignment,
  saveAuthorSubmissionDraft,
  saveReviewerReview,
  SubmissionError,
  submitAuthorSubmission,
  updateEditorialSubmissionStatus,
  updatePublicationSettings,
} from "@/lib/submissions";
import { logOperationalFailure } from "@/lib/observability";
import { getEditorStatusTransitions } from "@/lib/submission-status";
import { publicationLocaleValues } from "@/lib/validations/publication";
import { manuscriptLanguages, publicIdSchema } from "@/lib/validations/submission";

function getLocale(value: FormDataEntryValue | null): Locale {
  return value === "zh" ? "zh" : "en";
}

function buildNoticeUrl(pathname: string, key: string, message: string) {
  const searchParams = new URLSearchParams();
  searchParams.set(key, message);
  return `${pathname}?${searchParams.toString()}`;
}

function getFormString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function getOptionalString(formData: FormData, key: string) {
  const value = getFormString(formData, key).trim();
  return value || null;
}

function getValidatedPublicId(
  locale: Locale,
  formData: FormData,
  fallbackPath: string,
) {
  const publicId = getFormString(formData, "publicId");
  const parsed = publicIdSchema.safeParse(publicId);

  if (!parsed.success) {
    redirect(buildNoticeUrl(fallbackPath, "error", "invalid-public-id"));
  }

  return parsed.data;
}

function getEditorReturnPath(locale: Locale, formData: FormData, fallback: string) {
  const value = getFormString(formData, "returnPath");
  return value.startsWith(`/${locale}/editor`) ? value : fallback;
}

function getKeywords(formData: FormData) {
  return getFormString(formData, "keywords")
    .split(",")
    .map((keyword) => keyword.trim())
    .filter(Boolean);
}

function revalidateEditorAndReviewerPaths(locale: Locale, publicId?: string) {
  revalidatePath(`/${locale}/editor`);
  revalidatePath(`/${locale}/editor/submissions`);
  revalidatePath(`/${locale}/editor/publications`);
  revalidatePath(`/${locale}/editor/issues`);
  revalidatePath(`/${locale}/reviewer`);
  revalidatePath(`/${locale}/reviewer/submissions`);

  if (publicId) {
    revalidatePath(`/${locale}/editor/submissions/${publicId}`);
    revalidatePath(`/${locale}/editor/publications/${publicId}`);
    revalidatePath(`/${locale}/reviewer/submissions/${publicId}`);
  }
}

export async function createDraftAction(formData: FormData) {
  const locale = getLocale(formData.get("locale"));
  const user = await requireContributorUser(locale, `/${locale}/dashboard/submissions/new`);

  try {
    const submission = await createDraftSubmission(user.id);

    revalidatePath(`/${locale}/dashboard`);
    revalidatePath(`/${locale}/dashboard/submissions`);
    redirect(
      buildNoticeUrl(
        `/${locale}/dashboard/submissions/${submission.publicId}/edit`,
        "notice",
        "created",
      ),
    );
  } catch (error) {
    const message =
      error instanceof SubmissionError ? error.code : "draft-create-failed";
    redirect(buildNoticeUrl(`/${locale}/dashboard/submissions/new`, "error", message));
  }
}

export async function saveDraftAction(formData: FormData) {
  const locale = getLocale(formData.get("locale"));
  const publicId = getValidatedPublicId(
    locale,
    formData,
    `/${locale}/dashboard/submissions`,
  );
  const user = await requireContributorUser(
    locale,
    `/${locale}/dashboard/submissions/${publicId}/edit`,
  );

  const manuscriptLanguageValue = getOptionalString(formData, "manuscriptLanguage");
  const manuscriptLanguage =
    manuscriptLanguageValue &&
    manuscriptLanguages.includes(
      manuscriptLanguageValue as (typeof manuscriptLanguages)[number],
    )
      ? (manuscriptLanguageValue as (typeof manuscriptLanguages)[number])
      : null;

  if (manuscriptLanguageValue && !manuscriptLanguage) {
    redirect(
      buildNoticeUrl(
        `/${locale}/dashboard/submissions/${publicId}/edit`,
        "error",
        "invalid-draft-input",
      ),
    );
  }

  const fileSizeValue = getOptionalString(formData, "manuscriptSizeBytes");
  const manuscriptSizeBytes =
    fileSizeValue && /^\d+$/.test(fileSizeValue) ? Number(fileSizeValue) : null;

  if (fileSizeValue && manuscriptSizeBytes === null) {
    redirect(
      buildNoticeUrl(
        `/${locale}/dashboard/submissions/${publicId}/edit`,
        "error",
        "invalid-draft-input",
      ),
    );
  }

  try {
    await saveAuthorSubmissionDraft(user, publicId, {
      title: getFormString(formData, "title"),
      abstract: getOptionalString(formData, "abstract"),
      keywords: getKeywords(formData),
      coverLetter: getOptionalString(formData, "coverLetter"),
      introduction: getOptionalString(formData, "introduction"),
      mainContent: getOptionalString(formData, "mainContent"),
      conclusion: getOptionalString(formData, "conclusion"),
      references: getOptionalString(formData, "references"),
      manuscriptLanguage,
      manuscriptFileName: getOptionalString(formData, "manuscriptFileName"),
      manuscriptStorageProvider: getOptionalString(formData, "manuscriptStorageProvider"),
      manuscriptMimeType: getOptionalString(formData, "manuscriptMimeType"),
      manuscriptSizeBytes,
      sourceArchiveFileName: getOptionalString(formData, "sourceArchiveFileName"),
      sourceArchiveStorageProvider: getOptionalString(
        formData,
        "sourceArchiveStorageProvider",
      ),
      sourceArchiveMimeType: getOptionalString(formData, "sourceArchiveMimeType"),
      sourceArchiveSizeBytes:
        (() => {
          const sourceSizeValue = getOptionalString(formData, "sourceArchiveSizeBytes");
          return sourceSizeValue && /^\d+$/.test(sourceSizeValue)
            ? Number(sourceSizeValue)
            : null;
        })(),
    });

    revalidatePath(`/${locale}/dashboard`);
    revalidatePath(`/${locale}/dashboard/submissions`);
    revalidatePath(`/${locale}/dashboard/submissions/${publicId}`);
    redirect(
      buildNoticeUrl(
        `/${locale}/dashboard/submissions/${publicId}/edit`,
        "notice",
        "saved",
      ),
    );
  } catch (error) {
    const message =
      error instanceof SubmissionError ? error.code : "draft-save-failed";
    redirect(
      buildNoticeUrl(`/${locale}/dashboard/submissions/${publicId}/edit`, "error", message),
    );
  }
}

export async function submitDraftAction(formData: FormData) {
  const locale = getLocale(formData.get("locale"));
  const publicId = getValidatedPublicId(
    locale,
    formData,
    `/${locale}/dashboard/submissions`,
  );
  const user = await requireContributorUser(
    locale,
    `/${locale}/dashboard/submissions/${publicId}/edit`,
  );

  try {
    await submitAuthorSubmission(user, publicId);

    revalidatePath(`/${locale}/dashboard`);
    revalidatePath(`/${locale}/dashboard/submissions`);
    revalidatePath(`/${locale}/dashboard/submissions/${publicId}`);
    revalidateEditorAndReviewerPaths(locale, publicId);
    redirect(
      buildNoticeUrl(
        `/${locale}/dashboard/submissions/${publicId}`,
        "notice",
        "submitted",
      ),
    );
  } catch (error) {
    const message =
      error instanceof SubmissionError ? error.code : "draft-submit-failed";
    redirect(
      buildNoticeUrl(`/${locale}/dashboard/submissions/${publicId}/edit`, "error", message),
    );
  }
}

export async function addInternalNoteAction(formData: FormData) {
  const locale = getLocale(formData.get("locale"));
  const publicId = getValidatedPublicId(
    locale,
    formData,
    `/${locale}/editor/submissions`,
  );
  const user = await requireEditorUser(
    locale,
    `/${locale}/editor/submissions/${publicId}`,
  );

  try {
    await addInternalEditorNote(user, publicId, getFormString(formData, "body"));

    revalidatePath(`/${locale}/editor/submissions/${publicId}`);
    redirect(
      buildNoticeUrl(`/${locale}/editor/submissions/${publicId}`, "notice", "note-added"),
    );
  } catch (error) {
    const message =
      error instanceof SubmissionError ? error.code : "internal-note-failed";
    redirect(
      buildNoticeUrl(`/${locale}/editor/submissions/${publicId}`, "error", message),
    );
  }
}

export async function assignReviewerAction(formData: FormData) {
  const locale = getLocale(formData.get("locale"));
  const publicId = getValidatedPublicId(
    locale,
    formData,
    `/${locale}/editor/submissions`,
  );
  const reviewerId = getFormString(formData, "reviewerId");
  const user = await requireEditorUser(
    locale,
    `/${locale}/editor/submissions/${publicId}`,
  );

  try {
    await assignReviewerToSubmission(user, publicId, reviewerId);
    revalidateEditorAndReviewerPaths(locale, publicId);
    redirect(
      buildNoticeUrl(
        `/${locale}/editor/submissions/${publicId}`,
        "notice",
        "reviewer-assigned",
      ),
    );
  } catch (error) {
    const message =
      error instanceof SubmissionError ? error.code : "reviewer-assignment-failed";
    redirect(
      buildNoticeUrl(`/${locale}/editor/submissions/${publicId}`, "error", message),
    );
  }
}

export async function removeReviewerAssignmentAction(formData: FormData) {
  const locale = getLocale(formData.get("locale"));
  const publicId = getValidatedPublicId(
    locale,
    formData,
    `/${locale}/editor/submissions`,
  );
  const reviewerId = getFormString(formData, "reviewerId");
  const user = await requireEditorUser(
    locale,
    `/${locale}/editor/submissions/${publicId}`,
  );

  try {
    await removeReviewerAssignment(user, publicId, reviewerId);
    revalidateEditorAndReviewerPaths(locale, publicId);
    redirect(
      buildNoticeUrl(
        `/${locale}/editor/submissions/${publicId}`,
        "notice",
        "reviewer-removed",
      ),
    );
  } catch (error) {
    const message =
      error instanceof SubmissionError ? error.code : "reviewer-removal-failed";
    redirect(
      buildNoticeUrl(`/${locale}/editor/submissions/${publicId}`, "error", message),
    );
  }
}

export async function saveReviewerReviewAction(formData: FormData) {
  const locale = getLocale(formData.get("locale"));
  const publicId = getValidatedPublicId(
    locale,
    formData,
    `/${locale}/reviewer/submissions`,
  );
  const user = await requireReviewerUser(
    locale,
    `/${locale}/reviewer/submissions/${publicId}`,
  );

  try {
    await saveReviewerReview(user, publicId, {
      decision: getFormString(formData, "decision") as
        | "ACCEPT"
        | "MINOR_REVISION"
        | "MAJOR_REVISION"
        | "REJECT",
      commentsToAuthor: getOptionalString(formData, "commentsToAuthor"),
      commentsToEditor: getOptionalString(formData, "commentsToEditor"),
    });

    revalidateEditorAndReviewerPaths(locale, publicId);
    redirect(
      buildNoticeUrl(
        `/${locale}/reviewer/submissions/${publicId}`,
        "notice",
        "review-saved",
      ),
    );
  } catch (error) {
    const message =
      error instanceof SubmissionError ? error.code : "review-save-failed";
    logOperationalFailure("review.submission.failure", error, {
      action: "saveReviewerReviewAction",
      locale,
      publicId,
      reviewerId: user.id,
    });
    redirect(
      buildNoticeUrl(`/${locale}/reviewer/submissions/${publicId}`, "error", message),
    );
  }
}

export async function updatePublicationSettingsAction(formData: FormData) {
  const locale = getLocale(formData.get("locale"));
  const publicId = getValidatedPublicId(
    locale,
    formData,
    `/${locale}/editor/publications`,
  );
  const returnPath = getEditorReturnPath(
    locale,
    formData,
    `/${locale}/editor/publications/${publicId}`,
  );
  const user = await requireEditorUser(
    locale,
    returnPath,
  );

  const publicationLocaleValue = getOptionalString(formData, "publicationLocale");
  const publicationLocale =
    publicationLocaleValue &&
    publicationLocaleValues.includes(
      publicationLocaleValue as (typeof publicationLocaleValues)[number],
    )
      ? (publicationLocaleValue as (typeof publicationLocaleValues)[number])
      : publicationLocaleValue === null
        ? null
        : "__invalid__";
  const publicationYearValue = getOptionalString(formData, "publicationYear");
  const publicationYear =
    publicationYearValue && /^\d{4}$/.test(publicationYearValue)
      ? Number(publicationYearValue)
      : publicationYearValue === null
        ? null
        : "__invalid__";
  const isPublished = formData.get("isPublished") === "on";
  const publishedAt = getOptionalString(formData, "publishedAt");
  const normalizedPublishedAt =
    isPublished && !publishedAt ? new Date().toISOString() : publishedAt;
  const publishedAtIso =
    normalizedPublishedAt && Number.isNaN(new Date(normalizedPublishedAt).getTime())
      ? "__invalid__"
      : normalizedPublishedAt
        ? new Date(normalizedPublishedAt).toISOString()
        : null;

  if (
    publishedAtIso === "__invalid__" ||
    publicationLocale === "__invalid__" ||
    publicationYear === "__invalid__"
  ) {
    redirect(
      buildNoticeUrl(returnPath, "error", "invalid-publication-input"),
    );
  }

  try {
    await updatePublicationSettings(user, publicId, {
      isPublicationReady: formData.get("isPublicationReady") === "on",
      publicationSlug: getOptionalString(formData, "publicationSlug"),
      publicationTitle: getOptionalString(formData, "publicationTitle"),
      publicationExcerpt: getOptionalString(formData, "publicationExcerpt"),
      publicationTags: getKeywords(formData),
      publicationLocale: publicationLocale as "en" | "zh" | null,
      publicationVolume: getOptionalString(formData, "publicationVolume"),
      publicationIssue: getOptionalString(formData, "publicationIssue"),
      publicationYear: publicationYear as number | null,
      seoTitle: getOptionalString(formData, "seoTitle"),
      seoDescription: getOptionalString(formData, "seoDescription"),
      publishedAt: isPublished ? publishedAtIso : null,
    });

    revalidateEditorAndReviewerPaths(locale, publicId);
    redirect(
      buildNoticeUrl(
        returnPath,
        "notice",
        "publication-updated",
      ),
    );
  } catch (error) {
    const message =
      error instanceof SubmissionError ? error.code : "publication-update-failed";
    logOperationalFailure("publication.transition.failure", error, {
      action: "updatePublicationSettingsAction",
      locale,
      publicId,
      editorId: user.id,
      returnPath,
    });
    redirect(
      buildNoticeUrl(returnPath, "error", message),
    );
  }
}

export async function updateSubmissionStatusAction(formData: FormData) {
  const locale = getLocale(formData.get("locale"));
  const publicId = getValidatedPublicId(
    locale,
    formData,
    `/${locale}/editor/submissions`,
  );
  const user = await requireEditorUser(
    locale,
    `/${locale}/editor/submissions/${publicId}`,
  );

  const nextStatus = getFormString(formData, "status") as SubmissionStatus;
  const note = getOptionalString(formData, "note");

  if (
    ![
      "SUBMITTED",
      "UNDER_REVIEW",
      "REVISION_REQUESTED",
      "ACCEPTED",
      "REJECTED",
    ].includes(nextStatus)
  ) {
    redirect(
      buildNoticeUrl(`/${locale}/editor/submissions/${publicId}`, "error", "invalid-status"),
    );
  }

  try {
    const currentTransitions = getEditorStatusTransitions(
      (getFormString(formData, "currentStatus") as SubmissionStatus) || "SUBMITTED",
    );

    if (currentTransitions.length && !currentTransitions.includes(nextStatus)) {
      redirect(
        buildNoticeUrl(
          `/${locale}/editor/submissions/${publicId}`,
          "error",
          "status-transition-not-allowed",
        ),
      );
    }

    await updateEditorialSubmissionStatus(user, publicId, nextStatus, note ?? undefined);

    revalidatePath(`/${locale}/dashboard/submissions/${publicId}`);
    revalidateEditorAndReviewerPaths(locale, publicId);
    redirect(
      buildNoticeUrl(`/${locale}/editor/submissions/${publicId}`, "notice", "updated"),
    );
  } catch (error) {
    const message =
      error instanceof SubmissionError ? error.code : "status-update-failed";
    redirect(
      buildNoticeUrl(`/${locale}/editor/submissions/${publicId}`, "error", message),
    );
  }
}
