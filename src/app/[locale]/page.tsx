import type { Metadata } from "next";

import Image from "next/image";
import { unstable_noStore as noStore } from "next/cache";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { ArticleCard } from "@/components/article-card";
import { AuthorCard } from "@/components/author-card";
import { LocaleLink } from "@/components/locale-link";
import { Wordmark } from "@/components/wordmark";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Locale } from "@/i18n/routing";
import type { ArticleSummary } from "@/lib/articles";
import { getCopy } from "@/lib/copy";
import { getContributors } from "@/lib/contributors";
import { createPageMetadata } from "@/lib/metadata";
import { getBrandMeanings, siteConfig } from "@/lib/site";
import { listPublishedSubmissionSummaries } from "@/lib/submissions";

type HomePageProps = {
  params: {
    locale: Locale;
  };
};

export async function generateMetadata({
  params,
}: HomePageProps): Promise<Metadata> {
  const copy = getCopy(params.locale);

  return createPageMetadata({
    locale: params.locale,
    title: siteConfig.name,
    description: copy.home.heroNote,
    pathname: `/${params.locale}`,
  });
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = params;

  noStore();
  setRequestLocale(locale);

  const copy = getCopy(locale);
  const publishedSubmissions = await listPublishedSubmissionSummaries(locale);
  const contributors = getContributors(locale);
  const brandMeanings = getBrandMeanings(locale);
  const tCommon = await getTranslations("Common");
  const featured = publishedSubmissions.slice(0, 3).map((submission) => {
    const title = submission.publicationTitle?.trim() || submission.title.trim();
    const summary =
      submission.publicationExcerpt?.trim() || submission.abstract?.trim() || "";

    return {
      slug: submission.publicationSlug ?? submission.publicId.toLowerCase(),
      title,
      subtitle: undefined,
      author: submission.author.name || submission.author.email,
      authors: [{ name: submission.author.name || submission.author.email }],
      date:
        submission.publishedAt?.toISOString() ?? submission.updatedAt.toISOString(),
      tags: submission.publicationTags.length
        ? submission.publicationTags
        : submission.keywords,
      language: locale,
      summary,
      featured: false,
      articleType: locale === "zh" ? "研究论文" : "Research article",
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
      readTime: locale === "zh" ? "稿件 PDF" : "Manuscript PDF",
      availableLocales: [locale],
      toc: [],
    } satisfies ArticleSummary;
  });
  const latest = publishedSubmissions.slice(0, 4).map((submission) => {
    const title = submission.publicationTitle?.trim() || submission.title.trim();
    const summary =
      submission.publicationExcerpt?.trim() || submission.abstract?.trim() || "";

    return {
      slug: submission.publicationSlug ?? submission.publicId.toLowerCase(),
      title,
      subtitle: undefined,
      author: submission.author.name || submission.author.email,
      authors: [{ name: submission.author.name || submission.author.email }],
      date:
        submission.publishedAt?.toISOString() ?? submission.updatedAt.toISOString(),
      tags: submission.publicationTags.length
        ? submission.publicationTags
        : submission.keywords,
      language: locale,
      summary,
      featured: false,
      articleType: locale === "zh" ? "研究论文" : "Research article",
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
      readTime: locale === "zh" ? "稿件 PDF" : "Manuscript PDF",
      availableLocales: [locale],
      toc: [],
    } satisfies ArticleSummary;
  });

  return (
    <div className="mx-auto max-w-7xl px-5 pb-20 pt-10 sm:px-8 lg:px-12">
      <section className="paper-panel bg-journal-glow px-6 py-10 sm:px-10 sm:py-14 lg:px-14 lg:py-16">
        <div className="hero-grid items-end">
          <div className="animate-fade-up">
            <p className="section-kicker">{copy.home.eyebrow}</p>
            <h1 className="sr-only">{siteConfig.name}</h1>
            <Wordmark locale={locale} size="hero" showSubtitle className="mt-6" />
            <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {brandMeanings.map((item) => (
                <div
                  key={item.letter}
                  className="rounded-[22px] border border-border/80 bg-background/70 px-4 py-3 backdrop-blur-sm"
                >
                  <p className="font-sans text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
                    {item.letter}
                  </p>
                  <p className="mt-2 font-serif text-lg leading-tight">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
            <p className="mt-8 max-w-2xl font-serif text-2xl leading-relaxed text-foreground/90">
              {copy.home.tagline}
            </p>
            <p className="mt-6 max-w-3xl font-serif text-lg leading-relaxed text-muted-foreground">
              {copy.home.heroNote}
            </p>
            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
              <Button asChild size="lg">
                <LocaleLink locale={locale} href="/submit">
                  {copy.home.submitCta}
                </LocaleLink>
              </Button>
              <Button asChild variant="outline" size="lg">
                <LocaleLink locale={locale} href="/manifesto">
                  {copy.home.manifestoCta}
                </LocaleLink>
              </Button>
              <Button asChild variant="outline" size="lg">
                <LocaleLink locale={locale} href="/protocol">
                  {copy.home.protocolCta}
                </LocaleLink>
              </Button>
            </div>
          </div>
          <Card className="border-journal-red/15 bg-background/80">
            <CardContent className="space-y-6 p-8">
              <div className="overflow-hidden rounded-[26px] border border-border/80">
                <Image
                  src="/issue-cover.svg"
                  alt="F.U.C.K Journal cover artwork"
                  width={960}
                  height={1200}
                  className="h-auto w-full"
                  priority
                />
              </div>
              <p className="section-kicker">{copy.home.issueLabel}</p>
              <div className="space-y-3">
                <p className="font-display text-4xl leading-none">{copy.home.issueTitle}</p>
                <p className="font-serif text-lg leading-relaxed text-muted-foreground">
                  {copy.home.issueBody}
                </p>
              </div>
              <div className="grid gap-4 border-t border-border pt-6 sm:grid-cols-3">
                <div>
                  <p className="font-display text-3xl">{featured.length}</p>
                  <p className="mt-1 font-sans text-xs uppercase tracking-[0.22em] text-muted-foreground">
                    {copy.home.statFeatured}
                  </p>
                </div>
                <div>
                  <p className="font-display text-3xl">{latest.length}</p>
                  <p className="mt-1 font-sans text-xs uppercase tracking-[0.22em] text-muted-foreground">
                    {copy.home.statEssays}
                  </p>
                </div>
                <div>
                  <p className="font-display text-3xl">2</p>
                  <p className="mt-1 font-sans text-xs uppercase tracking-[0.22em] text-muted-foreground">
                    {copy.home.statLanguages}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="pt-20">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <p className="section-kicker">{tCommon("featuredArticles")}</p>
            <h2 className="section-title mt-3">{tCommon("featuredArticles")}</h2>
          </div>
          <Button asChild variant="ghost" className="hidden sm:inline-flex">
            <LocaleLink locale={locale} href="/articles">
              {tCommon("viewAllArticles")}
            </LocaleLink>
          </Button>
        </div>
        {featured.length ? (
          <div className="grid gap-6 lg:grid-cols-3">
            {featured.map((article, index) => (
              <div
                key={article.slug}
                className="animate-fade-up"
                style={{ animationDelay: `${index * 120}ms` }}
              >
                <ArticleCard article={article} locale={locale} />
              </div>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="space-y-4 p-8">
              <p className="font-display text-3xl">
                {locale === "zh" ? "本期档案正在生成" : "The archive is being prepared"}
              </p>
              <p className="font-serif text-lg leading-relaxed text-muted-foreground">
                {locale === "zh"
                  ? "已发布论文会在这里作为正式期刊稿件出现。"
                  : "Published papers will appear here as formal journal manuscripts."}
              </p>
            </CardContent>
          </Card>
        )}
      </section>

      <section className="pt-20">
        <div className="grid gap-8 xl:grid-cols-[1.15fr_0.85fr]">
          <div>
            <p className="section-kicker">{copy.home.principlesTitle}</p>
            <h2 className="section-title mt-3">{copy.home.principlesTitle}</h2>
            <p className="mt-4 max-w-3xl font-serif text-lg leading-relaxed text-muted-foreground">
              {copy.home.principlesIntro}
            </p>
            <div className="mt-8 grid gap-5 md:grid-cols-2">
              {copy.home.principles.map((principle) => (
                <Card key={principle.title} className="border-border/70 bg-card/90">
                  <CardContent className="space-y-4 p-6">
                    <h3 className="font-display text-3xl leading-tight">
                      {principle.title}
                    </h3>
                    <p className="font-serif text-lg leading-relaxed text-muted-foreground">
                      {principle.body}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="paper-panel px-6 py-8 sm:px-8">
            <p className="section-kicker">{copy.home.governanceTitle}</p>
            <h2 className="mt-3 font-display text-4xl leading-tight">
              {copy.home.governanceTitle}
            </h2>
            <p className="mt-5 font-serif text-xl leading-relaxed text-muted-foreground">
              {copy.home.governanceBody}
            </p>
            <div className="mt-8 space-y-4">
              {copy.home.governanceCards.map((card) => (
                <Card key={card.href} className="border-border/70 bg-background/70">
                  <CardContent className="space-y-4 p-5">
                    <div>
                      <p className="font-display text-2xl">{card.title}</p>
                      <p className="mt-3 font-serif text-lg leading-relaxed text-muted-foreground">
                        {card.body}
                      </p>
                    </div>
                    <Button asChild variant="outline" size="sm">
                      <LocaleLink locale={locale} href={card.href}>
                        {card.cta}
                      </LocaleLink>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="pt-20">
        <div className="mb-10">
          <p className="section-kicker">{tCommon("latestEssays")}</p>
          <h2 className="section-title mt-3">{tCommon("latestEssays")}</h2>
        </div>
        {latest.length ? (
          <div className="space-y-6">
            {latest.map((article) => (
              <ArticleCard
                key={article.slug}
                article={article}
                locale={locale}
                variant="list"
              />
            ))}
          </div>
        ) : null}
      </section>

      <section className="pt-20">
        <div className="mb-10 max-w-3xl">
          <p className="section-kicker">{copy.home.contributorsTitle}</p>
          <h2 className="section-title mt-3">{copy.home.contributorsTitle}</h2>
          <p className="mt-4 font-serif text-lg leading-relaxed text-muted-foreground">
            {copy.home.contributorsBody}
          </p>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          {contributors.map((contributor) => (
            <AuthorCard key={contributor.name} contributor={contributor} />
          ))}
        </div>
      </section>
    </div>
  );
}
