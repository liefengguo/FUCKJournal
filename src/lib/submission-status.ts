import type {
  PublicationAuditAction,
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

export const publicationPipelineStates = [
  "ACCEPTED_PENDING",
  "READY",
  "PUBLISHED",
] as const;

export type PublicationPipelineState =
  (typeof publicationPipelineStates)[number];

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
      DRAFT: "In preparation",
      SUBMITTED: "Editorial screening",
      UNDER_REVIEW: "Under review",
      REVISION_REQUESTED: "Revision requested",
      ACCEPTED: "Accepted",
      REJECTED: "Rejected",
    },
    zh: {
      DRAFT: "准备中",
      SUBMITTED: "编辑初筛",
      UNDER_REVIEW: "外审中",
      REVISION_REQUESTED: "等待返修",
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

export function getPublicationPipelineState(submission: {
  isPublicationReady: boolean;
  publishedAt: Date | null;
}) {
  if (submission.publishedAt) {
    return "PUBLISHED" as const;
  }

  if (submission.isPublicationReady) {
    return "READY" as const;
  }

  return "ACCEPTED_PENDING" as const;
}

export function getPublicationPipelineStateLabel(
  state: PublicationPipelineState,
  locale: Locale,
) {
  const labels: Record<Locale, Record<PublicationPipelineState, string>> = {
    en: {
      ACCEPTED_PENDING: "Accepted, not publication-ready",
      READY: "Publication-ready",
      PUBLISHED: "Published",
    },
    zh: {
      ACCEPTED_PENDING: "已接收，未进入出版准备",
      READY: "已进入出版准备",
      PUBLISHED: "已发布",
    },
  };

  return labels[locale][state];
}

export function getPublicationAuditActionLabel(
  action: PublicationAuditAction,
  locale: Locale,
) {
  const labels: Record<Locale, Record<PublicationAuditAction, string>> = {
    en: {
      METADATA_UPDATED: "Metadata updated",
      MARKED_READY: "Marked publication-ready",
      MARKED_UNREADY: "Removed from publication-ready",
      MARKED_PUBLISHED: "Marked published",
      MARKED_UNPUBLISHED: "Publication mark removed",
    },
    zh: {
      METADATA_UPDATED: "已更新出版元数据",
      MARKED_READY: "已标记为出版准备就绪",
      MARKED_UNREADY: "已取消出版准备状态",
      MARKED_PUBLISHED: "已标记为发布",
      MARKED_UNPUBLISHED: "已取消发布标记",
    },
  };

  return labels[locale][action];
}
