import type { Locale } from "@/i18n/routing";

type Localized<T> = Record<Locale, T>;

type SubmitPortalCopy = {
  guestTitle: string;
  guestBody: string;
  signInLabel: string;
  signUpLabel: string;
  authNote: string;
  memberTitle: string;
  memberBody: string;
  createDraftLabel: string;
  dashboardLabel: string;
  editorLabel: string;
  signedInAs: string;
};

type AuthPageCopy = {
  title: string;
  intro: string;
  submitLabel: string;
  alternateLabel: string;
  alternateHref: string;
  alternateText: string;
  nameLabel?: string;
  emailLabel: string;
  passwordLabel: string;
  submittingLabel: string;
  errorPrefix: string;
};

type DashboardCopy = {
  title: string;
  intro: string;
  overviewTitle: string;
  submissionsTitle: string;
  emptyTitle: string;
  emptyBody: string;
  createDraftLabel: string;
  viewAllLabel: string;
  newDraftTitle: string;
  newDraftBody: string;
  draftCountLabel: string;
  submittedCountLabel: string;
  revisionCountLabel: string;
};

type EditorCopy = {
  title: string;
  intro: string;
  overviewTitle: string;
  queueTitle: string;
  emptyTitle: string;
  emptyBody: string;
  submittedCountLabel: string;
  reviewCountLabel: string;
  revisionCountLabel: string;
  acceptedCountLabel: string;
};

type SubmissionCopy = {
  submissionsTitle: string;
  submissionsIntro: string;
  detailTitle: string;
  editTitle: string;
  editIntro: string;
  newTitle: string;
  newIntro: string;
  titleLabel: string;
  abstractLabel: string;
  coverLetterLabel: string;
  languageLabel: string;
  fileNameLabel: string;
  mimeTypeLabel: string;
  fileSizeLabel: string;
  metadataNote: string;
  saveDraftLabel: string;
  submitManuscriptLabel: string;
  createDraftLabel: string;
  backToDashboardLabel: string;
  backToQueueLabel: string;
  noSubmissions: string;
  statusHistoryTitle: string;
  versionTitle: string;
  versionBody: string;
  statusLabel: string;
  updatedLabel: string;
  submittedLabel: string;
  authorLabel: string;
  emailLabel: string;
  latestVersionLabel: string;
  noteLabel: string;
  updateStatusLabel: string;
  statusActionHint: string;
  editorReadonlyNote: string;
  draftGateTitle: string;
  draftGateBody: string;
  reviseGateBody: string;
  submittedGateBody: string;
  underReviewGateBody: string;
  acceptedGateBody: string;
  rejectedGateBody: string;
  notices: {
    created: string;
    saved: string;
    submitted: string;
    updated: string;
  };
};

type PlatformCopy = {
  submitPortal: SubmitPortalCopy;
  signIn: AuthPageCopy;
  signUp: AuthPageCopy;
  dashboard: DashboardCopy;
  editor: EditorCopy;
  submission: SubmissionCopy;
};

const copy: Localized<PlatformCopy> = {
  en: {
    submitPortal: {
      guestTitle: "Begin a submission",
      guestBody:
        "Create an account to draft, revise and submit manuscripts through the journal platform. The public site remains open; the submission workflow now lives behind a private workspace.",
      signInLabel: "Sign in",
      signUpLabel: "Create account",
      authNote:
        "Credentials-based access is enabled for Phase 1. Editorial review and file storage will expand in later phases.",
      memberTitle: "Submission workspace",
      memberBody:
        "Create a new draft, continue an existing manuscript, or move into the editorial queue if you are part of the journal staff.",
      createDraftLabel: "Create draft",
      dashboardLabel: "Open dashboard",
      editorLabel: "Open editorial desk",
      signedInAs: "Signed in as",
    },
    signIn: {
      title: "Sign in",
      intro:
        "Access your private workspace to draft, revise and submit manuscripts to F.U.C.K Journal.",
      submitLabel: "Sign in",
      alternateLabel: "Create an account",
      alternateHref: "/sign-up",
      alternateText: "Need an account?",
      emailLabel: "Email",
      passwordLabel: "Password",
      submittingLabel: "Signing in...",
      errorPrefix: "Sign-in failed",
    },
    signUp: {
      title: "Create an account",
      intro:
        "Open a contributor account to save drafts, return to revisions and submit your manuscript when it is ready.",
      submitLabel: "Create account",
      alternateLabel: "Sign in",
      alternateHref: "/sign-in",
      alternateText: "Already have an account?",
      nameLabel: "Name",
      emailLabel: "Email",
      passwordLabel: "Password",
      submittingLabel: "Creating account...",
      errorPrefix: "Registration failed",
    },
    dashboard: {
      title: "Contributor dashboard",
      intro:
        "Manage your manuscript drafts, revisions and submission history without affecting the public journal site.",
      overviewTitle: "Overview",
      submissionsTitle: "Recent submissions",
      emptyTitle: "No submissions yet",
      emptyBody:
        "Create a draft to begin your first manuscript. You can save revisions before sending it to the editorial queue.",
      createDraftLabel: "Create draft",
      viewAllLabel: "View all submissions",
      newDraftTitle: "Start a new draft",
      newDraftBody:
        "A draft opens a private workspace for your title, abstract, cover letter and manuscript metadata.",
      draftCountLabel: "Drafts",
      submittedCountLabel: "Submitted",
      revisionCountLabel: "Revisions requested",
    },
    editor: {
      title: "Editorial desk",
      intro:
        "Review the current submission queue and update editorial status without modifying author manuscript content.",
      overviewTitle: "Queue overview",
      queueTitle: "Active submissions",
      emptyTitle: "No active submissions",
      emptyBody: "Submitted manuscripts will appear here once authors send them to the queue.",
      submittedCountLabel: "Submitted",
      reviewCountLabel: "Under review",
      revisionCountLabel: "Revision requested",
      acceptedCountLabel: "Accepted",
    },
    submission: {
      submissionsTitle: "Submissions",
      submissionsIntro:
        "Drafts remain private. Only submitted manuscripts enter the editorial queue.",
      detailTitle: "Submission detail",
      editTitle: "Edit manuscript",
      editIntro:
        "Update your manuscript metadata and save a new snapshot. Version history is recorded even though it is not yet exposed as a full interface.",
      newTitle: "Create draft",
      newIntro:
        "Open a blank draft now. You will be redirected to the manuscript editor immediately after creation.",
      titleLabel: "Title",
      abstractLabel: "Abstract",
      coverLetterLabel: "Cover letter",
      languageLabel: "Manuscript language",
      fileNameLabel: "Manuscript filename",
      mimeTypeLabel: "MIME type",
      fileSizeLabel: "File size (bytes)",
      metadataNote:
        "Storage remains intentionally neutral in Phase 1. Record the manuscript metadata now; file storage will be connected later.",
      saveDraftLabel: "Save draft",
      submitManuscriptLabel: "Submit manuscript",
      createDraftLabel: "Create draft",
      backToDashboardLabel: "Back to dashboard",
      backToQueueLabel: "Back to editorial desk",
      noSubmissions: "No submissions have been created yet.",
      statusHistoryTitle: "Status history",
      versionTitle: "Version history",
      versionBody:
        "Each save creates an internal version snapshot. Phase 1 records it now so a fuller history UI can arrive later without schema changes.",
      statusLabel: "Status",
      updatedLabel: "Last updated",
      submittedLabel: "Submitted",
      authorLabel: "Author",
      emailLabel: "Email",
      latestVersionLabel: "Latest version",
      noteLabel: "Editorial note",
      updateStatusLabel: "Update status",
      statusActionHint:
        "Editors and administrators can change status, but manuscript fields remain read-only in the editorial interface.",
      editorReadonlyNote:
        "The editorial desk is intentionally read-only for author content in Phase 1.",
      draftGateTitle: "Editing permissions",
      draftGateBody: "Drafts remain editable until the manuscript is submitted.",
      reviseGateBody:
        "Revision requests reopen the manuscript for author updates until it is submitted again.",
      submittedGateBody:
        "Submitted manuscripts are locked for authors while they wait for editorial review.",
      underReviewGateBody:
        "Manuscripts under review are locked for authors until the editorial team requests changes or records a decision.",
      acceptedGateBody:
        "Accepted manuscripts are locked. Any further editorial work should happen outside the author dashboard.",
      rejectedGateBody:
        "Rejected manuscripts remain archived in read-only form for reference.",
      notices: {
        created: "Draft created.",
        saved: "Draft saved.",
        submitted: "Manuscript submitted to the editorial queue.",
        updated: "Submission status updated.",
      },
    },
  },
  zh: {
    submitPortal: {
      guestTitle: "开始投稿",
      guestBody:
        "创建账户后，你可以在期刊平台内保存草稿、修改稿件并正式提交。公开网站保持不变，投稿流程现已进入私有工作区。",
      signInLabel: "登录",
      signUpLabel: "注册账户",
      authNote:
        "Phase 1 先启用邮箱与密码登录。编辑流程与文件存储会在后续阶段继续扩展。",
      memberTitle: "投稿工作区",
      memberBody:
        "你可以新建草稿、继续编辑已有稿件；如果你属于编辑团队，也可以直接进入编辑台。",
      createDraftLabel: "新建草稿",
      dashboardLabel: "打开投稿后台",
      editorLabel: "打开编辑台",
      signedInAs: "当前身份",
    },
    signIn: {
      title: "登录",
      intro:
        "进入私有工作区，起草、修改并向 F.U.C.K Journal 提交稿件。",
      submitLabel: "登录",
      alternateLabel: "注册账户",
      alternateHref: "/sign-up",
      alternateText: "还没有账户？",
      emailLabel: "邮箱",
      passwordLabel: "密码",
      submittingLabel: "登录中...",
      errorPrefix: "登录失败",
    },
    signUp: {
      title: "注册账户",
      intro:
        "创建投稿者账户后，你可以保存草稿、返回修改稿，并在准备完成后正式提交。",
      submitLabel: "创建账户",
      alternateLabel: "登录",
      alternateHref: "/sign-in",
      alternateText: "已经有账户？",
      nameLabel: "姓名",
      emailLabel: "邮箱",
      passwordLabel: "密码",
      submittingLabel: "创建中...",
      errorPrefix: "注册失败",
    },
    dashboard: {
      title: "投稿者后台",
      intro:
        "在不影响公开期刊页面的前提下，管理你的稿件草稿、修改稿与提交记录。",
      overviewTitle: "概览",
      submissionsTitle: "最近稿件",
      emptyTitle: "还没有投稿",
      emptyBody:
        "先新建一个草稿，再逐步完善标题、摘要和稿件信息，准备好后再提交到编辑队列。",
      createDraftLabel: "新建草稿",
      viewAllLabel: "查看全部稿件",
      newDraftTitle: "新建草稿",
      newDraftBody:
        "草稿会为你的标题、摘要、附信与稿件元数据打开一个私有工作区。",
      draftCountLabel: "草稿",
      submittedCountLabel: "已提交",
      revisionCountLabel: "需修改",
    },
    editor: {
      title: "编辑台",
      intro:
        "查看当前投稿队列，并在不修改作者正文内容的前提下更新编辑状态。",
      overviewTitle: "队列概览",
      queueTitle: "活跃稿件",
      emptyTitle: "当前没有活跃稿件",
      emptyBody: "作者正式提交后，稿件会出现在这里。",
      submittedCountLabel: "已提交",
      reviewCountLabel: "审阅中",
      revisionCountLabel: "需修改",
      acceptedCountLabel: "已接收",
    },
    submission: {
      submissionsTitle: "稿件",
      submissionsIntro:
        "草稿仅作者本人可见；只有正式提交后才会进入编辑队列。",
      detailTitle: "稿件详情",
      editTitle: "编辑稿件",
      editIntro:
        "更新稿件元数据并保存新快照。版本历史已经在数据库中记录，只是当前界面还未完整展开。",
      newTitle: "新建草稿",
      newIntro:
        "现在即可创建空白草稿。创建成功后会立刻跳转到稿件编辑页。",
      titleLabel: "标题",
      abstractLabel: "摘要",
      coverLetterLabel: "附信",
      languageLabel: "稿件语言",
      fileNameLabel: "稿件文件名",
      mimeTypeLabel: "MIME 类型",
      fileSizeLabel: "文件大小（字节）",
      metadataNote:
        "Phase 1 暂不接入实际文件存储。当前先记录稿件元数据，后续再接入具体存储层。",
      saveDraftLabel: "保存草稿",
      submitManuscriptLabel: "正式提交",
      createDraftLabel: "新建草稿",
      backToDashboardLabel: "返回后台",
      backToQueueLabel: "返回编辑台",
      noSubmissions: "目前还没有创建任何稿件。",
      statusHistoryTitle: "状态记录",
      versionTitle: "版本记录",
      versionBody:
        "每次保存都会生成内部版本快照。Phase 1 先把数据结构落下，后续可以直接扩展为完整版本历史界面。",
      statusLabel: "状态",
      updatedLabel: "最后更新",
      submittedLabel: "提交时间",
      authorLabel: "作者",
      emailLabel: "邮箱",
      latestVersionLabel: "最新版本",
      noteLabel: "编辑备注",
      updateStatusLabel: "更新状态",
      statusActionHint:
        "编辑和管理员可以修改状态，但在编辑台中不能修改作者稿件内容。",
      editorReadonlyNote: "Phase 1 中，编辑台对作者内容保持只读。",
      draftGateTitle: "编辑权限",
      draftGateBody: "草稿在正式提交前可持续编辑。",
      reviseGateBody: "当编辑要求修改后，作者可以重新编辑，直到再次提交为止。",
      submittedGateBody: "稿件一旦提交，作者在编辑团队处理期间无法继续修改。",
      underReviewGateBody: "审阅中的稿件会保持锁定，直到编辑要求修改或记录最终决定。",
      acceptedGateBody: "已接收稿件保持锁定。后续编辑工作应在作者后台之外进行。",
      rejectedGateBody: "被拒稿件会以只读方式保留，供作者后续参考。",
      notices: {
        created: "草稿已创建。",
        saved: "草稿已保存。",
        submitted: "稿件已提交到编辑队列。",
        updated: "稿件状态已更新。",
      },
    },
  },
};

export function getPlatformCopy(locale: Locale) {
  return copy[locale];
}

export function getSubmissionNotice(locale: Locale, code: string | undefined) {
  const notices = copy[locale].submission.notices;

  switch (code) {
    case "created":
      return notices.created;
    case "saved":
      return notices.saved;
    case "submitted":
      return notices.submitted;
    case "updated":
      return notices.updated;
    default:
      return null;
  }
}
