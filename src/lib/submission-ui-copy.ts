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
    uploadButton: string;
    uploadingButton: string;
    downloadButton: string;
    replaceHint: string;
    noFile: string;
    manuscriptHint: string;
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
    previewLabel: string;
    previewHint: string;
    printPdfLabel: string;
    printPdfHint: string;
    proofTitle: string;
    proofBody: string;
    proofReturnLabel: string;
    proofPrintLabel: string;
    proofKicker: string;
    proofMetaLabel: string;
    proofPreparedLabel: string;
    proofUpdatedLabel: string;
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
      "Download the English or Chinese Word / LaTeX packages, prepare the final layout there, and upload the manuscript as a PDF when it is ready.",
    templates: {
      title: "Submission Templates",
      intro:
        "F.U.C.K Journal runs a PDF-first submission workflow. This page outlines the journal template, manuscript expectations, and the minimum checklist before a paper enters editorial screening.",
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
        "Prepare the manuscript in Word or LaTeX if needed, but submit a review-ready PDF.",
        "Use the private workspace for metadata, cover letter, review status, and manuscript delivery.",
      ],
      checklistTitle: "Submission checklist",
      checklist: [
        "The title, abstract, keywords and manuscript language are complete.",
        "The manuscript PDF reflects the exact version that should be reviewed.",
        "The cover letter clarifies scope, fit, or any special context for the editors.",
        "If you plan to preserve source files, keep them for later production on the editorial side.",
      ],
      downloadsTitle: "Template placeholders",
      downloads: [
        {
          title: "Word manuscript template",
          body: "Use it to prepare the paper visually before exporting the final PDF.",
        },
        {
          title: "PDF manuscript delivery",
          body: "Upload the final review-ready PDF once the argument and formatting stabilize.",
        },
        {
          title: "LaTeX production package",
          body: "Keep source material ready for production, but do not rely on it for the initial submission.",
        },
      ],
      comparisonTitle: "Submission modes",
      comparisonCards: [
        {
          title: "Submission record",
          body: "Best for metadata, cover letters, PDF delivery, and tracking decisions through screening and peer review.",
        },
        {
          title: "PDF-first manuscript",
          body: "Best for preserving final formatting, equations, tables, figures, and the exact appearance reviewers should read.",
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
        "The submission workspace keeps only the metadata required for screening and review. The paper itself is carried by the uploaded manuscript PDF.",
      noContent: "No content has been added to this section yet.",
    },
    uploads: {
      sectionTitle: "Files",
      sectionBody:
        "Upload the manuscript as a PDF. Files can be replaced only while the submission remains editable.",
      manuscriptLabel: "Manuscript PDF",
      uploadButton: "Upload file",
      uploadingButton: "Uploading...",
      downloadButton: "Download",
      replaceHint: "Uploading a new file replaces the previous one for this slot.",
      noFile: "No file uploaded yet.",
      manuscriptHint: "Accepted format: PDF",
    },
    versions: {
      sectionTitle: "Version history",
      sectionBody:
        "Each save, submission and revision resubmission creates a durable snapshot of the submission record.",
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
        "Accepted submissions move through production and publication here. The public site reads directly from the published manuscript record.",
      queueEmpty:
        "No accepted submissions match the current publication filters.",
      stateFilterLabel: "Pipeline state",
      localeFilterLabel: "Publication locale",
      allStates: "All publication states",
      allLocales: "All locales",
      openWorkspaceLabel: "Open publication workspace",
      workflowTitle: "Publication workflow",
      workflowBody:
        "Editorial publication work remains internal. Metadata, issue placement, proofing, and publication timestamps are managed here while the public site reads the published manuscript file.",
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
        "Use the locale that should be shown on the published article record.",
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
      exportTitle: "Export records",
      exportBody:
        "Export publication records for internal handoff, preservation, or downstream production work.",
      exportMarkdownLabel: "Export markdown record",
      exportMarkdownHint:
        "Creates a lightweight markdown handoff from the accepted submission metadata.",
      exportJsonLabel: "Export structured JSON",
      exportJsonHint:
        "Exports metadata, publication settings, and manuscript file metadata as JSON.",
      previewLabel: "Open proof preview",
      previewHint:
        "Open an editorial proof page styled like a journal first-publication layout.",
      printPdfLabel: "Print / save PDF",
      printPdfHint:
        "Open the proof preview and trigger the browser print dialog for PDF export.",
      proofTitle: "Publication proof preview",
      proofBody:
        "Use this internal proof page to review the accepted manuscript in a publication-style layout before release.",
      proofReturnLabel: "Return to publication workspace",
      proofPrintLabel: "Print / save PDF",
      proofKicker: "Accepted manuscript proof",
      proofMetaLabel: "Publication metadata",
      proofPreparedLabel: "Prepared from accepted submission",
      proofUpdatedLabel: "Latest editorial update",
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
        "Accepted submissions can be moved into production and publication without rewriting the manuscript into a separate CMS article.",
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
      "如果你希望稿件在上传前就更像正式期刊论文，可以先下载中英文 Word / LaTeX 模板包完成排版，再导出 PDF 作为正式稿件上传。",
    templates: {
      title: "投稿模板",
      intro:
        "F.U.C.K Journal 现在采用 PDF-first 投稿流程。本页概述期刊模板、稿件要求，以及进入编辑初筛前的最小检查清单。",
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
        "如需，可先在 Word 或 LaTeX 中完成排版，但正式投稿时请提交可送审的 PDF。",
        "私有工作区只负责元数据、附信、审稿状态和稿件文件交付。",
      ],
      checklistTitle: "投稿检查清单",
      checklist: [
        "标题、摘要、关键词和稿件语言已经完成。",
        "上传的稿件 PDF 就是希望编辑和审稿人阅读的正式版本。",
        "附信已经说明选题、适配性或其他需要编辑知晓的背景。",
        "如果未来需要源文件，请在生产阶段再向编辑部提供。",
      ],
      downloadsTitle: "模板占位",
      downloads: [
        {
          title: "Word 稿件模板",
          body: "可先据此完成排版，再导出正式 PDF。",
        },
        {
          title: "PDF 稿件交付",
          body: "当论证和排版稳定后，再上传最终送审 PDF。",
        },
        {
          title: "LaTeX 生产包",
          body: "如需保留源材料，可在出版生产阶段再提供给编辑部。",
        },
      ],
      comparisonTitle: "投稿模式",
      comparisonCards: [
        {
          title: "投稿记录",
          body: "适合管理元数据、附信、PDF 交付以及初筛、外审、返修等流程状态。",
        },
        {
          title: "PDF-first 稿件",
          body: "适合保留最终排版、公式、图表与审稿人应该阅读的精确版式。",
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
        "投稿工作区现在只保留送审所需元数据；论文正文以作者上传的稿件 PDF 为准。",
      noContent: "这一部分还没有内容。",
    },
    uploads: {
      sectionTitle: "文件",
      sectionBody:
        "稿件正文现在只上传 PDF。只有在稿件仍可编辑时才允许替换文件。",
      manuscriptLabel: "稿件 PDF",
      uploadButton: "上传文件",
      uploadingButton: "上传中...",
      downloadButton: "下载",
      replaceHint: "再次上传会替换这一栏位中原有的文件。",
      noFile: "尚未上传文件。",
      manuscriptHint: "支持格式：PDF",
    },
    versions: {
      sectionTitle: "版本记录",
      sectionBody: "每次保存、正式提交和返修再提交都会生成一个可追溯的投稿记录快照。",
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
        "已接收稿件会在这里进入生产与出版准备，公开站点会直接读取已发布稿件记录。",
      queueEmpty: "当前筛选条件下没有已接收稿件进入出版流程。",
      stateFilterLabel: "流程状态",
      localeFilterLabel: "出版语言",
      allStates: "全部出版状态",
      allLocales: "全部语言",
      openWorkspaceLabel: "打开出版工作区",
      workflowTitle: "出版工作流",
      workflowBody:
        "出版处理仍然是内部编辑流程。这里管理元数据、期次编排、proof 检查和发布时间，而公开站点直接读取已发布稿件文件。",
      currentStateLabel: "当前流程状态",
      metadataTitle: "出版元数据",
      metadataBody:
        "在不改动原始稿件内容的前提下，为已接收稿件准备出版信息。",
      publicationTitleLabel: "出版标题",
      publicationExcerptLabel: "出版摘要",
      publicationTagsLabel: "出版标签",
      publicationTagsHint: "多个标签请用逗号分隔。",
      publicationLocaleLabel: "出版语言",
      publicationLocaleHint: "这里的语言会写入公开文章记录。",
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
      exportTitle: "导出记录",
      exportBody:
        "如有需要，可导出出版记录用于内部交接、归档或后续生产处理。",
      exportMarkdownLabel: "导出 markdown 记录",
      exportMarkdownHint: "从已接收稿件生成轻量 markdown 交接记录。",
      exportJsonLabel: "导出结构化 JSON",
      exportJsonHint: "导出元数据、出版设置与稿件文件元数据。",
      previewLabel: "打开首发 proof 预览",
      previewHint: "以更接近期刊首发版式的内部 proof 页面查看已接收稿件。",
      printPdfLabel: "打印 / 导出 PDF",
      printPdfHint: "打开 proof 预览，并直接唤起浏览器打印对话框导出 PDF。",
      proofTitle: "出版 proof 预览",
      proofBody:
        "这个内部 proof 页面用于在正式发布前，以更接近期刊首发的版式检查已接收稿件。",
      proofReturnLabel: "返回出版工作区",
      proofPrintLabel: "打印 / 导出 PDF",
      proofKicker: "已接收稿件 proof",
      proofMetaLabel: "出版元数据",
      proofPreparedLabel: "生成自已接收稿件",
      proofUpdatedLabel: "最近一次编辑更新",
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
        "对于已接收稿件，可以直接推进到出版准备，而不必把论文重写成另一套 CMS 文章。",
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
