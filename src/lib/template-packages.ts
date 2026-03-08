import type { Locale } from "@/i18n/routing";

export type TemplatePackage = {
  id: string;
  format: "Word" | "LaTeX";
  language: "English" | "Chinese";
  fileLabel: string;
  href: string;
  title: string;
  description: string;
  note: string;
};

type TemplatePageContent = {
  heroKicker: string;
  title: string;
  intro: string;
  chooserTitle: string;
  chooserBody: string;
  downloadLabel: string;
  editorialSpecTitle: string;
  editorialSpecs: string[];
  writingGuideTitle: string;
  writingGuide: string[];
  checklistTitle: string;
  checklist: string[];
  comparisonTitle: string;
  comparisonCards: Array<{ title: string; body: string }>;
  structureTitle: string;
  structureSections: string[];
};

const packages: Record<Locale, TemplatePackage[]> = {
  en: [
    {
      id: "word-en",
      format: "Word",
      language: "English",
      fileLabel: "DOCX",
      href: "/templates/fuck-journal-word-template-en.docx",
      title: "English Word Template",
      description:
        "A branded manuscript layout for authors drafting in Word with journal-style title matter, abstract, keywords and two-column body formatting.",
      note: "Best for authors who want a ready-to-submit visual style without touching LaTeX.",
    },
    {
      id: "word-zh",
      format: "Word",
      language: "Chinese",
      fileLabel: "DOCX",
      href: "/templates/fuck-journal-word-template-zh.docx",
      title: "Chinese Word Template",
      description:
        "A Chinese manuscript template aligned with the F.U.C.K Journal editorial layout, including structured metadata and issue-style page framing.",
      note: "Best for Chinese-language submissions prepared in Word or WPS.",
    },
    {
      id: "latex-en",
      format: "LaTeX",
      language: "English",
      fileLabel: "ZIP",
      href: "/templates/fuck-journal-latex-template-en.zip",
      title: "English LaTeX Template",
      description:
        "A clean LaTeX package with journal class, example manuscript and production-ready front-matter commands for English submissions.",
      note: "Recommended for authors who need precise control over equations, figures, footnotes and references.",
    },
    {
      id: "latex-zh",
      format: "LaTeX",
      language: "Chinese",
      fileLabel: "ZIP",
      href: "/templates/fuck-journal-latex-template-zh.zip",
      title: "Chinese LaTeX Template",
      description:
        "A Chinese LaTeX package designed for journal-style submission, with ctex support, structured metadata and two-column article formatting.",
      note: "Recommended for Chinese manuscripts with complex formulas, tables or layout constraints.",
    },
  ],
  zh: [
    {
      id: "word-en",
      format: "Word",
      language: "English",
      fileLabel: "DOCX",
      href: "/templates/fuck-journal-word-template-en.docx",
      title: "英文 Word 模板",
      description:
        "适合英文稿件的 Word 模板，包含期刊式标题页、摘要、关键词与双栏正文版式。",
      note: "适合希望直接在 Word 中完成排版并保留期刊视觉风格的作者。",
    },
    {
      id: "word-zh",
      format: "Word",
      language: "Chinese",
      fileLabel: "DOCX",
      href: "/templates/fuck-journal-word-template-zh.docx",
      title: "中文 Word 模板",
      description:
        "适合中文稿件的 F.U.C.K Journal 投稿模板，包含结构化元信息与期刊式页面框架。",
      note: "适合使用 Word 或 WPS 撰写中文论文的作者。",
    },
    {
      id: "latex-en",
      format: "LaTeX",
      language: "English",
      fileLabel: "ZIP",
      href: "/templates/fuck-journal-latex-template-en.zip",
      title: "英文 LaTeX 模板",
      description:
        "包含期刊 class、示例稿件与前置信息命令的英文 LaTeX 模板包，适合正式学术排版。",
      note: "适合需要精确控制公式、图表、脚注与参考文献的作者。",
    },
    {
      id: "latex-zh",
      format: "LaTeX",
      language: "Chinese",
      fileLabel: "ZIP",
      href: "/templates/fuck-journal-latex-template-zh.zip",
      title: "中文 LaTeX 模板",
      description:
        "支持中文排版的 LaTeX 模板包，包含结构化元信息、双栏正文与期刊化版式。",
      note: "适合包含复杂公式、表格或特殊版面需求的中文稿件。",
    },
  ],
};

const pageContent: Record<Locale, TemplatePageContent> = {
  en: {
    heroKicker: "Templates",
    title: "Manuscript Templates",
    intro:
      "Choose a manuscript package that matches your writing environment. F.U.C.K Journal offers English and Chinese templates in Word and LaTeX, aligned with a more formal academic journal style than the online drafting interface alone.",
    chooserTitle: "Choose your template package",
    chooserBody:
      "Each package follows the same editorial logic: formal front matter, abstract and keywords, disciplined body typography and a production-minded page structure.",
    downloadLabel: "Download template",
    editorialSpecTitle: "Editorial specification",
    editorialSpecs: [
      "A4 page design with journal-style front matter and compact scholarly typography.",
      "Structured metadata: title, optional subtitle, authors, affiliations, abstract and keywords.",
      "Body text designed for article reading rather than blog presentation.",
      "References, figures and tables prepared for review, editing and later publication workflow.",
    ],
    writingGuideTitle: "Writing guidance",
    writingGuide: [
      "Use the template to stabilize visual structure before final submission.",
      "Keep title, abstract and keywords precise enough for indexing and review.",
      "Prefer file-based templates when final layout, citations or formulas matter.",
      "Use the online structured workspace for drafting, revision cycles and editorial handling.",
    ],
    checklistTitle: "Before you submit",
    checklist: [
      "Title and abstract are complete.",
      "Keywords reflect the manuscript argument and field vocabulary.",
      "Main sections and references follow a consistent scholarly structure.",
      "The uploaded PDF matches the latest manuscript state.",
    ],
    comparisonTitle: "Workflow modes",
    comparisonCards: [
      {
        title: "Structured online submission",
        body: "Best for iterative drafting, revisions and editorial handling inside the platform.",
      },
      {
        title: "File-based journal manuscript",
        body: "Best for authors who want the paper to already look like a formal journal article.",
      },
    ],
    structureTitle: "Recommended manuscript order",
    structureSections: [
      "Title and optional subtitle",
      "Authors and affiliations",
      "Abstract",
      "Keywords",
      "Introduction",
      "Main argument / analysis",
      "Conclusion",
      "References",
    ],
  },
  zh: {
    heroKicker: "模板",
    title: "论文投稿模板",
    intro:
      "请选择适合你写作环境的模板包。F.U.C.K Journal 现在提供中英文 Word 与 LaTeX 模板，使稿件在投稿前就更接近正式学术期刊，而不只是平台内的博客式编辑视图。",
    chooserTitle: "选择你的模板包",
    chooserBody:
      "四套模板遵循同一套编辑逻辑：正式的标题信息、摘要与关键词、克制的学术排版，以及面向后续出版流程的页面结构。",
    downloadLabel: "下载模板",
    editorialSpecTitle: "期刊版式规范",
    editorialSpecs: [
      "A4 页面，期刊式标题区与更紧凑的学术正文排版。",
      "结构化元信息：标题、副标题、作者、单位、摘要、关键词。",
      "正文阅读体验更接近论文期刊，而非博客文章。",
      "参考文献、图表与公式留出后续审稿和出版处理空间。",
    ],
    writingGuideTitle: "写作建议",
    writingGuide: [
      "在终稿阶段使用模板，先稳定稿件视觉结构。",
      "标题、摘要与关键词应足够准确，便于检索和送审。",
      "如果公式、引文或版式较复杂，优先使用文件模板。",
      "如果还在反复修改内容，优先使用平台内结构化投稿。",
    ],
    checklistTitle: "提交前检查",
    checklist: [
      "标题和摘要已经完成。",
      "关键词能够准确反映稿件论题与领域词汇。",
      "正文层级、参考文献和图表格式保持一致。",
      "上传的 PDF 与当前最新稿件一致。",
    ],
    comparisonTitle: "两种投稿方式",
    comparisonCards: [
      {
        title: "平台内结构化投稿",
        body: "适合反复修改、返修循环和编辑部内部处理。",
      },
      {
        title: "文件式期刊稿件",
        body: "适合希望稿件在投稿时就具备正式论文期刊外观的作者。",
      },
    ],
    structureTitle: "建议的论文结构",
    structureSections: [
      "标题与可选副标题",
      "作者与单位",
      "摘要",
      "关键词",
      "引言",
      "主体分析 / 论证",
      "结论",
      "参考文献",
    ],
  },
};

export function getTemplatePackages(locale: Locale) {
  return packages[locale];
}

export function getTemplatePageContent(locale: Locale) {
  return pageContent[locale];
}
