import type { Metadata } from "next";

import { setRequestLocale } from "next-intl/server";

import { Card, CardContent } from "@/components/ui/card";
import type { Locale } from "@/i18n/routing";
import { getCopy } from "@/lib/copy";
import { createPageMetadata } from "@/lib/metadata";

type GovernancePageProps = {
  params: {
    locale: Locale;
  };
};

export async function generateMetadata({
  params,
}: GovernancePageProps): Promise<Metadata> {
  const copy = getCopy(params.locale);

  return createPageMetadata({
    locale: params.locale,
    title: copy.governance.title,
    description: copy.governance.intro,
    pathname: `/${params.locale}/governance`,
  });
}

export default function GovernancePage({ params }: GovernancePageProps) {
  const { locale } = params;

  setRequestLocale(locale);
  const copy = getCopy(locale).governance;

  return (
    <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-12">
      <div className="max-w-4xl">
        <p className="section-kicker">{locale === "zh" ? "治理" : "Governance"}</p>
        <h1 className="mt-4 font-display text-5xl sm:text-6xl">{copy.title}</h1>
        <p className="mt-6 font-serif text-xl leading-relaxed text-muted-foreground">
          {copy.intro}
        </p>
      </div>

      <section className="mt-14 paper-panel px-6 py-8 sm:px-10">
        <p className="section-kicker">{copy.manifestoTitle}</p>
        <h2 className="mt-3 font-display text-4xl sm:text-5xl">{copy.manifestoTitle}</h2>
        <p className="mt-5 max-w-5xl font-serif text-2xl leading-relaxed text-foreground/90">
          {copy.manifestoBody}
        </p>
      </section>

      <section className="mt-14">
        <div className="max-w-4xl">
          <p className="section-kicker">{copy.commitmentsTitle}</p>
          <h2 className="mt-3 font-display text-4xl sm:text-5xl">{copy.commitmentsTitle}</h2>
          <p className="mt-4 font-serif text-lg leading-relaxed text-muted-foreground">
            {copy.commitmentsIntro}
          </p>
        </div>
        <div className="mt-8 grid gap-6 lg:grid-cols-3">
          {copy.commitments.map((commitment) => (
            <Card key={commitment.title} className="border-border/80 bg-card/90">
              <CardContent className="space-y-4 p-8">
                <h3 className="font-display text-3xl">{commitment.title}</h3>
                <p className="font-serif text-lg leading-relaxed text-muted-foreground">
                  {commitment.body}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mt-14">
        <div className="max-w-4xl">
          <p className="section-kicker">{copy.permissionsTitle}</p>
          <h2 className="mt-3 font-display text-4xl sm:text-5xl">{copy.permissionsTitle}</h2>
          <p className="mt-4 font-serif text-lg leading-relaxed text-muted-foreground">
            {copy.permissionsIntro}
          </p>
        </div>
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {copy.permissions.map((section) => (
            <Card key={section.title} className="border-border/80 bg-card/90">
              <CardContent className="space-y-5 p-8">
                <h3 className="font-display text-3xl">{section.title}</h3>
                <p className="font-serif text-lg leading-relaxed text-muted-foreground">
                  {section.body}
                </p>
                <ul className="space-y-3">
                  {section.bullets.map((bullet) => (
                    <li key={bullet} className="font-serif text-lg leading-relaxed text-muted-foreground">
                      {bullet}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mt-14 grid gap-6 lg:grid-cols-2">
        <Card className="border-border/80 bg-card/90">
          <CardContent className="space-y-4 p-8">
            <p className="section-kicker">{copy.changelogTitle}</p>
            <h2 className="font-display text-4xl">{copy.changelogTitle}</h2>
            <p className="font-serif text-lg leading-relaxed text-muted-foreground">
              {copy.changelogBody}
            </p>
          </CardContent>
        </Card>
        <Card className="border-border/80 bg-card/90">
          <CardContent className="space-y-4 p-8">
            <p className="section-kicker">{copy.rulesTitle}</p>
            <h2 className="font-display text-4xl">{copy.rulesTitle}</h2>
            <p className="font-serif text-lg leading-relaxed text-muted-foreground">
              {copy.rulesBody}
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
