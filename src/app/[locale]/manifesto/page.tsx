import type { Metadata } from "next";

import { setRequestLocale } from "next-intl/server";

import { LocaleLink } from "@/components/locale-link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Locale } from "@/i18n/routing";
import { getCopy } from "@/lib/copy";
import { createPageMetadata } from "@/lib/metadata";

type ManifestoPageProps = {
  params: {
    locale: Locale;
  };
};

export async function generateMetadata({
  params,
}: ManifestoPageProps): Promise<Metadata> {
  const copy = getCopy(params.locale);

  return createPageMetadata({
    locale: params.locale,
    title: copy.manifesto.title,
    description: copy.manifesto.intro,
    pathname: `/${params.locale}/manifesto`,
  });
}

export default function ManifestoPage({ params }: ManifestoPageProps) {
  const { locale } = params;

  setRequestLocale(locale);
  const copy = getCopy(locale);

  return (
    <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-12">
      <div className="max-w-4xl">
        <p className="section-kicker">{locale === "zh" ? "宣言" : "Manifesto"}</p>
        <h1 className="mt-4 font-display text-5xl sm:text-6xl">
          {copy.manifesto.title}
        </h1>
        <p className="mt-6 font-serif text-2xl leading-relaxed text-muted-foreground">
          {copy.manifesto.intro}
        </p>
      </div>
      <div className="mt-12 space-y-6">
        {copy.manifesto.sections.map((section) => (
          <Card key={section.title}>
            <CardContent className="space-y-5 p-8 sm:p-10">
              <h2 className="font-display text-4xl">{section.title}</h2>
              <p className="max-w-4xl font-serif text-xl leading-[1.95] text-muted-foreground">
                {section.body}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="mt-12 paper-panel px-6 py-8 sm:px-10">
        <p className="section-kicker">{locale === "zh" ? "接下来" : "Next"}</p>
        <h2 className="mt-3 font-display text-4xl">
          {locale === "zh"
            ? "把立场写进规程与治理"
            : "Put the position into protocol and governance"}
        </h2>
        <p className="mt-5 max-w-4xl font-serif text-xl leading-relaxed text-muted-foreground">
          {locale === "zh"
            ? "宣言只负责说明我们相信什么。真正重要的是把这些话落实为可读的流程、权限边界和可追溯记录。"
            : "A manifesto only states what we believe. The harder work is turning those claims into readable process, bounded permissions, and auditable records."}
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg">
            <LocaleLink locale={locale} href="/protocol">
              {locale === "zh" ? "阅读规程" : "Read protocol"}
            </LocaleLink>
          </Button>
          <Button asChild variant="outline" size="lg">
            <LocaleLink locale={locale} href="/governance">
              {locale === "zh" ? "阅读治理" : "Read governance"}
            </LocaleLink>
          </Button>
        </div>
      </div>
    </div>
  );
}
