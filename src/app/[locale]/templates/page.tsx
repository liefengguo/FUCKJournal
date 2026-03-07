import type { Metadata } from "next";

import { setRequestLocale } from "next-intl/server";

import { LocaleLink } from "@/components/locale-link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Locale } from "@/i18n/routing";
import { createPageMetadata } from "@/lib/metadata";
import { getSubmissionUiCopy } from "@/lib/submission-ui-copy";

type TemplatesPageProps = {
  params: {
    locale: Locale;
  };
};

export async function generateMetadata({
  params,
}: TemplatesPageProps): Promise<Metadata> {
  const copy = getSubmissionUiCopy(params.locale).templates;

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

  const copy = getSubmissionUiCopy(locale).templates;

  return (
    <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-12">
      <div className="max-w-4xl">
        <p className="section-kicker">{locale === "zh" ? "模板" : "Templates"}</p>
        <h1 className="mt-4 font-display text-5xl sm:text-6xl">{copy.title}</h1>
        <p className="mt-6 font-serif text-xl leading-relaxed text-muted-foreground">
          {copy.intro}
        </p>
        <div className="mt-8">
          <Button asChild size="lg">
            <LocaleLink locale={locale} href="/submit">
              {locale === "zh" ? "返回投稿" : "Return to submit"}
            </LocaleLink>
          </Button>
        </div>
      </div>

      <div className="mt-12 grid gap-8 lg:grid-cols-[1fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>{copy.structureTitle}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {copy.structureItems.map((item) => (
                <li key={item} className="font-serif text-lg leading-relaxed text-muted-foreground">
                  {item}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{copy.guidelinesTitle}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {copy.guidelines.map((item) => (
                <li key={item} className="font-serif text-lg leading-relaxed text-muted-foreground">
                  {item}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{copy.checklistTitle}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {copy.checklist.map((item) => (
                <li key={item} className="font-serif text-lg leading-relaxed text-muted-foreground">
                  {item}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{copy.exampleTitle}</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="space-y-3">
              {copy.exampleSections.map((item, index) => (
                <li key={item} className="font-serif text-lg leading-relaxed text-muted-foreground">
                  {index + 1}. {item}
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>{copy.downloadsTitle}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {copy.downloads.map((item) => (
              <div key={item.title} className="rounded-[20px] border border-border/60 px-4 py-4">
                <p className="font-display text-2xl">{item.title}</p>
                <p className="mt-2 font-serif text-lg leading-relaxed text-muted-foreground">
                  {item.body}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{copy.comparisonTitle}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {copy.comparisonCards.map((item) => (
              <div key={item.title} className="rounded-[20px] border border-border/60 px-4 py-4">
                <p className="font-display text-2xl">{item.title}</p>
                <p className="mt-2 font-serif text-lg leading-relaxed text-muted-foreground">
                  {item.body}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
