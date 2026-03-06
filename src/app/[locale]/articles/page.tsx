import type { Metadata } from "next";

import { setRequestLocale } from "next-intl/server";

import { ArticleCard } from "@/components/article-card";
import type { Locale } from "@/i18n/routing";
import { getAllArticles } from "@/lib/articles";
import { getCopy } from "@/lib/copy";
import { createPageMetadata } from "@/lib/metadata";

type ArticlesPageProps = {
  params: {
    locale: Locale;
  };
};

export async function generateMetadata({
  params,
}: ArticlesPageProps): Promise<Metadata> {
  const copy = getCopy(params.locale);

  return createPageMetadata({
    locale: params.locale,
    title: copy.articles.title,
    description: copy.articles.intro,
    pathname: `/${params.locale}/articles`,
  });
}

export default function ArticlesPage({ params }: ArticlesPageProps) {
  const { locale } = params;

  setRequestLocale(locale);
  const copy = getCopy(locale);
  const articles = getAllArticles(locale);

  return (
    <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-12">
      <div className="max-w-3xl">
        <p className="section-kicker">Archive</p>
        <h1 className="mt-4 font-display text-5xl sm:text-6xl">
          {copy.articles.title}
        </h1>
        <p className="mt-5 font-serif text-xl leading-relaxed text-muted-foreground">
          {copy.articles.intro}
        </p>
      </div>
      <div className="mt-12 space-y-6">
        {articles.map((article) => (
          <ArticleCard
            key={article.slug}
            article={article}
            locale={locale}
            variant="list"
          />
        ))}
      </div>
    </div>
  );
}
