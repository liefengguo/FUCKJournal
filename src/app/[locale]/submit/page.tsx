import type { Metadata } from "next";
import { unstable_noStore as noStore } from "next/cache";

import { setRequestLocale } from "next-intl/server";

import { SubmissionForm } from "@/components/submission-form";
import { LocaleLink } from "@/components/locale-link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Locale } from "@/i18n/routing";
import { getCopy } from "@/lib/copy";
import { createPageMetadata } from "@/lib/metadata";
import { getSubmissionUiCopy } from "@/lib/submission-ui-copy";

type SubmitPageProps = {
  params: {
    locale: Locale;
  };
};

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: SubmitPageProps): Promise<Metadata> {
  const copy = getCopy(params.locale);

  return createPageMetadata({
    locale: params.locale,
    title: copy.submit.title,
    description: copy.submit.intro,
    pathname: `/${params.locale}/submit`,
  });
}

export default function SubmitPage({ params }: SubmitPageProps) {
  const { locale } = params;

  noStore();
  setRequestLocale(locale);
  const copy = getCopy(locale);
  const uiCopy = getSubmissionUiCopy(locale);

  return (
    <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-12">
      <div className="max-w-3xl">
        <p className="section-kicker">{locale === "zh" ? "投稿" : "Submit"}</p>
        <h1 className="mt-4 font-display text-5xl sm:text-6xl">
          {copy.submit.title}
        </h1>
        <p className="mt-6 font-serif text-xl leading-relaxed text-muted-foreground">
          {copy.submit.intro}
        </p>
      </div>
      <div className="mt-12 grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="space-y-6">
          <Card>
            <CardContent className="space-y-5 p-8">
              <h2 className="font-display text-3xl">
                {locale === "zh" ? "投稿指南" : "Submission guidelines"}
              </h2>
              <ul className="space-y-4">
                {copy.submit.guidelines.map((guideline) => (
                  <li
                    key={guideline}
                    className="font-serif text-lg leading-relaxed text-muted-foreground"
                  >
                    {guideline}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="space-y-5 p-8">
              <h2 className="font-display text-3xl">
                {locale === "zh" ? "议题分类" : "Topic categories"}
              </h2>
              <div className="flex flex-wrap gap-3">
                {copy.submit.categories.map((category) => (
                  <Badge key={category} variant="neutral">
                    {category}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="space-y-5 p-8">
              <h2 className="font-display text-3xl">
                {uiCopy.submitTemplatesCtaLabel}
              </h2>
              <p className="font-serif text-lg leading-relaxed text-muted-foreground">
                {uiCopy.submitTemplatesCtaBody}
              </p>
              <Button asChild size="sm">
                <LocaleLink locale={locale} href="/templates">
                  {uiCopy.submitTemplatesCtaLabel}
                </LocaleLink>
              </Button>
            </CardContent>
          </Card>
        </div>
        <SubmissionForm locale={locale} />
      </div>
    </div>
  );
}
