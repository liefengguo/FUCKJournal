import fs from "node:fs";
import path from "node:path";

import { compileMDX } from "next-mdx-remote/rsc";
import type { MDXComponents } from "mdx/types";
import matter from "gray-matter";
import GithubSlugger from "github-slugger";
import readingTime from "reading-time";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeKatex from "rehype-katex";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkSmartypants from "remark-smartypants";

import type { Locale } from "@/i18n/routing";
import { routing } from "@/i18n/routing";

const ARTICLES_DIRECTORY = path.join(process.cwd(), "content/articles");

export type ArticleAuthor = {
  name: string;
  affiliation?: string;
  location?: string;
  email?: string;
};

export type ArticleIssue = {
  year?: string;
  volume?: string;
  number?: string;
  section?: string;
  pages?: string;
  articleNumber?: string;
};

type ArticleFrontmatter = {
  title: string;
  subtitle?: string;
  author?: string;
  authors?: ArticleAuthor[];
  date: string | Date;
  tags: string[];
  language: Locale;
  summary: string;
  featured?: boolean;
  articleType?: string;
  doi?: string;
  citation?: string;
  note?: string;
  received?: string | Date;
  revised?: string | Date;
  accepted?: string | Date;
  issue?: ArticleIssue;
  indexTerms?: string[];
  impactStatement?: string;
  layout?: "single" | "double";
};

export type TocItem = {
  id: string;
  text: string;
  level: 2 | 3;
};

export type ArticleSummary = Omit<
  ArticleFrontmatter,
  | "author"
  | "authors"
  | "date"
  | "received"
  | "revised"
  | "accepted"
  | "indexTerms"
  | "layout"
> & {
  author: string;
  authors: ArticleAuthor[];
  date: string;
  received?: string;
  revised?: string;
  accepted?: string;
  indexTerms: string[];
  layout: "single" | "double";
  slug: string;
  readTime: string;
  availableLocales: Locale[];
  toc: TocItem[];
};

export type Article = ArticleSummary & {
  content: string;
};

function getArticlePath(slug: string, locale: Locale) {
  return path.join(ARTICLES_DIRECTORY, slug, `${locale}.mdx`);
}

function articleExists(slug: string, locale: Locale) {
  return fs.existsSync(getArticlePath(slug, locale));
}

function sanitizeHeadingText(value: string) {
  return value
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[*_`#]/g, "")
    .replace(/\{.*\}$/, "")
    .trim();
}

function extractToc(content: string): TocItem[] {
  const slugger = new GithubSlugger();
  const headings = Array.from(content.matchAll(/^(##|###)\s+(.+)$/gm));

  return headings.map((heading) => {
    const level = heading[1] === "##" ? 2 : 3;
    const text = sanitizeHeadingText(heading[2]);

    return {
      id: slugger.slug(text),
      text,
      level,
    };
  });
}

function getAvailableLocales(slug: string) {
  return routing.locales.filter((locale) => articleExists(slug, locale));
}

function normalizeDateish(value: string | Date | undefined) {
  if (!value) {
    return undefined;
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  return value.trim() || undefined;
}

function normalizeAuthors(frontmatter: ArticleFrontmatter) {
  if (frontmatter.authors?.length) {
    return frontmatter.authors
      .map((author) => ({
        name: author.name?.trim() ?? "",
        affiliation: author.affiliation?.trim() || undefined,
        location: author.location?.trim() || undefined,
        email: author.email?.trim() || undefined,
      }))
      .filter((author) => author.name);
  }

  if (frontmatter.author?.trim()) {
    return [{ name: frontmatter.author.trim() }];
  }

  return [];
}

function normalizeIssue(value: ArticleFrontmatter["issue"]) {
  if (!value) {
    return undefined;
  }

  const issue = {
    year: value.year?.trim() || undefined,
    volume: value.volume?.trim() || undefined,
    number: value.number?.trim() || undefined,
    section: value.section?.trim() || undefined,
    pages: value.pages?.trim() || undefined,
    articleNumber: value.articleNumber?.trim() || undefined,
  };

  return Object.values(issue).some(Boolean) ? issue : undefined;
}

function normalizeStringArray(values: string[] | undefined) {
  if (!values?.length) {
    return [];
  }

  return values.map((value) => value.trim()).filter(Boolean);
}

function joinNames(names: string[], locale: Locale) {
  if (names.length <= 1) {
    return names[0] ?? "";
  }

  if (locale === "zh") {
    return names.join("、");
  }

  if (names.length === 2) {
    return `${names[0]} and ${names[1]}`;
  }

  return `${names.slice(0, -1).join(", ")}, and ${names[names.length - 1]}`;
}

export function getArticleByline(
  article: Pick<ArticleSummary, "authors" | "author" | "language">,
  locale = article.language,
) {
  const authorNames = article.authors.map((author) => author.name).filter(Boolean);

  if (authorNames.length) {
    return joinNames(authorNames, locale);
  }

  return article.author;
}

export function formatArticleIssue(
  issue: ArticleIssue | undefined,
  locale: Locale,
) {
  if (!issue) {
    return locale === "zh" ? "期次待定" : "Issue placement pending";
  }

  const fragments = [];

  if (issue.year) {
    fragments.push(issue.year);
  }

  if (issue.volume) {
    fragments.push(locale === "zh" ? `第 ${issue.volume} 卷` : `Vol. ${issue.volume}`);
  }

  if (issue.number) {
    fragments.push(locale === "zh" ? `第 ${issue.number} 期` : `No. ${issue.number}`);
  }

  if (issue.section) {
    fragments.push(issue.section);
  }

  if (issue.pages) {
    fragments.push(locale === "zh" ? `页码 ${issue.pages}` : `pp. ${issue.pages}`);
  }

  if (issue.articleNumber) {
    fragments.push(
      locale === "zh"
        ? `文章编号 ${issue.articleNumber}`
        : `Article ${issue.articleNumber}`,
    );
  }

  return fragments.join(locale === "zh" ? " · " : " / ");
}

export function formatArticleCitation(
  article: Pick<
    ArticleSummary,
    "authors" | "author" | "language" | "date" | "title" | "citation" | "issue"
  >,
  locale = article.language,
) {
  if (article.citation?.trim()) {
    return article.citation.trim();
  }

  const year = new Date(article.date).getFullYear();
  const byline = getArticleByline(article, locale);
  const issue = formatArticleIssue(article.issue, locale);

  return locale === "zh"
    ? `${byline}（${year}）。《${article.title}》。F.U.C.K Journal，${issue}。`
    : `${byline} (${year}). ${article.title}. F.U.C.K Journal. ${issue}.`;
}

function parseArticle(slug: string, locale: Locale): Article | null {
  const articlePath = getArticlePath(slug, locale);

  if (!fs.existsSync(articlePath)) {
    return null;
  }

  const file = fs.readFileSync(articlePath, "utf8");
  const { data, content } = matter(file);
  const frontmatter = data as ArticleFrontmatter;
  const authors = normalizeAuthors(frontmatter);
  const authorLine = authors.map((author) => author.name).join(", ");

  return {
    slug,
    title: frontmatter.title,
    subtitle: frontmatter.subtitle,
    author: frontmatter.author?.trim() || authorLine,
    authors,
    date: normalizeDateish(frontmatter.date) ?? new Date().toISOString(),
    tags: frontmatter.tags ?? [],
    language: frontmatter.language ?? locale,
    summary: frontmatter.summary,
    featured: Boolean(frontmatter.featured),
    articleType: frontmatter.articleType?.trim(),
    doi: frontmatter.doi?.trim(),
    citation: frontmatter.citation?.trim(),
    note: frontmatter.note?.trim(),
    indexTerms: normalizeStringArray(frontmatter.indexTerms),
    impactStatement: frontmatter.impactStatement?.trim(),
    layout: frontmatter.layout === "single" ? "single" : "double",
    received: normalizeDateish(frontmatter.received),
    revised: normalizeDateish(frontmatter.revised),
    accepted: normalizeDateish(frontmatter.accepted),
    issue: normalizeIssue(frontmatter.issue),
    readTime: readingTime(content).text,
    availableLocales: getAvailableLocales(slug),
    toc: extractToc(content),
    content,
  };
}

export function getArticleSlugs() {
  if (!fs.existsSync(ARTICLES_DIRECTORY)) {
    return [];
  }

  return fs
    .readdirSync(ARTICLES_DIRECTORY, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name);
}

export function getAllArticles(locale: Locale) {
  return getArticleSlugs()
    .map((slug) => parseArticle(slug, locale))
    .filter((article): article is Article => article !== null)
    .sort(
      (left, right) =>
        new Date(right.date).getTime() - new Date(left.date).getTime(),
    );
}

export function getFeaturedArticles(locale: Locale) {
  return getAllArticles(locale)
    .filter((article) => article.featured)
    .slice(0, 3);
}

export function getLatestArticles(locale: Locale) {
  return getAllArticles(locale).slice(0, 4);
}

export function getArticleBySlug(slug: string, locale: Locale) {
  return parseArticle(slug, locale);
}

export async function compileArticle(
  source: string,
  components: MDXComponents,
) {
  return compileMDX({
    source,
    components,
    options: {
      mdxOptions: {
        remarkPlugins: [remarkGfm, remarkMath, remarkSmartypants],
        rehypePlugins: [
          rehypeSlug,
          [rehypeKatex, { strict: false }],
          [
            rehypeAutolinkHeadings,
            {
              behavior: "wrap",
              properties: {
                className: ["subheading-anchor"],
              },
            },
          ],
        ],
      },
    },
  });
}
