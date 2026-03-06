import type { Metadata } from "next";

import { setRequestLocale } from "next-intl/server";

import { AuthorCard } from "@/components/author-card";
import { Card, CardContent } from "@/components/ui/card";
import type { Locale } from "@/i18n/routing";
import { getCopy } from "@/lib/copy";
import { getContributors } from "@/lib/contributors";
import { createPageMetadata } from "@/lib/metadata";

type CommunityPageProps = {
  params: {
    locale: Locale;
  };
};

export async function generateMetadata({
  params,
}: CommunityPageProps): Promise<Metadata> {
  const copy = getCopy(params.locale);

  return createPageMetadata({
    locale: params.locale,
    title: copy.community.title,
    description: copy.community.intro,
    pathname: `/${params.locale}/community`,
  });
}

export default function CommunityPage({ params }: CommunityPageProps) {
  const { locale } = params;

  setRequestLocale(locale);
  const copy = getCopy(locale);
  const contributors = getContributors(locale);

  return (
    <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-12">
      <div className="max-w-3xl">
        <p className="section-kicker">{locale === "zh" ? "社群" : "Community"}</p>
        <h1 className="mt-4 font-display text-5xl sm:text-6xl">
          {copy.community.title}
        </h1>
        <p className="mt-6 font-serif text-xl leading-relaxed text-muted-foreground">
          {copy.community.intro}
        </p>
      </div>
      <div className="mt-12 grid gap-6 lg:grid-cols-3">
        {copy.community.pillars.map((pillar) => (
          <Card key={pillar.title}>
            <CardContent className="space-y-4 p-8">
              <h2 className="font-display text-3xl">{pillar.title}</h2>
              <p className="font-serif text-lg leading-relaxed text-muted-foreground">
                {pillar.body}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="mt-16 grid gap-6 lg:grid-cols-3">
        {contributors.map((contributor) => (
          <AuthorCard key={contributor.name} contributor={contributor} />
        ))}
      </div>
    </div>
  );
}
