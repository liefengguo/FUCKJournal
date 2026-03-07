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
};

const copy: Localized<Phase2Copy> = {
  en: {
    submitTemplatesCtaLabel: "View submission templates",
    submitTemplatesCtaBody:
      "Review the journal structure, writing checklist and file expectations before you begin the online submission workspace.",
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
  },
  zh: {
    submitTemplatesCtaLabel: "查看投稿模板",
    submitTemplatesCtaBody:
      "开始在线投稿工作区之前，先查看期刊结构、写作清单与文件要求。",
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
  },
};

export function getSubmissionUiCopy(locale: Locale) {
  return copy[locale];
}
