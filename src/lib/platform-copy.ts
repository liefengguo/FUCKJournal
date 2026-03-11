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
  publicationsTitle: string;
  issuesTitle: string;
  emptyTitle: string;
  emptyBody: string;
  submittedCountLabel: string;
  reviewCountLabel: string;
  revisionCountLabel: string;
  acceptedCountLabel: string;
  publicationPendingCountLabel: string;
  publicationReadyCountLabel: string;
  publishedCountLabel: string;
};

type ReviewerCopy = {
  title: string;
  intro: string;
  overviewTitle: string;
  assignmentsTitle: string;
  emptyTitle: string;
  emptyBody: string;
  activeCountLabel: string;
  completedCountLabel: string;
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
  reviewer: ReviewerCopy;
  submission: SubmissionCopy;
};

const copy: Localized<PlatformCopy> = {
  en: {
    submitPortal: {
      guestTitle: "Begin a submission",
      guestBody:
        "Create an account to prepare a submission record, upload a review-ready PDF manuscript, and follow editorial decisions through the journal platform.",
      signInLabel: "Sign in",
      signUpLabel: "Create account",
      authNote:
        "Use your account to prepare metadata, upload the manuscript PDF, and track screening, peer review, revisions, and publication.",
      memberTitle: "Submission workspace",
      memberBody:
        "Start a new submission, continue one already in preparation, or move to the editorial desk if you are part of the journal staff.",
      createDraftLabel: "Start submission",
      dashboardLabel: "Open dashboard",
      editorLabel: "Open editorial desk",
      signedInAs: "Signed in as",
    },
    signIn: {
      title: "Sign in",
      intro:
        "Access your private workspace to prepare submissions, upload manuscript PDFs, and follow editorial decisions at F.U.C.K Journal.",
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
        "Open a contributor account to prepare a submission, respond to revision decisions, and move the manuscript through review and publication.",
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
        "Manage submissions in preparation, revision requests, and editorial decisions without affecting the public journal site.",
      overviewTitle: "Overview",
      submissionsTitle: "Recent submissions",
      emptyTitle: "No submissions yet",
      emptyBody:
        "Start your first submission by entering metadata and uploading a review-ready PDF manuscript.",
      createDraftLabel: "Start submission",
      viewAllLabel: "View all submissions",
      newDraftTitle: "Start a new submission",
      newDraftBody:
        "Each submission opens a private record for title, abstract, keywords, cover letter, manuscript language, and the final PDF file.",
      draftCountLabel: "In preparation",
      submittedCountLabel: "Submitted",
      revisionCountLabel: "Revisions requested",
    },
    editor: {
      title: "Editorial desk",
      intro:
        "Review the current submission queue and update editorial status without modifying author manuscript content.",
      overviewTitle: "Queue overview",
      queueTitle: "Active submissions",
      publicationsTitle: "Publication queue",
      issuesTitle: "Issue planning",
      emptyTitle: "No active submissions",
      emptyBody: "Submitted manuscripts will appear here once authors send them to the queue.",
      submittedCountLabel: "Submitted",
      reviewCountLabel: "Under review",
      revisionCountLabel: "Revision requested",
      acceptedCountLabel: "Accepted",
      publicationPendingCountLabel: "Accepted, not ready",
      publicationReadyCountLabel: "Publication-ready",
      publishedCountLabel: "Published",
    },
    reviewer: {
      title: "Reviewer desk",
      intro:
        "Read the manuscripts assigned to you, access submission files and record recommendations for the editorial team.",
      overviewTitle: "Review overview",
      assignmentsTitle: "Assigned submissions",
      emptyTitle: "No review assignments",
      emptyBody: "New assignments will appear here once an editor sends them to your reviewer desk.",
      activeCountLabel: "Active",
      completedCountLabel: "Completed",
    },
    submission: {
      submissionsTitle: "Submissions",
      submissionsIntro:
        "Submissions remain private until you formally send them to the editorial desk.",
      detailTitle: "Submission detail",
      editTitle: "Prepare submission",
      editIntro:
        "Complete the metadata, attach the review-ready PDF manuscript, and submit the record when it is ready for editorial screening.",
      newTitle: "Start submission",
      newIntro:
        "Open a blank submission record now. You will be redirected to the preparation form immediately after creation.",
      titleLabel: "Title",
      abstractLabel: "Abstract",
      coverLetterLabel: "Cover letter",
      languageLabel: "Manuscript language",
      fileNameLabel: "Manuscript filename",
      mimeTypeLabel: "MIME type",
      fileSizeLabel: "File size (bytes)",
      metadataNote:
        "The submission workspace is now PDF-first: metadata and manuscript delivery are handled here, while the paper layout stays in the uploaded file.",
      saveDraftLabel: "Save submission details",
      submitManuscriptLabel: "Submit manuscript",
      createDraftLabel: "Start submission",
      backToDashboardLabel: "Back to dashboard",
      backToQueueLabel: "Back to editorial desk",
      noSubmissions: "No submissions have been created yet.",
      statusHistoryTitle: "Status history",
      versionTitle: "Version history",
      versionBody:
        "Each save, submission and revision resubmission creates a durable version snapshot for authors and editors.",
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
        "The editorial desk reviews metadata, manuscript files, reviewer input, and internal notes without rewriting the author's manuscript content directly.",
      draftGateTitle: "Editing permissions",
      draftGateBody: "Submissions in preparation remain editable until they are formally submitted.",
      reviseGateBody:
        "Revision requests reopen the submission record so the author can replace the manuscript PDF and update metadata before resubmitting.",
      submittedGateBody:
        "Submitted manuscripts are locked for authors while they wait for editorial screening.",
      underReviewGateBody:
        "Manuscripts in peer review are locked for authors until the editorial team requests changes or records a decision.",
      acceptedGateBody:
        "Accepted manuscripts are locked for authors. Production and publication work continue on the editorial side.",
      rejectedGateBody:
        "Rejected manuscripts remain archived in read-only form for reference.",
      notices: {
        created: "Submission record created.",
        saved: "Submission details saved.",
        submitted: "Manuscript submitted to the editorial queue.",
        updated: "Submission status updated.",
      },
    },
  },
  zh: {
    submitPortal: {
      guestTitle: "开始投稿",
      guestBody:
        "创建账户后，你可以在期刊平台内准备一条投稿记录、上传正式送审 PDF，并跟踪编辑与审稿决定。",
      signInLabel: "登录",
      signUpLabel: "注册账户",
      authNote:
        "登录后可在私有工作区中填写投稿元数据、上传稿件 PDF，并跟踪初筛、外审、返修与出版状态。",
      memberTitle: "投稿工作区",
      memberBody:
        "你可以开始新的投稿、继续处理准备中的稿件；如果你属于编辑团队，也可以直接进入编辑台。",
      createDraftLabel: "开始投稿",
      dashboardLabel: "打开投稿后台",
      editorLabel: "打开编辑台",
      signedInAs: "当前身份",
    },
    signIn: {
      title: "登录",
      intro:
        "进入私有工作区，准备投稿信息、上传稿件 PDF，并跟踪 F.U.C.K Journal 的编辑处理结果。",
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
        "创建投稿者账户后，你可以准备投稿、响应返修，并把稿件推进到审稿与出版流程。",
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
        "在不影响公开期刊页面的前提下，管理准备中的投稿、返修请求与编辑处理记录。",
      overviewTitle: "概览",
      submissionsTitle: "最近稿件",
      emptyTitle: "还没有投稿",
      emptyBody:
        "先开始一条投稿，填写标题、摘要与关键词，再上传送审 PDF 后提交给编辑部。",
      createDraftLabel: "开始投稿",
      viewAllLabel: "查看全部稿件",
      newDraftTitle: "开始新的投稿",
      newDraftBody:
        "每条投稿都会生成一条私有记录，用来管理标题、摘要、关键词、附信、稿件语言与正式 PDF 文件。",
      draftCountLabel: "准备中",
      submittedCountLabel: "已提交",
      revisionCountLabel: "需修改",
    },
    editor: {
      title: "编辑台",
      intro:
        "查看当前投稿队列，并在不修改作者正文内容的前提下更新编辑状态。",
      overviewTitle: "队列概览",
      queueTitle: "活跃稿件",
      publicationsTitle: "出版队列",
      issuesTitle: "期次规划",
      emptyTitle: "当前没有活跃稿件",
      emptyBody: "作者正式提交后，稿件会出现在这里。",
      submittedCountLabel: "已提交",
      reviewCountLabel: "审阅中",
      revisionCountLabel: "需修改",
      acceptedCountLabel: "已接收",
      publicationPendingCountLabel: "已接收未准备",
      publicationReadyCountLabel: "出版准备就绪",
      publishedCountLabel: "已发布",
    },
    reviewer: {
      title: "审稿台",
      intro:
        "阅读分配给你的稿件、访问投稿文件，并为编辑团队记录审稿建议。",
      overviewTitle: "审稿概览",
      assignmentsTitle: "分配稿件",
      emptyTitle: "当前没有审稿任务",
      emptyBody: "编辑分配后，新的稿件会出现在这里。",
      activeCountLabel: "进行中",
      completedCountLabel: "已完成",
    },
    submission: {
      submissionsTitle: "投稿",
      submissionsIntro:
        "投稿记录在正式提交前仅作者本人可见；只有送出后才会进入编辑队列。",
      detailTitle: "投稿详情",
      editTitle: "准备投稿",
      editIntro:
        "填写投稿元数据、上传正式送审 PDF，并在准备完成后送交编辑初筛。",
      newTitle: "开始投稿",
      newIntro:
        "现在即可创建一条空白投稿记录。创建成功后会立刻跳转到投稿准备页。",
      titleLabel: "标题",
      abstractLabel: "摘要",
      coverLetterLabel: "附信",
      languageLabel: "稿件语言",
      fileNameLabel: "稿件文件名",
      mimeTypeLabel: "MIME 类型",
      fileSizeLabel: "文件大小（字节）",
      metadataNote:
        "投稿工作区现在以 PDF 为中心：这里处理元数据与文件交付，论文版式以作者上传的正式稿为准。",
      saveDraftLabel: "保存投稿信息",
      submitManuscriptLabel: "正式提交",
      createDraftLabel: "开始投稿",
      backToDashboardLabel: "返回投稿后台",
      backToQueueLabel: "返回编辑台",
      noSubmissions: "目前还没有创建任何稿件。",
      statusHistoryTitle: "状态记录",
      versionTitle: "版本记录",
      versionBody:
        "每次保存、正式提交和返修再提交都会生成可追溯的版本快照，供作者与编辑查看。",
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
      editorReadonlyNote: "编辑台查看的是投稿元数据、稿件文件、审稿意见与内部备注，不会直接在平台内重写作者的论文正文。",
      draftGateTitle: "编辑权限",
      draftGateBody: "准备中的投稿在正式提交前可持续编辑。",
      reviseGateBody: "返修请求会重新开放投稿记录，作者可替换 PDF 并更新元数据后再次提交。",
      submittedGateBody: "正式提交后的稿件会先进入编辑初筛，期间作者无法修改。",
      underReviewGateBody: "外审中的稿件会持续锁定，直到编辑要求返修或记录决定。",
      acceptedGateBody: "已接收稿件会锁定，后续生产与出版工作在编辑端继续进行。",
      rejectedGateBody: "被拒稿件会以只读方式保留，供作者后续参考。",
      notices: {
        created: "投稿记录已创建。",
        saved: "投稿信息已保存。",
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
