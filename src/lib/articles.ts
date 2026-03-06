import fs from "node:fs";
import path from "node:path";

import { compileMDX } from "next-mdx-remote/rsc";
import type { MDXComponents } from "mdx/types";
import matter from "gray-matter";
import GithubSlugger from "github-slugger";
import readingTime from "reading-time";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import remarkGfm from "remark-gfm";
import remarkSmartypants from "remark-smartypants";

import type { Locale } from "@/i18n/routing";
import { routing } from "@/i18n/routing";

const ARTICLES_DIRECTORY = path.join(process.cwd(), "content/articles");

type ArticleFrontmatter = {
  title: string;
  author: string;
  date: string;
  tags: string[];
  language: Locale;
  summary: string;
  featured?: boolean;
};

export type TocItem = {
  id: string;
  text: string;
  level: 2 | 3;
};

export type ArticleSummary = ArticleFrontmatter & {
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

function parseArticle(slug: string, locale: Locale): Article | null {
  const articlePath = getArticlePath(slug, locale);

  if (!fs.existsSync(articlePath)) {
    return null;
  }

  const file = fs.readFileSync(articlePath, "utf8");
  const { data, content } = matter(file);
  const frontmatter = data as ArticleFrontmatter;

  return {
    slug,
    title: frontmatter.title,
    author: frontmatter.author,
    date: frontmatter.date,
    tags: frontmatter.tags ?? [],
    language: frontmatter.language ?? locale,
    summary: frontmatter.summary,
    featured: Boolean(frontmatter.featured),
    readTime: readingTime(content).text,
    availableLocales: getAvailableLocales(slug),
    toc: extractToc(content),
    content,
  };
}

export function getArticleSlugs() {
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
        remarkPlugins: [remarkGfm, remarkSmartypants],
        rehypePlugins: [
          rehypeSlug,
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
