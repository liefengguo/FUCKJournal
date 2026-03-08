import type { Locale } from "@/i18n/routing";

type Localized<T> = Record<Locale, T>;

type TemplatesCopy = {
  title: string;
  intro: string;
  structureTitle: string;
  structureItems: string[];
  guidelinesTitle: string;
  guidelines: string[];
  checklistTitle: string;
  checklist: string[];
  downloadsTitle: string;
  downloads: Array<{ title: string; body: string }>;
  comparisonTitle: string;
  comparisonCards: Array<{ title: string; body: string }>;
  exampleTitle: string;
  exampleSections: string[];
};

type Phase2Copy = {
  submitTemplatesCtaLabel: string;
  submitTemplatesCtaBody: string;
  templates: TemplatesCopy;
  fields: {
    keywordsLabel: string;
    keywordsHint: string;
    introductionLabel: string;
    mainContentLabel: string;
    conclusionLabel: string;
    referencesLabel: string;
    structureTitle: string;
    structureBody: string;
    noContent: string;
  };
  uploads: {
    sectionTitle: string;
    sectionBody: string;
    manuscriptLabel: string;
    sourceLabel: string;
    uploadButton: string;
    uploadingButton: string;
    downloadButton: string;
    replaceHint: string;
    noFile: string;
    manuscriptHint: string;
    sourceHint: string;
  };
  versions: {
    sectionTitle: string;
    sectionBody: string;
    empty: string;
    versionLabel: string;
    statusContextLabel: string;
    createdByLabel: string;
  };
  editor: {
    metadataTitle: string;
    filesTitle: string;
    versionsTitle: string;
    notesTitle: string;
    notesBody: string;
    notesEmpty: string;
    addNoteLabel: string;
    addingNoteLabel: string;
    notePlaceholder: string;
    filtersTitle: string;
    statusFilterLabel: string;
    languageFilterLabel: string;
    allStatuses: string;
    allLanguages: string;
    applyFiltersLabel: string;
  };
  review: {
    sectionTitle: string;
    sectionBody: string;
    recommendationLabel: string;
    commentsToAuthorLabel: string;
    commentsToEditorLabel: string;
    saveLabel: string;
    savingLabel: string;
    empty: string;
  };
  reviewer: {
    assignedTitle: string;
    assignedBody: string;
    accessNote: string;
    reviewNote: string;
    activeAssignmentsLabel: string;
    completedAssignmentsLabel: string;
  };
  publication: {
    queueTitle: string;
    queueBody: string;
    queueEmpty: string;
    stateFilterLabel: string;
    localeFilterLabel: string;
    allStates: string;
    allLocales: string;
    openWorkspaceLabel: string;
    workflowTitle: string;
    workflowBody: string;
    currentStateLabel: string;
    metadataTitle: string;
    metadataBody: string;
    publicationTitleLabel: string;
    publicationExcerptLabel: string;
    publicationTagsLabel: string;
    publicationTagsHint: string;
    publicationLocaleLabel: string;
    publicationLocaleHint: string;
    publicationVolumeLabel: string;
    publicationIssueLabel: string;
    publicationYearLabel: string;
    seoTitleLabel: string;
    seoDescriptionLabel: string;
    publicationReadyLabel: string;
    publishedLabel: string;
    publicationSlugLabel: string;
    publishedAtLabel: string;
    savePublicationLabel: string;
    savingPublicationLabel: string;
    exportTitle: string;
    exportBody: string;
    exportMarkdownLabel: string;
    exportMarkdownHint: string;
    exportJsonLabel: string;
    exportJsonHint: string;
    reviewWorkspaceLinkLabel: string;
    publicationWorkspaceHint: string;
  };
  editorialReview: {
    assignmentTitle: string;
    assignmentBody: string;
    assignLabel: string;
    assigningLabel: string;
    removeLabel: string;
    removeConfirmLabel: string;
    noAssignments: string;
    receivedReviewsTitle: string;
    receivedReviewsBody: string;
    noReviews: string;
    summaryTitle: string;
    summaryReceived: string;
    summaryOutstanding: string;
    publicationTitle: string;
    publicationBody: string;
    publicationReadyLabel: string;
    publicationSlugLabel: string;
    publishedAtLabel: string;
    publicationWorkspaceLabel: string;
    savePublicationLabel: string;
    savingPublicationLabel: string;
  };
};

const copy: Localized<Phase2Copy> = {
  en: {
    submitTemplatesCtaLabel: "View submission templates",
    submitTemplatesCtaBody:
      "Download the English or Chinese Word / LaTeX packages if you want the manuscript to already read like a formal journal paper before upload.",
    templates: {
      title: "Submission Templates",
      intro:
        "F.U.C.K Journal accepts structured online submissions and file-based manuscripts. This page outlines the editorial template, writing expectations and the minimum checklist before you submit.",
      structureTitle: "Journal submission structure",
      structureItems: [
        "Title",
        "Abstract",
        "Keywords",
        "Cover letter",
        "Introduction",
        "Main content",
        "Conclusion",
        "References",
      ],
      guidelinesTitle: "Writing guidelines",
      guidelines: [
        "Lead with a clear argument and maintain an editorially readable structure.",
        "Keep abstract and keywords precise enough for indexing and review.",
        "Use the online structured editor for text-driven submissions whenever possible.",
        "Use file upload for final PDF layout, source archives and supporting package delivery.",
      ],
      checklistTitle: "Submission checklist",
      checklist: [
        "The title, abstract, keywords and main content are complete.",
        "The manuscript PDF reflects the current argument and structure.",
        "References and citations are internally consistent.",
        "Any source archive is clearly named and ready for editorial download.",
      ],
      downloadsTitle: "Template placeholders",
      downloads: [
        {
          title: "Structured manuscript outline",
          body: "Use the online fields as your primary drafting template.",
        },
        {
          title: "PDF manuscript placeholder",
          body: "Upload a final manuscript PDF once the argument and formatting stabilize.",
        },
        {
          title: "Source archive placeholder",
          body: "Optional ZIP package for notes, figures or layout source files.",
        },
      ],
      comparisonTitle: "Submission modes",
      comparisonCards: [
        {
          title: "Online structured submission",
          body: "Best for iterative drafting, revision requests and editorial review of argument structure.",
        },
        {
          title: "File-based submission",
          body: "Best for preserving final formatting, complex footnotes and source materials for production.",
        },
      ],
      exampleTitle: "Example manuscript flow",
      exampleSections: [
        "Title and abstract",
        "Keywords and framing questions",
        "Introduction and central claim",
        "Main sections and supporting evidence",
        "Conclusion and open implications",
        "References and uploaded files",
      ],
    },
    fields: {
      keywordsLabel: "Keywords",
      keywordsHint: "Separate keywords with commas.",
      introductionLabel: "Introduction",
      mainContentLabel: "Main content",
      conclusionLabel: "Conclusion",
      referencesLabel: "References",
      structureTitle: "Structured manuscript",
      structureBody:
        "The online editor now follows the journal template directly so the submission can be reviewed as a structured manuscript, not only as flat metadata.",
      noContent: "No content has been added to this section yet.",
    },
    uploads: {
      sectionTitle: "Files",
      sectionBody:
        "Upload the manuscript PDF and, if needed, a source ZIP package. Files can be replaced only while the submission remains editable.",
      manuscriptLabel: "Manuscript PDF",
      sourceLabel: "Source ZIP",
      uploadButton: "Upload file",
      uploadingButton: "Uploading...",
      downloadButton: "Download",
      replaceHint: "Uploading a new file replaces the previous one for this slot.",
      noFile: "No file uploaded yet.",
      manuscriptHint: "Accepted format: PDF",
      sourceHint: "Accepted format: ZIP archive",
    },
    versions: {
      sectionTitle: "Version history",
      sectionBody:
        "Each draft save, submission and revision resubmission creates a durable snapshot.",
      empty: "No versions have been recorded yet.",
      versionLabel: "Version label",
      statusContextLabel: "Status context",
      createdByLabel: "Created by",
    },
    editor: {
      metadataTitle: "Structured metadata",
      filesTitle: "Manuscript files",
      versionsTitle: "Version record",
      notesTitle: "Internal editor notes",
      notesBody:
        "These notes stay inside the editorial desk. They are not exposed to authors.",
      notesEmpty: "No internal editor notes yet.",
      addNoteLabel: "Add internal note",
      addingNoteLabel: "Saving note...",
      notePlaceholder: "Record internal editorial observations, follow-ups, or handling notes.",
      filtersTitle: "Queue filters",
      statusFilterLabel: "Status",
      languageFilterLabel: "Language",
      allStatuses: "All active statuses",
      allLanguages: "All languages",
      applyFiltersLabel: "Apply filters",
    },
    review: {
      sectionTitle: "Review",
      sectionBody:
        "Provide a recommendation for the editors together with comments to the author and any confidential remarks to the editorial team.",
      recommendationLabel: "Recommendation",
      commentsToAuthorLabel: "Comments to author",
      commentsToEditorLabel: "Comments to editor",
      saveLabel: "Save review",
      savingLabel: "Saving review...",
      empty: "No review has been submitted yet.",
    },
    reviewer: {
      assignedTitle: "Assigned manuscripts",
      assignedBody:
        "These submissions are visible only because they have been assigned to your reviewer desk.",
      accessNote:
        "Reviewer access is limited to assigned manuscripts and their files. Submission status remains under editorial control.",
      reviewNote:
        "Your recommendation informs editorial decisions but does not change the manuscript status directly.",
      activeAssignmentsLabel: "Active assignments",
      completedAssignmentsLabel: "Completed reviews",
    },
    publication: {
      queueTitle: "Publication queue",
      queueBody:
        "Accepted submissions move through publication preparation here. Export tools prepare drafts for the existing MDX workflow without exposing them publicly.",
      queueEmpty:
        "No accepted submissions match the current publication filters.",
      stateFilterLabel: "Pipeline state",
      localeFilterLabel: "Publication locale",
      allStates: "All publication states",
      allLocales: "All locales",
      openWorkspaceLabel: "Open publication workspace",
      workflowTitle: "Publication workflow",
      workflowBody:
        "Editorial publication work remains internal. Metadata, export drafts and publication timestamps are managed here while the public site continues to use the existing MDX article system.",
      currentStateLabel: "Current pipeline state",
      metadataTitle: "Publication metadata",
      metadataBody:
        "Prepare the accepted submission for publication without altering the original manuscript content.",
      publicationTitleLabel: "Publication title",
      publicationExcerptLabel: "Publication excerpt",
      publicationTagsLabel: "Publication tags",
      publicationTagsHint: "Separate tags with commas.",
      publicationLocaleLabel: "Publication locale",
      publicationLocaleHint:
        "Use the publication locale that will be carried into the exported article draft.",
      publicationVolumeLabel: "Volume",
      publicationIssueLabel: "Issue",
      publicationYearLabel: "Year",
      seoTitleLabel: "SEO title",
      seoDescriptionLabel: "SEO description",
      publicationReadyLabel: "Publication ready",
      publishedLabel: "Published",
      publicationSlugLabel: "Publication slug",
      publishedAtLabel: "Published at",
      savePublicationLabel: "Save publication metadata",
      savingPublicationLabel: "Saving publication metadata...",
      exportTitle: "Export drafts",
      exportBody:
        "Export a markdown draft for the MDX publication workflow, or export the full structured record as JSON for internal handling.",
      exportMarkdownLabel: "Export markdown draft",
      exportMarkdownHint:
        "Creates a frontmatter + markdown draft from the accepted submission.",
      exportJsonLabel: "Export structured JSON",
      exportJsonHint:
        "Exports metadata, structured manuscript content and file metadata as JSON.",
      reviewWorkspaceLinkLabel: "Return to review detail",
      publicationWorkspaceHint:
        "Accepted manuscripts remain locked for authors. Publication preparation happens here, on the editorial side only.",
    },
    editorialReview: {
      assignmentTitle: "Reviewer assignments",
      assignmentBody:
        "Assign reviewers, follow completion status and keep the decision workflow organized in one place.",
      assignLabel: "Assign reviewer",
      assigningLabel: "Assigning...",
      removeLabel: "Remove",
      removeConfirmLabel: "Remove assignment",
      noAssignments: "No reviewers have been assigned yet.",
      receivedReviewsTitle: "Received reviews",
      receivedReviewsBody:
        "Review recommendations and comments are collected here for editorial decisions.",
      noReviews: "No reviews have been submitted yet.",
      summaryTitle: "Review summary",
      summaryReceived: "Received",
      summaryOutstanding: "Outstanding",
      publicationTitle: "Publication foundation",
      publicationBody:
        "Accepted submissions can be marked as publication-ready without changing the existing public MDX article system.",
      publicationReadyLabel: "Publication ready",
      publicationSlugLabel: "Publication slug",
      publishedAtLabel: "Published at",
      publicationWorkspaceLabel: "Open publication workspace",
      savePublicationLabel: "Save publication settings",
      savingPublicationLabel: "Saving publication settings...",
    },
  },
  zh: {
    submitTemplatesCtaLabel: "查看投稿模板",
    submitTemplatesCtaBody:
      "如果你希望稿件在上传前就更像正式期刊论文，可以先下载中英文 Word / LaTeX 模板包。",
    templates: {
      title: "投稿模板",
      intro:
        "F.U.C.K Journal 同时接受结构化在线投稿和文件式稿件。本页概述编辑模板、写作要求，以及正式投稿前的最小检查清单。",
      structureTitle: "期刊投稿结构",
      structureItems: [
        "标题",
        "摘要",
        "关键词",
        "附信",
        "引言",
        "正文",
        "结论",
        "参考文献",
      ],
      guidelinesTitle: "写作指南",
      guidelines: [
        "以清晰论点开篇，并保持可读的编辑结构。",
        "摘要与关键词应足够准确，便于索引与审阅。",
        "只要适合文本驱动写作，优先使用在线结构化编辑器。",
        "文件上传适合最终 PDF、源文件包以及需要交付的补充材料。",
      ],
      checklistTitle: "投稿检查清单",
      checklist: [
        "标题、摘要、关键词和正文已经完成。",
        "稿件 PDF 与当前论点和结构一致。",
        "参考文献与引注内部一致。",
        "如果上传源文件包，文件命名清晰，便于编辑下载。",
      ],
      downloadsTitle: "模板占位",
      downloads: [
        {
          title: "结构化稿件提纲",
          body: "可直接把在线字段当作你的基础模板。",
        },
        {
          title: "PDF 稿件占位",
          body: "当论证和排版稳定后，再上传最终 PDF。",
        },
        {
          title: "源文件压缩包占位",
          body: "可选 ZIP 包，用于笔记、图表或排版源文件。",
        },
      ],
      comparisonTitle: "投稿模式",
      comparisonCards: [
        {
          title: "在线结构化投稿",
          body: "更适合反复修改、回应返修，以及编辑对论证结构的持续审阅。",
        },
        {
          title: "文件式投稿",
          body: "更适合保留最终排版、复杂脚注，以及需要交付的源材料。",
        },
      ],
      exampleTitle: "示例稿件流程",
      exampleSections: [
        "标题与摘要",
        "关键词与问题框架",
        "引言与核心论点",
        "正文结构与证据",
        "结论与延伸问题",
        "参考文献与上传文件",
      ],
    },
    fields: {
      keywordsLabel: "关键词",
      keywordsHint: "多个关键词请用逗号分隔。",
      introductionLabel: "引言",
      mainContentLabel: "正文",
      conclusionLabel: "结论",
      referencesLabel: "参考文献",
      structureTitle: "结构化稿件",
      structureBody:
        "在线编辑器现在直接遵循期刊模板，因此投稿不再只是扁平元数据，而是一份可直接审阅的结构化稿件。",
      noContent: "这一部分还没有内容。",
    },
    uploads: {
      sectionTitle: "文件",
      sectionBody:
        "可以上传稿件 PDF，以及需要时上传源文件 ZIP 包。只有在稿件仍可编辑时才允许替换文件。",
      manuscriptLabel: "稿件 PDF",
      sourceLabel: "源文件 ZIP",
      uploadButton: "上传文件",
      uploadingButton: "上传中...",
      downloadButton: "下载",
      replaceHint: "再次上传会替换这一栏位中原有的文件。",
      noFile: "尚未上传文件。",
      manuscriptHint: "支持格式：PDF",
      sourceHint: "支持格式：ZIP 压缩包",
    },
    versions: {
      sectionTitle: "版本记录",
      sectionBody: "每次保存草稿、正式提交和返修再提交都会生成一个可追溯快照。",
      empty: "当前还没有版本记录。",
      versionLabel: "版本标签",
      statusContextLabel: "状态上下文",
      createdByLabel: "创建者",
    },
    editor: {
      metadataTitle: "结构化元数据",
      filesTitle: "稿件文件",
      versionsTitle: "版本记录",
      notesTitle: "内部编辑备注",
      notesBody: "这些备注仅存在于编辑台内部，不会向作者公开。",
      notesEmpty: "目前还没有内部编辑备注。",
      addNoteLabel: "添加内部备注",
      addingNoteLabel: "保存中...",
      notePlaceholder: "记录内部编辑观察、后续动作或处理说明。",
      filtersTitle: "队列筛选",
      statusFilterLabel: "状态",
      languageFilterLabel: "语言",
      allStatuses: "全部活跃状态",
      allLanguages: "全部语言",
      applyFiltersLabel: "应用筛选",
    },
    review: {
      sectionTitle: "审稿意见",
      sectionBody:
        "为编辑团队提交建议，同时填写给作者的公开意见，以及仅供编辑参考的保密备注。",
      recommendationLabel: "审稿建议",
      commentsToAuthorLabel: "给作者的意见",
      commentsToEditorLabel: "给编辑的备注",
      saveLabel: "保存审稿意见",
      savingLabel: "保存中...",
      empty: "目前还没有提交审稿意见。",
    },
    reviewer: {
      assignedTitle: "分配稿件",
      assignedBody:
        "这些稿件仅因被分配到你的审稿台而对你可见。",
      accessNote:
        "审稿人只能访问被分配稿件及其文件，稿件状态仍由编辑控制。",
      reviewNote:
        "你的建议会为编辑决定提供依据，但不会直接改变稿件状态。",
      activeAssignmentsLabel: "进行中任务",
      completedAssignmentsLabel: "已完成审稿",
    },
    publication: {
      queueTitle: "出版队列",
      queueBody:
        "已接收稿件会在这里进入出版准备。导出工具只生成内部草稿，不会自动公开到当前 MDX 站点。",
      queueEmpty: "当前筛选条件下没有已接收稿件进入出版流程。",
      stateFilterLabel: "流程状态",
      localeFilterLabel: "出版语言",
      allStates: "全部出版状态",
      allLocales: "全部语言",
      openWorkspaceLabel: "打开出版工作区",
      workflowTitle: "出版工作流",
      workflowBody:
        "出版处理仍然是内部编辑流程。这里管理元数据、导出草稿和发布时间，而公开站点继续沿用现有 MDX 文章系统。",
      currentStateLabel: "当前流程状态",
      metadataTitle: "出版元数据",
      metadataBody:
        "在不改动原始稿件内容的前提下，为已接收稿件准备出版信息。",
      publicationTitleLabel: "出版标题",
      publicationExcerptLabel: "出版摘要",
      publicationTagsLabel: "出版标签",
      publicationTagsHint: "多个标签请用逗号分隔。",
      publicationLocaleLabel: "出版语言",
      publicationLocaleHint: "这里的语言会写入导出的文章草稿。",
      publicationVolumeLabel: "卷",
      publicationIssueLabel: "期",
      publicationYearLabel: "年份",
      seoTitleLabel: "SEO 标题",
      seoDescriptionLabel: "SEO 描述",
      publicationReadyLabel: "已完成出版准备",
      publishedLabel: "已发布",
      publicationSlugLabel: "出版 slug",
      publishedAtLabel: "发布时间",
      savePublicationLabel: "保存出版元数据",
      savingPublicationLabel: "保存中...",
      exportTitle: "导出草稿",
      exportBody:
        "可导出 markdown 草稿进入现有 MDX 发布流程，或导出完整 JSON 结构供内部处理。",
      exportMarkdownLabel: "导出 markdown 草稿",
      exportMarkdownHint: "从已接收稿件生成 frontmatter + markdown 草稿。",
      exportJsonLabel: "导出结构化 JSON",
      exportJsonHint: "导出元数据、结构化正文和文件元数据。",
      reviewWorkspaceLinkLabel: "返回审稿详情",
      publicationWorkspaceHint:
        "已接收稿件在作者侧保持锁定。出版准备只在编辑内部工作区进行。",
    },
    editorialReview: {
      assignmentTitle: "审稿分配",
      assignmentBody:
        "在同一界面中分配审稿人、跟踪完成情况，并整理编辑决定流程。",
      assignLabel: "分配审稿人",
      assigningLabel: "分配中...",
      removeLabel: "移除",
      removeConfirmLabel: "移除分配",
      noAssignments: "目前还没有分配审稿人。",
      receivedReviewsTitle: "已收审稿意见",
      receivedReviewsBody:
        "审稿建议与评论会汇总在这里，供编辑做最终判断。",
      noReviews: "目前还没有收到审稿意见。",
      summaryTitle: "审稿摘要",
      summaryReceived: "已收",
      summaryOutstanding: "待收",
      publicationTitle: "出版准备基础",
      publicationBody:
        "对于已接收稿件，可以先标记为进入出版准备，而不改变当前公开 MDX 文章系统。",
      publicationReadyLabel: "可进入出版准备",
      publicationSlugLabel: "出版 slug",
      publishedAtLabel: "发布时间",
      publicationWorkspaceLabel: "打开出版工作区",
      savePublicationLabel: "保存出版设置",
      savingPublicationLabel: "保存中...",
    },
  },
};

export function getSubmissionUiCopy(locale: Locale) {
  return copy[locale];
}
