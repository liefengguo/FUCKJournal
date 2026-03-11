import type { Metadata } from "next";

import { unstable_noStore as noStore } from "next/cache";
import { setRequestLocale } from "next-intl/server";

import { ArticleCard } from "@/components/article-card";
import type { Locale } from "@/i18n/routing";
import type { ArticleSummary } from "@/lib/articles";
import { getCopy } from "@/lib/copy";
import { createPageMetadata } from "@/lib/metadata";
import { listPublishedSubmissionSummaries } from "@/lib/submissions";

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

export default async function ArticlesPage({ params }: ArticlesPageProps) {
  const { locale } = params;

  noStore();
  setRequestLocale(locale);
  const copy = getCopy(locale);
  const publishedSubmissions = await listPublishedSubmissionSummaries(locale);

  function toArticleSummary(
    submission: (typeof publishedSubmissions)[number],
  ): ArticleSummary {
    const title = submission.publicationTitle?.trim() || submission.title.trim();
    const summary =
      submission.publicationExcerpt?.trim() || submission.abstract?.trim() || "";
    const tags = submission.publicationTags.length
      ? submission.publicationTags
      : submission.keywords;

    return {
      slug: submission.publicationSlug ?? submission.publicId.toLowerCase(),
      title,
      subtitle: undefined,
      author: submission.author.name || submission.author.email,
      authors: [{ name: submission.author.name || submission.author.email }],
      date:
        submission.publishedAt?.toISOString() ?? submission.updatedAt.toISOString(),
      tags,
      language: locale,
      summary,
      featured: false,
      articleType:
        locale === "zh" ? "已发布投稿稿件" : "Published submission manuscript",
      doi: undefined,
      citation: undefined,
      note: undefined,
      indexTerms: [],
      impactStatement: undefined,
      layout: "single",
      received: undefined,
      revised: undefined,
      accepted: undefined,
      issue:
        submission.publicationYear &&
        submission.publicationVolume &&
        submission.publicationIssue
          ? {
              year: String(submission.publicationYear),
              volume: submission.publicationVolume,
              number: submission.publicationIssue,
            }
          : undefined,
      readTime: locale === "zh" ? "文件稿件" : "File manuscript",
      availableLocales: [locale],
      toc: [],
    };
  }

  return (
    <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-12">
      <div className="max-w-3xl">
        <p className="section-kicker">{locale === "zh" ? "档案" : "Archive"}</p>
        <h1 className="mt-4 font-display text-5xl sm:text-6xl">
          {copy.articles.title}
        </h1>
        <p className="mt-5 font-serif text-xl leading-relaxed text-muted-foreground">
          {copy.articles.intro}
        </p>
      </div>
      <div className="mt-12 space-y-6">
        {publishedSubmissions.length ? (
          publishedSubmissions.map((submission) => (
            <ArticleCard
              key={submission.publicId}
              article={toArticleSummary(submission)}
              locale={locale}
              variant="list"
            />
          ))
        ) : (
          <div className="rounded-[28px] border border-border/70 bg-card/70 px-6 py-8 sm:px-8">
            <p className="font-display text-3xl">
              {locale === "zh" ? "当前还没有已发布论文" : "No published papers yet"}
            </p>
            <p className="mt-4 max-w-3xl font-serif text-lg leading-relaxed text-muted-foreground">
              {locale === "zh"
                ? "作者稿件在通过编辑初筛、外审、接收和出版准备后，会出现在这里。"
                : "Published papers will appear here after editorial screening, peer review, acceptance, and publication preparation."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
