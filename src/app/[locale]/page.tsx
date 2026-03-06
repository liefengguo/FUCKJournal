import type { Metadata } from "next";

import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { ArticleCard } from "@/components/article-card";
import { AuthorCard } from "@/components/author-card";
import { LocaleLink } from "@/components/locale-link";
import { Wordmark } from "@/components/wordmark";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Locale } from "@/i18n/routing";
import { getFeaturedArticles, getLatestArticles } from "@/lib/articles";
import { getCopy } from "@/lib/copy";
import { getContributors } from "@/lib/contributors";
import { createPageMetadata } from "@/lib/metadata";
import { getBrandMeanings, siteConfig } from "@/lib/site";

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

  setRequestLocale(locale);

  const copy = getCopy(locale);
  const featured = getFeaturedArticles(locale);
  const latest = getLatestArticles(locale);
  const contributors = getContributors(locale);
  const brandMeanings = getBrandMeanings(locale);
  const tCommon = await getTranslations("Common");

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
            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Button asChild size="lg">
                <LocaleLink locale={locale} href="/articles">
                  {tCommon("readArticles")}
                </LocaleLink>
              </Button>
              <Button asChild variant="outline" size="lg">
                <LocaleLink locale={locale} href="/submit">
                  {tCommon("submitYourWork")}
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
      </section>

      <section className="pt-20">
        <div className="paper-panel px-6 py-10 sm:px-10 lg:px-14">
          <div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr] lg:items-start">
            <div>
              <p className="section-kicker">{copy.home.manifestoTitle}</p>
              <h2 className="section-title mt-3">{copy.home.manifestoTitle}</h2>
            </div>
            <div className="space-y-6">
              <p className="font-serif text-2xl leading-relaxed text-foreground/90">
                {copy.home.manifestoBody}
              </p>
              <Button asChild variant="outline">
                <LocaleLink locale={locale} href="/manifesto">
                  {copy.home.manifestoCta}
                </LocaleLink>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="pt-20">
        <div className="mb-10">
          <p className="section-kicker">{tCommon("latestEssays")}</p>
          <h2 className="section-title mt-3">{tCommon("latestEssays")}</h2>
        </div>
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
