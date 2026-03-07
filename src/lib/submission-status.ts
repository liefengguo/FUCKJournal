import type { SubmissionStatus, UserRole } from "@prisma/client";

import type { Locale } from "@/i18n/routing";

export const userEditableStatuses: SubmissionStatus[] = [
  "DRAFT",
  "REVISION_REQUESTED",
];

export const staffRoles: UserRole[] = ["EDITOR", "ADMIN"];

export function isStaffRole(role: UserRole) {
  return staffRoles.includes(role);
}

export function canAuthorEditStatus(status: SubmissionStatus) {
  return userEditableStatuses.includes(status);
}

export function canAuthorSubmitStatus(status: SubmissionStatus) {
  return status === "DRAFT" || status === "REVISION_REQUESTED";
}

export function getEditorStatusTransitions(status: SubmissionStatus) {
  switch (status) {
    case "SUBMITTED":
      return ["UNDER_REVIEW", "REVISION_REQUESTED", "ACCEPTED", "REJECTED"] as SubmissionStatus[];
    case "UNDER_REVIEW":
      return ["REVISION_REQUESTED", "ACCEPTED", "REJECTED"] as SubmissionStatus[];
    case "REVISION_REQUESTED":
      return ["UNDER_REVIEW", "ACCEPTED", "REJECTED"] as SubmissionStatus[];
    case "ACCEPTED":
    case "REJECTED":
      return [] as SubmissionStatus[];
    case "DRAFT":
      return ["SUBMITTED"] as SubmissionStatus[];
    default:
      return [] as SubmissionStatus[];
  }
}

export function getSubmissionStatusLabel(status: SubmissionStatus, locale: Locale) {
  const labels: Record<Locale, Record<SubmissionStatus, string>> = {
    en: {
      DRAFT: "Draft",
      SUBMITTED: "Submitted",
      UNDER_REVIEW: "Under review",
      REVISION_REQUESTED: "Revision requested",
      ACCEPTED: "Accepted",
      REJECTED: "Rejected",
    },
    zh: {
      DRAFT: "草稿",
      SUBMITTED: "已提交",
      UNDER_REVIEW: "审阅中",
      REVISION_REQUESTED: "需修改",
      ACCEPTED: "已接收",
      REJECTED: "已拒稿",
    },
  };

  return labels[locale][status];
}
