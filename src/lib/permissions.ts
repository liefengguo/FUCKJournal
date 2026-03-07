import type {
  ReviewerAssignmentStatus,
  Submission,
  UserRole,
} from "@prisma/client";

import {
  canAuthorEditStatus,
  canAuthorSubmitStatus,
  isReviewerRole,
  isStaffRole,
} from "@/lib/submission-status";

type Viewer = {
  id: string;
  role: UserRole;
};

export function canUserViewSubmission(viewer: Viewer, submission: Submission) {
  if (isStaffRole(viewer.role)) {
    return submission.status !== "DRAFT";
  }

  if (isReviewerRole(viewer.role)) {
    return false;
  }

  return submission.authorId === viewer.id;
}

export function canUserEditSubmission(viewer: Viewer, submission: Submission) {
  if (isStaffRole(viewer.role)) {
    return false;
  }

  return submission.authorId === viewer.id && canAuthorEditStatus(submission.status);
}

export function canUserSubmitSubmission(viewer: Viewer, submission: Submission) {
  if (isStaffRole(viewer.role)) {
    return false;
  }

  return submission.authorId === viewer.id && canAuthorSubmitStatus(submission.status);
}

export function canUserUpdateSubmissionStatus(role: UserRole) {
  return isStaffRole(role);
}

export function canUserManageReviewAssignments(role: UserRole) {
  return isStaffRole(role);
}

export function canUserManagePublication(role: UserRole) {
  return isStaffRole(role);
}

export function canUserSubmitReview(role: UserRole) {
  return isReviewerRole(role);
}

export function canReviewerAccessAssignment(status: ReviewerAssignmentStatus) {
  return status === "ACTIVE" || status === "COMPLETED";
}
