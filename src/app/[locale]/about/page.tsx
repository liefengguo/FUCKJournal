import type { Metadata } from "next";

import { setRequestLocale } from "next-intl/server";

import { Card, CardContent } from "@/components/ui/card";
import type { Locale } from "@/i18n/routing";
import { getCopy } from "@/lib/copy";
import { createPageMetadata } from "@/lib/metadata";

type AboutPageProps = {
  params: {
    locale: Locale;
  };
};

export async function generateMetadata({
  params,
}: AboutPageProps): Promise<Metadata> {
  const copy = getCopy(params.locale);

  return createPageMetadata({
    locale: params.locale,
    title: copy.about.title,
    description: copy.about.intro,
    pathname: `/${params.locale}/about`,
  });
}

export default function AboutPage({ params }: AboutPageProps) {
  const { locale } = params;

  setRequestLocale(locale);
  const copy = getCopy(locale);

  return (
    <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-12">
      <div className="max-w-3xl">
        <p className="section-kicker">About</p>
        <h1 className="mt-4 font-display text-5xl sm:text-6xl">
          {copy.about.title}
        </h1>
        <p className="mt-6 font-serif text-xl leading-relaxed text-muted-foreground">
          {copy.about.intro}
        </p>
      </div>
      <div className="mt-12 grid gap-6 lg:grid-cols-3">
        {copy.about.principles.map((principle) => (
          <Card key={principle.title}>
            <CardContent className="space-y-4 p-8">
              <h2 className="font-display text-3xl">{principle.title}</h2>
              <p className="font-serif text-lg leading-relaxed text-muted-foreground">
                {principle.body}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
