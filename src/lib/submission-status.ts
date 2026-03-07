import type {
  ReviewDecision,
  ReviewerAssignmentStatus,
  SubmissionStatus,
  UserRole,
} from "@prisma/client";

import type { Locale } from "@/i18n/routing";

export const userEditableStatuses: SubmissionStatus[] = [
  "DRAFT",
  "REVISION_REQUESTED",
];

export const staffRoles: UserRole[] = ["EDITOR", "ADMIN"];
export const reviewerRoles: UserRole[] = ["REVIEWER"];

export function isStaffRole(role: UserRole) {
  return staffRoles.includes(role);
}

export function isReviewerRole(role: UserRole) {
  return reviewerRoles.includes(role);
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
      return ["UNDER_REVIEW", "REJECTED"] as SubmissionStatus[];
    case "UNDER_REVIEW":
      return ["REVISION_REQUESTED", "ACCEPTED", "REJECTED"] as SubmissionStatus[];
    case "REVISION_REQUESTED":
      return ["UNDER_REVIEW", "ACCEPTED", "REJECTED"] as SubmissionStatus[];
    case "ACCEPTED":
    case "REJECTED":
      return [] as SubmissionStatus[];
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

export function getReviewDecisionLabel(decision: ReviewDecision, locale: Locale) {
  const labels: Record<Locale, Record<ReviewDecision, string>> = {
    en: {
      ACCEPT: "Accept",
      MINOR_REVISION: "Minor revision",
      MAJOR_REVISION: "Major revision",
      REJECT: "Reject",
    },
    zh: {
      ACCEPT: "接收",
      MINOR_REVISION: "小修",
      MAJOR_REVISION: "大修",
      REJECT: "拒绝",
    },
  };

  return labels[locale][decision];
}

export function getReviewerAssignmentStatusLabel(
  status: ReviewerAssignmentStatus,
  locale: Locale,
) {
  const labels: Record<Locale, Record<ReviewerAssignmentStatus, string>> = {
    en: {
      ACTIVE: "Active",
      COMPLETED: "Completed",
      REMOVED: "Removed",
    },
    zh: {
      ACTIVE: "进行中",
      COMPLETED: "已完成",
      REMOVED: "已移除",
    },
  };

  return labels[locale][status];
}
