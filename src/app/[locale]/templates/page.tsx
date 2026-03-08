import type { Metadata } from "next";

import { setRequestLocale } from "next-intl/server";

import { TemplateDownloadGrid } from "@/components/templates/template-download-grid";
import { LocaleLink } from "@/components/locale-link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Locale } from "@/i18n/routing";
import { createPageMetadata } from "@/lib/metadata";
import { getTemplatePageContent } from "@/lib/template-packages";

type TemplatesPageProps = {
  params: {
    locale: Locale;
  };
};

export async function generateMetadata({
  params,
}: TemplatesPageProps): Promise<Metadata> {
  const copy = getTemplatePageContent(params.locale);

  return createPageMetadata({
    locale: params.locale,
    title: copy.title,
    description: copy.intro,
    pathname: `/${params.locale}/templates`,
  });
}

export default function TemplatesPage({ params }: TemplatesPageProps) {
  const { locale } = params;
  setRequestLocale(locale);

  const copy = getTemplatePageContent(locale);

  return (
    <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-12">
      <section className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
        <div className="max-w-4xl">
          <p className="section-kicker">{copy.heroKicker}</p>
          <h1 className="mt-4 font-display text-5xl sm:text-6xl">{copy.title}</h1>
          <p className="mt-6 font-serif text-xl leading-relaxed text-muted-foreground">
            {copy.intro}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <LocaleLink locale={locale} href="/submit">
                {locale === "zh" ? "返回投稿" : "Return to submit"}
              </LocaleLink>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a href="#template-chooser">
                {copy.chooserTitle}
              </a>
            </Button>
          </div>
        </div>

        <div className="paper-panel p-8">
          <p className="font-sans text-[11px] uppercase tracking-[0.28em] text-muted-foreground">
            {locale === "zh" ? "F.U.C.K Journal 模板包" : "F.U.C.K Journal template pack"}
          </p>
          <div className="mt-5 border-y border-border/70 py-6">
            <p className="font-display text-4xl leading-tight">
              F.U.C.K
              <span className="mt-2 block text-[0.78em] font-serif italic text-muted-foreground">
                Journal
              </span>
            </p>
          </div>
          <p className="mt-5 font-serif text-lg leading-relaxed text-muted-foreground">
            {copy.chooserBody}
          </p>
        </div>
      </section>

      <section id="template-chooser" className="mt-14 space-y-6">
        <div className="max-w-3xl">
          <p className="section-kicker">{copy.chooserTitle}</p>
          <h2 className="mt-3 font-display text-4xl sm:text-5xl">{copy.chooserTitle}</h2>
          <p className="mt-4 font-serif text-lg leading-relaxed text-muted-foreground">
            {copy.chooserBody}
          </p>
        </div>
        <TemplateDownloadGrid locale={locale} downloadLabel={copy.downloadLabel} />
      </section>

      <section className="mt-14 grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <Card className="border-border/80 bg-card/90">
          <CardHeader className="space-y-4">
            <CardTitle>{copy.editorialSpecTitle}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {copy.editorialSpecs.map((item) => (
                <li key={item} className="font-serif text-lg leading-relaxed text-muted-foreground">
                  {item}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="border-border/80 bg-card/90">
          <CardHeader className="space-y-4">
            <CardTitle>{copy.writingGuideTitle}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {copy.writingGuide.map((item) => (
                <li key={item} className="font-serif text-lg leading-relaxed text-muted-foreground">
                  {item}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="border-border/80 bg-card/90">
          <CardHeader className="space-y-4">
            <CardTitle>{copy.checklistTitle}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {copy.checklist.map((item) => (
                <li key={item} className="font-serif text-lg leading-relaxed text-muted-foreground">
                  {item}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card className="border-border/80 bg-card/90">
          <CardHeader className="space-y-4">
            <CardTitle>{copy.structureTitle}</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-4">
              {copy.structureSections.map((item, index) => (
                <li
                  key={item}
                  className="font-serif text-lg leading-relaxed text-muted-foreground"
                >
                  {index + 1}. {item}
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      </section>

      <section className="mt-14">
        <Card className="border-border/80 bg-card/90">
          <CardHeader className="space-y-4">
            <CardTitle>{copy.comparisonTitle}</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-5 md:grid-cols-2">
            {copy.comparisonCards.map((item) => (
              <div key={item.title} className="rounded-[24px] border border-border/70 bg-background/50 px-5 py-5">
                <p className="font-display text-2xl">{item.title}</p>
                <p className="mt-3 font-serif text-lg leading-relaxed text-muted-foreground">
                  {item.body}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
