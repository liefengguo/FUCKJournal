"use server";

import type { SubmissionStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getServerAuthSession } from "@/auth";
import type { Locale } from "@/i18n/routing";
import { isStaffRole } from "@/lib/submission-status";
import {
  createDraftSubmission,
  saveAuthorSubmissionDraft,
  SubmissionError,
  submitAuthorSubmission,
  updateEditorialSubmissionStatus,
} from "@/lib/submissions";
import { manuscriptLanguages } from "@/lib/validations/submission";

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

function requireAuthenticatedUser(locale: Locale) {
  return getServerAuthSession().then((session) => {
    if (!session?.user) {
      redirect(`/${locale}/sign-in`);
    }

    return session.user;
  });
}

export async function createDraftAction(formData: FormData) {
  const locale = getLocale(formData.get("locale"));
  const user = await requireAuthenticatedUser(locale);

  if (isStaffRole(user.role)) {
    redirect(`/${locale}/editor`);
  }

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
      error instanceof SubmissionError ? error.message : "Unable to create a draft right now.";
    redirect(buildNoticeUrl(`/${locale}/dashboard/submissions/new`, "error", message));
  }
}

export async function saveDraftAction(formData: FormData) {
  const locale = getLocale(formData.get("locale"));
  const publicId = getFormString(formData, "publicId");
  const user = await requireAuthenticatedUser(locale);

  if (isStaffRole(user.role)) {
    redirect(`/${locale}/editor`);
  }

  const manuscriptLanguageValue = getOptionalString(formData, "manuscriptLanguage");
  const manuscriptLanguage = manuscriptLanguageValue && manuscriptLanguages.includes(
    manuscriptLanguageValue as (typeof manuscriptLanguages)[number],
  )
    ? (manuscriptLanguageValue as (typeof manuscriptLanguages)[number])
    : null;

  const fileSizeValue = getOptionalString(formData, "manuscriptSizeBytes");
  const manuscriptSizeBytes =
    fileSizeValue && /^\d+$/.test(fileSizeValue) ? Number(fileSizeValue) : null;

  try {
    await saveAuthorSubmissionDraft(user, publicId, {
      title: getFormString(formData, "title"),
      abstract: getOptionalString(formData, "abstract"),
      coverLetter: getOptionalString(formData, "coverLetter"),
      manuscriptLanguage,
      manuscriptFileName: getOptionalString(formData, "manuscriptFileName"),
      manuscriptMimeType: getOptionalString(formData, "manuscriptMimeType"),
      manuscriptSizeBytes,
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
      error instanceof SubmissionError ? error.message : "Unable to save the draft.";
    redirect(
      buildNoticeUrl(`/${locale}/dashboard/submissions/${publicId}/edit`, "error", message),
    );
  }
}

export async function submitDraftAction(formData: FormData) {
  const locale = getLocale(formData.get("locale"));
  const publicId = getFormString(formData, "publicId");
  const user = await requireAuthenticatedUser(locale);

  if (isStaffRole(user.role)) {
    redirect(`/${locale}/editor`);
  }

  try {
    await submitAuthorSubmission(user, publicId);

    revalidatePath(`/${locale}/dashboard`);
    revalidatePath(`/${locale}/dashboard/submissions`);
    revalidatePath(`/${locale}/editor`);
    revalidatePath(`/${locale}/editor/submissions`);
    redirect(
      buildNoticeUrl(
        `/${locale}/dashboard/submissions/${publicId}`,
        "notice",
        "submitted",
      ),
    );
  } catch (error) {
    const message =
      error instanceof SubmissionError ? error.message : "Unable to submit the manuscript.";
    redirect(
      buildNoticeUrl(`/${locale}/dashboard/submissions/${publicId}/edit`, "error", message),
    );
  }
}

export async function updateSubmissionStatusAction(formData: FormData) {
  const locale = getLocale(formData.get("locale"));
  const publicId = getFormString(formData, "publicId");
  const user = await requireAuthenticatedUser(locale);

  if (!isStaffRole(user.role)) {
    redirect(`/${locale}/dashboard`);
  }

  const nextStatus = getFormString(formData, "status") as SubmissionStatus;
  const note = getOptionalString(formData, "note");

  try {
    await updateEditorialSubmissionStatus(user, publicId, nextStatus, note ?? undefined);

    revalidatePath(`/${locale}/editor`);
    revalidatePath(`/${locale}/editor/submissions`);
    revalidatePath(`/${locale}/editor/submissions/${publicId}`);
    revalidatePath(`/${locale}/dashboard/submissions/${publicId}`);
    redirect(
      buildNoticeUrl(`/${locale}/editor/submissions/${publicId}`, "notice", "updated"),
    );
  } catch (error) {
    const message =
      error instanceof SubmissionError ? error.message : "Unable to update status.";
    redirect(
      buildNoticeUrl(`/${locale}/editor/submissions/${publicId}`, "error", message),
    );
  }
}
