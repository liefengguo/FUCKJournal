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
        "A review-ready manuscript layout for authors preparing a formal journal paper in Word, with title matter, abstract, keywords, and disciplined body formatting.",
      note: "Best for authors who want a serious PDF-first paper style without building a LaTeX workflow.",
    },
    {
      id: "word-zh",
      format: "Word",
      language: "Chinese",
      fileLabel: "DOCX",
      href: "/templates/fuck-journal-word-template-zh.docx",
      title: "Chinese Word Template",
      description:
        "A Chinese manuscript template aligned with the journal's editorial reading standard, including structured metadata and formal paper framing.",
      note: "Best for Chinese-language submissions prepared in Word or WPS before exporting the final PDF.",
    },
    {
      id: "latex-en",
      format: "LaTeX",
      language: "English",
      fileLabel: "ZIP",
      href: "/templates/fuck-journal-latex-template-en.zip",
      title: "English LaTeX Template",
      description:
        "A clean LaTeX package with journal class, example manuscript, and front-matter commands for authors who need precise layout control.",
      note: "Recommended for manuscripts with equations, figures, tables, footnotes, or citation-heavy structure.",
    },
    {
      id: "latex-zh",
      format: "LaTeX",
      language: "Chinese",
      fileLabel: "ZIP",
      href: "/templates/fuck-journal-latex-template-zh.zip",
      title: "Chinese LaTeX Template",
      description:
        "A Chinese LaTeX package for formal journal submission, with ctex support, structured metadata, and article-style page design.",
      note: "Recommended for Chinese manuscripts with complex formulas, tables, references, or layout constraints.",
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
        "适合英文稿件的 Word 模板，包含正式标题页、摘要、关键词与论文式正文排版。",
      note: "适合希望在 Word 中完成正式稿布局，再导出 PDF 投稿的作者。",
    },
    {
      id: "word-zh",
      format: "Word",
      language: "Chinese",
      fileLabel: "DOCX",
      href: "/templates/fuck-journal-word-template-zh.docx",
      title: "中文 Word 模板",
      description:
        "适合中文稿件的投稿模板，包含结构化元信息与正式论文页面框架。",
      note: "适合使用 Word 或 WPS 撰写中文论文，并导出最终 PDF 的作者。",
    },
    {
      id: "latex-en",
      format: "LaTeX",
      language: "English",
      fileLabel: "ZIP",
      href: "/templates/fuck-journal-latex-template-en.zip",
      title: "英文 LaTeX 模板",
      description:
        "包含 journal class、示例稿件与前置信息命令的英文 LaTeX 模板包，适合正式学术排版。",
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
        "支持中文排版的 LaTeX 模板包，包含结构化元信息与正式论文版式。",
      note: "适合包含复杂公式、表格或特殊版面要求的中文稿件。",
    },
  ],
};

const pageContent: Record<Locale, TemplatePageContent> = {
  en: {
    heroKicker: "Templates",
    title: "Manuscript Templates",
    intro:
      "Choose a manuscript package that fits your writing environment. These templates help authors prepare a review-ready PDF that already looks like a serious paper before it enters editorial workflow.",
    chooserTitle: "Choose your template package",
    chooserBody:
      "Each package follows the same editorial logic: formal front matter, abstract and keywords, disciplined body typography, and a page structure that survives review and publication.",
    downloadLabel: "Download template",
    editorialSpecTitle: "Editorial specification",
    editorialSpecs: [
      "A4 page design with formal front matter and compact scholarly typography.",
      "Structured metadata for title, authors, affiliations, abstract, and keywords.",
      "Body text arranged for paper reading rather than blog presentation.",
      "Figures, tables, formulas, and references prepared for review and later publication handling.",
    ],
    writingGuideTitle: "Writing guidance",
    writingGuide: [
      "Use the template to stabilize the paper's visual structure before submission.",
      "Keep title, abstract, and keywords precise enough for screening, review, and indexing.",
      "Prefer file-based templates when final layout, citations, or formulas matter.",
      "Submit the review-ready PDF through the private submission workspace.",
    ],
    checklistTitle: "Before you submit",
    checklist: [
      "The title, authorship, and abstract are complete.",
      "Keywords reflect the manuscript argument and field vocabulary.",
      "Main sections, references, figures, and tables follow a consistent structure.",
      "The uploaded PDF matches the latest manuscript state.",
    ],
    comparisonTitle: "Workflow modes",
    comparisonCards: [
      {
        title: "Author workspace",
        body: "Use the platform to manage metadata, cover letters, PDF delivery, and editorial status without recreating the manuscript inside the site.",
      },
      {
        title: "PDF-first manuscript",
        body: "Use these templates when you want the paper to already look publication-grade at the moment it is submitted and reviewed.",
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
      "请选择适合你写作环境的模板包。这些模板的作用，是帮助作者在进入编辑流程之前，就先把送审 PDF 收成正式论文的样子。",
    chooserTitle: "选择你的模板包",
    chooserBody:
      "四套模板遵循同一套编辑逻辑：正式标题信息、摘要与关键词、克制的学术排版，以及能承受审稿与出版流程的页面结构。",
    downloadLabel: "下载模板",
    editorialSpecTitle: "期刊版式规范",
    editorialSpecs: [
      "A4 页面，正式标题区与更紧凑的学术正文排版。",
      "结构化元信息：标题、作者、单位、摘要、关键词。",
      "正文阅读体验更接近论文，而不是网站文章。",
      "参考文献、图表与公式为后续审稿和出版处理预留空间。",
    ],
    writingGuideTitle: "写作建议",
    writingGuide: [
      "在终稿阶段使用模板，先把稿件视觉结构稳定下来。",
      "标题、摘要与关键词应足够准确，便于初筛、送审与检索。",
      "如果公式、引文或版式较复杂，优先使用文件模板。",
      "正式投稿时，请通过私有投稿工作区上传送审 PDF。",
    ],
    checklistTitle: "提交前检查",
    checklist: [
      "标题、作者信息与摘要已经完成。",
      "关键词能够准确反映稿件论题与领域词汇。",
      "正文层级、参考文献、图表和公式格式保持一致。",
      "上传的 PDF 与当前最新稿件一致。",
    ],
    comparisonTitle: "两种投稿方式",
    comparisonCards: [
      {
        title: "作者工作区",
        body: "在平台内管理元数据、附信、PDF 交付以及编辑流程状态，而不是在站内重写一遍稿件。",
      },
      {
        title: "PDF-first 稿件",
        body: "适合希望稿件在投稿时就已经具备正式论文外观的作者。",
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
