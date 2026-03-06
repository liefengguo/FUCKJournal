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

  return (
    <>
      <ReadingProgressBar />
      <article className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-12">
        <div className="max-w-4xl">
          <Button asChild variant="ghost" className="mb-8">
            <LocaleLink locale={locale} href="/articles">
              {tCommon("backToArticles")}
            </LocaleLink>
          </Button>
          <p className="section-kicker">{article.tags.join(" • ")}</p>
          <h1 className="mt-4 font-display text-5xl leading-tight sm:text-6xl lg:text-7xl">
            {article.title}
          </h1>
          <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 font-sans text-xs uppercase tracking-[0.22em] text-muted-foreground">
            <span>{article.author}</span>
            <span>{formatDate(article.date, locale)}</span>
            <span>{article.readTime}</span>
          </div>
          <p className="mt-8 max-w-3xl font-serif text-2xl leading-relaxed text-muted-foreground">
            {article.summary}
          </p>
          {alternateLocale ? (
            <Button asChild variant="outline" className="mt-8">
              <LocaleLink locale={alternateLocale} href={`/articles/${slug}`}>
                {tCommon("translationAvailable")}
              </LocaleLink>
            </Button>
          ) : null}
        </div>
        <div className="mt-14 grid gap-10 lg:grid-cols-[minmax(0,1fr)_290px] lg:items-start">
          <div className="paper-panel px-6 py-10 sm:px-10 lg:px-14 lg:py-12">
            <div className="article-prose [&_li]:ml-5 [&_li]:font-serif [&_li]:text-xl [&_li]:leading-[1.85] [&_ol]:list-decimal [&_ul]:list-disc">
              {content}
            </div>
          </div>
          <TableOfContents items={article.toc} title={tCommon("tableOfContents")} />
        </div>
      </article>
    </>
  );
}
