import type { Locale } from "@/i18n/routing";
import { credentialsSchema, signUpSchema } from "@/lib/validations/auth";

type Localized<T> = Record<Locale, T>;

export type AuthFeedbackCode =
  | "auth-required"
  | "signed-in"
  | "account-created"
  | "invalid-credentials"
  | "invalid-sign-up-input"
  | "email-taken"
  | "unsupported-media-type"
  | "forbidden-origin"
  | "already-authenticated"
  | "registration-unavailable"
  | "editor-only";

export type SubmissionFeedbackCode =
  | "created"
  | "saved"
  | "submitted"
  | "updated"
  | "submission-not-found"
  | "public-id-generation-failed"
  | "submitted-locked"
  | "under-review-locked"
  | "accepted-locked"
  | "rejected-locked"
  | "not-editable"
  | "invalid-draft-input"
  | "missing-required-submission-fields"
  | "status-update-forbidden"
  | "status-transition-not-allowed"
  | "draft-create-failed"
  | "draft-save-failed"
  | "draft-submit-failed"
  | "status-update-failed"
  | "invalid-status";

const authFeedback: Localized<Record<AuthFeedbackCode, string>> = {
  en: {
    "auth-required": "Sign in to continue to the submission platform.",
    "signed-in": "Signed in successfully.",
    "account-created": "Account created successfully.",
    "invalid-credentials": "Email or password is incorrect.",
    "invalid-sign-up-input": "Please provide a valid name, email and password.",
    "email-taken": "An account with this email already exists.",
    "unsupported-media-type": "The request format is not supported.",
    "forbidden-origin": "This request origin is not allowed.",
    "already-authenticated": "You are already signed in.",
    "registration-unavailable": "Unable to create an account right now.",
    "editor-only": "Editorial routes are available only to editor and admin accounts.",
  },
  zh: {
    "auth-required": "请先登录后再进入投稿平台。",
    "signed-in": "登录成功。",
    "account-created": "账户创建成功。",
    "invalid-credentials": "邮箱或密码不正确。",
    "invalid-sign-up-input": "请输入有效的姓名、邮箱和密码。",
    "email-taken": "这个邮箱已经注册过账户。",
    "unsupported-media-type": "当前请求格式不被支持。",
    "forbidden-origin": "当前请求来源不被允许。",
    "already-authenticated": "你已经登录。",
    "registration-unavailable": "暂时无法创建账户。",
    "editor-only": "编辑台仅对编辑和管理员开放。",
  },
};

const submissionFeedback: Localized<{
  notices: Record<"created" | "saved" | "submitted" | "updated", string>;
  errors: Record<Exclude<SubmissionFeedbackCode, "created" | "saved" | "submitted" | "updated">, string>;
  timelineEmpty: string;
  timelineEmptyDraft: string;
}> = {
  en: {
    notices: {
      created: "Draft created.",
      saved: "Draft saved.",
      submitted: "Manuscript submitted to the editorial queue.",
      updated: "Submission status updated.",
    },
    errors: {
      "submission-not-found": "The requested submission could not be found.",
      "public-id-generation-failed":
        "A stable submission identifier could not be generated.",
      "submitted-locked":
        "Submitted manuscripts are locked while they wait for editorial review.",
      "under-review-locked":
        "Manuscripts under review are locked until the editorial team requests changes or reaches a decision.",
      "accepted-locked":
        "Accepted manuscripts are no longer editable in the author workspace.",
      "rejected-locked":
        "Rejected manuscripts remain archived in read-only form.",
      "not-editable": "This submission is not editable.",
      "invalid-draft-input":
        "Please review the manuscript fields and provide valid draft data.",
      "missing-required-submission-fields":
        "Add a title and a substantive abstract before submitting the manuscript.",
      "status-update-forbidden":
        "Only editors and administrators can update submission status.",
      "status-transition-not-allowed":
        "This status change is not allowed from the current state.",
      "draft-create-failed": "Unable to create a draft right now.",
      "draft-save-failed": "Unable to save the draft.",
      "draft-submit-failed": "Unable to submit the manuscript.",
      "status-update-failed": "Unable to update submission status.",
      "invalid-status": "Select a valid next status.",
    },
    timelineEmpty:
      "No status events have been recorded yet. The submission remains in its current state.",
    timelineEmptyDraft:
      "No status events have been recorded yet. The manuscript is still in draft.",
  },
  zh: {
    notices: {
      created: "草稿已创建。",
      saved: "草稿已保存。",
      submitted: "稿件已提交到编辑队列。",
      updated: "稿件状态已更新。",
    },
    errors: {
      "submission-not-found": "未找到对应稿件。",
      "public-id-generation-failed": "无法生成稳定的稿件编号。",
      "submitted-locked": "稿件提交后，在编辑审阅期间作者无法继续修改。",
      "under-review-locked": "稿件审阅中，只有在编辑要求修改或给出决定后才会重新开放。",
      "accepted-locked": "已接收稿件在作者工作区中不可继续编辑。",
      "rejected-locked": "被拒稿件会以只读形式保留。",
      "not-editable": "当前稿件不可编辑。",
      "invalid-draft-input": "请检查稿件字段并填写有效内容。",
      "missing-required-submission-fields": "正式提交前请至少完善标题和较完整的摘要。",
      "status-update-forbidden": "只有编辑和管理员可以修改稿件状态。",
      "status-transition-not-allowed": "当前状态不允许执行这个变更。",
      "draft-create-failed": "暂时无法创建草稿。",
      "draft-save-failed": "暂时无法保存草稿。",
      "draft-submit-failed": "暂时无法提交稿件。",
      "status-update-failed": "暂时无法更新稿件状态。",
      "invalid-status": "请选择有效的下一状态。",
    },
    timelineEmpty: "当前还没有状态事件记录，稿件会保持在现有状态。",
    timelineEmptyDraft: "当前还没有状态事件记录，稿件仍处于草稿阶段。",
  },
};

const authValidation: Localized<{
  invalidEmail: string;
  passwordTooShort: string;
  nameTooShort: string;
}> = {
  en: {
    invalidEmail: "Enter a valid email address.",
    passwordTooShort: "Password must be at least 8 characters.",
    nameTooShort: "Name must be at least 2 characters.",
  },
  zh: {
    invalidEmail: "请输入有效的邮箱地址。",
    passwordTooShort: "密码至少需要 8 个字符。",
    nameTooShort: "姓名至少需要 2 个字符。",
  },
};

function dedupeMessages(messages: string[]) {
  return Array.from(new Set(messages));
}

export function getAuthFeedback(locale: Locale, code: string | undefined) {
  if (!code) {
    return null;
  }

  return authFeedback[locale][code as AuthFeedbackCode] ?? code;
}

export function getSubmissionNotice(locale: Locale, code: string | undefined) {
  if (!code) {
    return null;
  }

  return submissionFeedback[locale].notices[code as keyof typeof submissionFeedback.en.notices] ?? null;
}

export function getSubmissionError(locale: Locale, code: string | undefined) {
  if (!code) {
    return null;
  }

  return submissionFeedback[locale].errors[
    code as keyof typeof submissionFeedback.en.errors
  ] ?? code;
}

export function getSubmissionTimelineEmptyMessage(
  locale: Locale,
  isDraft: boolean,
) {
  return isDraft
    ? submissionFeedback[locale].timelineEmptyDraft
    : submissionFeedback[locale].timelineEmpty;
}

export function getCredentialValidationMessages(
  locale: Locale,
  values: {
    email: string;
    password: string;
  },
) {
  const parsed = credentialsSchema.safeParse(values);

  if (parsed.success) {
    return [];
  }

  const fieldErrors = parsed.error.flatten().fieldErrors;
  const messages: string[] = [];

  if (fieldErrors.email?.length) {
    messages.push(authValidation[locale].invalidEmail);
  }

  if (fieldErrors.password?.length) {
    messages.push(authValidation[locale].passwordTooShort);
  }

  return dedupeMessages(messages);
}

export function getSignUpValidationMessages(
  locale: Locale,
  values: {
    name: string;
    email: string;
    password: string;
  },
) {
  const parsed = signUpSchema.safeParse(values);

  if (parsed.success) {
    return [];
  }

  const fieldErrors = parsed.error.flatten().fieldErrors;
  const messages: string[] = [];

  if (fieldErrors.name?.length) {
    messages.push(authValidation[locale].nameTooShort);
  }

  if (fieldErrors.email?.length) {
    messages.push(authValidation[locale].invalidEmail);
  }

  if (fieldErrors.password?.length) {
    messages.push(authValidation[locale].passwordTooShort);
  }

  return dedupeMessages(messages);
}
