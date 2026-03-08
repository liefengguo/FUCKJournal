import type { Metadata } from "next";

import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { LocaleLink } from "@/components/locale-link";
import { mdxComponents } from "@/components/mdx-components";
import { ReadingProgressBar } from "@/components/reading-progress-bar";
import { TableOfContents } from "@/components/table-of-contents";
import { Button } from "@/components/ui/button";
import type { Locale } from "@/i18n/routing";
import {
  compileArticle,
  getArticleBySlug,
  getArticleSlugs,
} from "@/lib/articles";
import { createPageMetadata } from "@/lib/metadata";
import { formatDate } from "@/lib/site";
import { routing } from "@/i18n/routing";

type ArticlePageProps = {
  params: {
    locale: Locale;
    slug: string;
  };
};

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    getArticleSlugs()
      .filter((slug) => getArticleBySlug(slug, locale))
      .map((slug) => ({ locale, slug })),
  );
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const article = getArticleBySlug(params.slug, params.locale);

  if (!article) {
    return {};
  }

  return createPageMetadata({
    locale: params.locale,
    title: article.title,
    description: article.summary,
    pathname: `/${params.locale}/articles/${params.slug}`,
    type: "article",
    tags: article.tags,
    publishedTime: article.date,
  });
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { locale, slug } = params;

  setRequestLocale(locale);
  const article = getArticleBySlug(slug, locale);

  if (!article) {
    notFound();
  }

  const { content } = await compileArticle(article.content, mdxComponents);
  const tCommon = await getTranslations("Common");
  const alternateLocale = article.availableLocales.find((item) => item !== locale);
  const abstractLabel = locale === "zh" ? "摘要" : "Abstract";
  const keywordsLabel = locale === "zh" ? "关键词" : "Keywords";
  const articleTypeLabel = locale === "zh" ? "研究文章" : "Research article";
  const publishedLabel = locale === "zh" ? "发表日期" : "Published";
  const readingLabel = locale === "zh" ? "阅读时长" : "Reading time";

  return (
    <>
      <ReadingProgressBar />
      <article className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-12">
        <div className="max-w-7xl">
          <Button asChild variant="ghost" className="mb-8">
            <LocaleLink locale={locale} href="/articles">
              {tCommon("backToArticles")}
            </LocaleLink>
          </Button>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_290px] lg:items-start">
            <div className="paper-panel px-6 py-8 sm:px-10 lg:px-14 lg:py-12">
              <div className="border-b border-border/70 pb-8 text-center">
                <p className="font-sans text-[11px] uppercase tracking-[0.34em] text-muted-foreground">
                  {articleTypeLabel}
                </p>
                <p className="mt-4 font-display text-[2.75rem] leading-tight sm:text-[3.5rem]">
                  {article.title}
                </p>
                <p className="mt-5 font-serif text-xl leading-relaxed text-foreground/85">
                  {article.author}
                </p>
                <div className="mt-5 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-sans text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
                  <span>{formatDate(article.date, locale)}</span>
                  <span>{article.readTime}</span>
                  <span>F.U.C.K Journal</span>
                </div>
              </div>

              <div className="mt-8 grid gap-6 xl:grid-cols-[minmax(0,1fr)_220px] xl:items-start">
                <div className="article-abstract">
                  <p className="font-sans text-[11px] uppercase tracking-[0.32em] text-muted-foreground">
                    {abstractLabel}
                  </p>
                  <p className="mt-4 font-serif text-[1.06rem] leading-8 text-foreground/90">
                    {article.summary}
                  </p>
                </div>
                <div className="rounded-[24px] border border-border/70 bg-background/50 px-5 py-5">
                  <p className="font-sans text-[11px] uppercase tracking-[0.32em] text-muted-foreground">
                    {keywordsLabel}
                  </p>
                  <p className="mt-3 font-serif text-[1.02rem] leading-8 text-foreground/85">
                    {article.tags.join("  •  ")}
                  </p>
                  <div className="mt-5 border-t border-border/60 pt-4 font-sans text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
                    <p>{publishedLabel}</p>
                    <p className="mt-2 font-serif text-base normal-case tracking-normal text-foreground/85">
                      {formatDate(article.date, locale)}
                    </p>
                    <p className="mt-4">{readingLabel}</p>
                    <p className="mt-2 font-serif text-base normal-case tracking-normal text-foreground/85">
                      {article.readTime}
                    </p>
                  </div>
                </div>
              </div>

              {alternateLocale ? (
                <Button asChild variant="outline" className="mt-8">
                  <LocaleLink locale={alternateLocale} href={`/articles/${slug}`}>
                    {tCommon("translationAvailable")}
                  </LocaleLink>
                </Button>
              ) : null}

              <div className="article-manuscript mt-10 border-t border-border/70 pt-10">
                <div className="article-prose [&_li]:ml-5 [&_ol]:list-decimal [&_ul]:list-disc">
                  {content}
                </div>
              </div>
            </div>
            <TableOfContents items={article.toc} title={tCommon("tableOfContents")} />
          </div>
        </div>
      </article>
    </>
  );
}
