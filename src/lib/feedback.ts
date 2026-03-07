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
  | "editor-only"
  | "reviewer-only";

export type SubmissionFeedbackCode =
  | "created"
  | "saved"
  | "submitted"
  | "updated"
  | "asset-uploaded"
  | "note-added"
  | "reviewer-assigned"
  | "reviewer-removed"
  | "review-saved"
  | "publication-updated"
  | "submission-not-found"
  | "asset-not-found"
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
  | "invalid-status"
  | "invalid-manuscript-file"
  | "invalid-source-file"
  | "upload-too-large"
  | "storage-misconfigured"
  | "upload-failed"
  | "download-failed"
  | "invalid-editor-note"
  | "internal-note-failed"
  | "reviewer-not-assigned"
  | "reviewer-already-assigned"
  | "invalid-review-input"
  | "review-save-failed"
  | "reviewer-assignment-failed"
  | "reviewer-removal-failed"
  | "invalid-reviewer"
  | "publication-not-allowed"
  | "invalid-publication-input"
  | "publication-slug-taken"
  | "publication-update-failed"
  | "review-closed";

type VersionLabelCode =
  | "Draft Created"
  | "Draft Save"
  | "Revision Draft Save"
  | "Submission"
  | "Revision Resubmission";

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
    "reviewer-only": "Reviewer routes are available only to reviewer accounts.",
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
    "reviewer-only": "审稿后台仅对审稿人账户开放。",
  },
};

const submissionFeedback: Localized<{
  notices: Record<
    | "created"
    | "saved"
    | "submitted"
    | "updated"
    | "asset-uploaded"
    | "note-added"
    | "reviewer-assigned"
    | "reviewer-removed"
    | "review-saved"
    | "publication-updated",
    string
  >;
  errors: Record<
    Exclude<
      SubmissionFeedbackCode,
      | "created"
      | "saved"
      | "submitted"
      | "updated"
      | "asset-uploaded"
      | "note-added"
      | "reviewer-assigned"
      | "reviewer-removed"
      | "review-saved"
      | "publication-updated"
    >,
    string
  >;
  timelineEmpty: string;
  timelineEmptyDraft: string;
  versionLabels: Record<
    VersionLabelCode,
    string
  >;
}> = {
  en: {
    notices: {
      created: "Draft created.",
      saved: "Draft saved.",
      submitted: "Manuscript submitted to the editorial queue.",
      updated: "Submission status updated.",
      "asset-uploaded": "File uploaded successfully.",
      "note-added": "Internal editor note added.",
      "reviewer-assigned": "Reviewer assigned.",
      "reviewer-removed": "Reviewer assignment removed.",
      "review-saved": "Review saved.",
      "publication-updated": "Publication settings updated.",
    },
    errors: {
      "submission-not-found": "The requested submission could not be found.",
      "asset-not-found": "The requested file could not be found.",
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
        "Complete the title, abstract, keywords and main content before submitting the manuscript.",
      "status-update-forbidden":
        "Only editors and administrators can update submission status.",
      "status-transition-not-allowed":
        "This status change is not allowed from the current state.",
      "draft-create-failed": "Unable to create a draft right now.",
      "draft-save-failed": "Unable to save the draft.",
      "draft-submit-failed": "Unable to submit the manuscript.",
      "status-update-failed": "Unable to update submission status.",
      "invalid-status": "Select a valid next status.",
      "invalid-manuscript-file": "Upload a PDF file for the manuscript.",
      "invalid-source-file": "Upload a ZIP archive for the source package.",
      "upload-too-large": "The selected file exceeds the allowed size limit.",
      "storage-misconfigured":
        "File storage is not configured for this environment yet.",
      "upload-failed": "Unable to upload the file right now.",
      "download-failed": "Unable to download the requested file right now.",
      "invalid-editor-note":
        "Internal notes should be between 5 and 5000 characters.",
      "internal-note-failed": "Unable to save the internal editor note.",
      "reviewer-not-assigned":
        "This reviewer does not currently have access to the submission.",
      "reviewer-already-assigned":
        "This reviewer is already assigned to the submission.",
      "invalid-review-input":
        "Please provide a valid review recommendation and comments.",
      "review-save-failed": "Unable to save the review.",
      "reviewer-assignment-failed": "Unable to assign the reviewer.",
      "reviewer-removal-failed": "Unable to remove the reviewer assignment.",
      "invalid-reviewer": "Select a valid reviewer account.",
      "publication-not-allowed":
        "Only accepted submissions can be marked as publication-ready.",
      "invalid-publication-input":
        "Please provide valid publication settings and a clean slug.",
      "publication-slug-taken":
        "This publication slug is already in use. Choose a different slug.",
      "publication-update-failed": "Unable to update publication settings.",
      "review-closed":
        "Reviews can be submitted only while the manuscript is under review.",
    },
    timelineEmpty:
      "No status events have been recorded yet. The submission remains in its current state.",
    timelineEmptyDraft:
      "No status events have been recorded yet. The manuscript is still in draft.",
    versionLabels: {
      "Draft Created": "Draft Created",
      "Draft Save": "Draft Save",
      "Revision Draft Save": "Revision Draft Save",
      Submission: "Submission",
      "Revision Resubmission": "Revision Resubmission",
    },
  },
  zh: {
    notices: {
      created: "草稿已创建。",
      saved: "草稿已保存。",
      submitted: "稿件已提交到编辑队列。",
      updated: "稿件状态已更新。",
      "asset-uploaded": "文件上传成功。",
      "note-added": "内部编辑备注已添加。",
      "reviewer-assigned": "审稿人已分配。",
      "reviewer-removed": "审稿分配已移除。",
      "review-saved": "审稿意见已保存。",
      "publication-updated": "出版准备设置已更新。",
    },
    errors: {
      "submission-not-found": "未找到对应稿件。",
      "asset-not-found": "未找到对应文件。",
      "public-id-generation-failed": "无法生成稳定的稿件编号。",
      "submitted-locked": "稿件提交后，在编辑审阅期间作者无法继续修改。",
      "under-review-locked": "稿件审阅中，只有在编辑要求修改或给出决定后才会重新开放。",
      "accepted-locked": "已接收稿件在作者工作区中不可继续编辑。",
      "rejected-locked": "被拒稿件会以只读形式保留。",
      "not-editable": "当前稿件不可编辑。",
      "invalid-draft-input": "请检查稿件字段并填写有效内容。",
      "missing-required-submission-fields": "正式提交前请完善标题、摘要、关键词和正文。",
      "status-update-forbidden": "只有编辑和管理员可以修改稿件状态。",
      "status-transition-not-allowed": "当前状态不允许执行这个变更。",
      "draft-create-failed": "暂时无法创建草稿。",
      "draft-save-failed": "暂时无法保存草稿。",
      "draft-submit-failed": "暂时无法提交稿件。",
      "status-update-failed": "暂时无法更新稿件状态。",
      "invalid-status": "请选择有效的下一状态。",
      "invalid-manuscript-file": "稿件文件请上传 PDF。",
      "invalid-source-file": "源文件包请上传 ZIP 压缩包。",
      "upload-too-large": "所选文件超过了允许的大小限制。",
      "storage-misconfigured": "当前环境尚未完成文件存储配置。",
      "upload-failed": "暂时无法上传文件。",
      "download-failed": "暂时无法下载该文件。",
      "invalid-editor-note": "内部备注长度应在 5 到 5000 个字符之间。",
      "internal-note-failed": "暂时无法保存内部编辑备注。",
      "reviewer-not-assigned": "这位审稿人当前没有该稿件的访问权限。",
      "reviewer-already-assigned": "这位审稿人已经被分配到该稿件。",
      "invalid-review-input": "请填写有效的审稿建议和意见。",
      "review-save-failed": "暂时无法保存审稿意见。",
      "reviewer-assignment-failed": "暂时无法分配审稿人。",
      "reviewer-removal-failed": "暂时无法移除审稿分配。",
      "invalid-reviewer": "请选择有效的审稿人账户。",
      "publication-not-allowed": "只有已接收稿件才能标记为可进入出版准备。",
      "invalid-publication-input": "请填写有效的出版设置与规范 slug。",
      "publication-slug-taken": "这个出版 slug 已被使用，请更换一个。",
      "publication-update-failed": "暂时无法更新出版准备设置。",
      "review-closed": "只有在稿件处于审稿中时才能提交审稿意见。",
    },
    timelineEmpty: "当前还没有状态事件记录，稿件会保持在现有状态。",
    timelineEmptyDraft: "当前还没有状态事件记录，稿件仍处于草稿阶段。",
    versionLabels: {
      "Draft Created": "创建草稿",
      "Draft Save": "保存草稿",
      "Revision Draft Save": "修改稿保存",
      Submission: "正式提交",
      "Revision Resubmission": "修改后再提交",
    },
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

export function getVersionLabel(locale: Locale, label: string) {
  return (
    submissionFeedback[locale].versionLabels[label as VersionLabelCode] ?? label
  );
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
