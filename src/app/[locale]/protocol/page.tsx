import type { Metadata } from "next";

import { setRequestLocale } from "next-intl/server";

import { Card, CardContent } from "@/components/ui/card";
import type { Locale } from "@/i18n/routing";
import { getCopy } from "@/lib/copy";
import { createPageMetadata } from "@/lib/metadata";

type ProtocolPageProps = {
  params: {
    locale: Locale;
  };
};

export async function generateMetadata({
  params,
}: ProtocolPageProps): Promise<Metadata> {
  const copy = getCopy(params.locale);

  return createPageMetadata({
    locale: params.locale,
    title: copy.protocol.title,
    description: copy.protocol.intro,
    pathname: `/${params.locale}/protocol`,
  });
}

export default function ProtocolPage({ params }: ProtocolPageProps) {
  const { locale } = params;

  setRequestLocale(locale);
  const copy = getCopy(locale).protocol;

  return (
    <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-12">
      <div className="max-w-4xl">
        <p className="section-kicker">{locale === "zh" ? "规程" : "Protocol"}</p>
        <h1 className="mt-4 font-display text-5xl sm:text-6xl">{copy.title}</h1>
        <p className="mt-6 font-serif text-xl leading-relaxed text-muted-foreground">
          {copy.intro}
        </p>
      </div>

      <section className="mt-14">
        <div className="max-w-4xl">
          <p className="section-kicker">{copy.roleTitle}</p>
          <h2 className="mt-3 font-display text-4xl sm:text-5xl">{copy.roleTitle}</h2>
          <p className="mt-4 font-serif text-lg leading-relaxed text-muted-foreground">
            {copy.roleIntro}
          </p>
        </div>
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {copy.roles.map((role) => (
            <Card key={role.title} className="border-border/80 bg-card/90">
              <CardContent className="space-y-5 p-8">
                <h3 className="font-display text-3xl">{role.title}</h3>
                <p className="font-serif text-lg leading-relaxed text-muted-foreground">
                  {role.body}
                </p>
                <ul className="space-y-3">
                  {role.bullets.map((bullet) => (
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

      <section className="mt-14">
        <div className="max-w-4xl">
          <p className="section-kicker">{copy.flowTitle}</p>
          <h2 className="mt-3 font-display text-4xl sm:text-5xl">{copy.flowTitle}</h2>
          <p className="mt-4 font-serif text-lg leading-relaxed text-muted-foreground">
            {copy.flowIntro}
          </p>
        </div>
        <div className="mt-8 grid gap-5 lg:grid-cols-5">
          {copy.flowStages.map((stage) => (
            <Card key={stage.title} className="border-border/70 bg-background/70">
              <CardContent className="space-y-4 p-6">
                <h3 className="font-display text-2xl leading-tight">{stage.title}</h3>
                <p className="font-serif text-lg leading-relaxed text-muted-foreground">
                  {stage.body}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="mt-14 grid gap-8 xl:grid-cols-[1.05fr_0.95fr]">
        <div>
          <p className="section-kicker">{copy.decisionTitle}</p>
          <h2 className="mt-3 font-display text-4xl sm:text-5xl">{copy.decisionTitle}</h2>
          <p className="mt-4 font-serif text-lg leading-relaxed text-muted-foreground">
            {copy.decisionIntro}
          </p>
          <div className="mt-8 space-y-5">
            {copy.decisionStages.map((stage) => (
              <Card key={stage.title} className="border-border/80 bg-card/90">
                <CardContent className="space-y-4 p-8">
                  <h3 className="font-display text-3xl">{stage.title}</h3>
                  <p className="font-serif text-lg leading-relaxed text-muted-foreground">
                    {stage.body}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div>
          <p className="section-kicker">{copy.safeguardTitle}</p>
          <h2 className="mt-3 font-display text-4xl sm:text-5xl">{copy.safeguardTitle}</h2>
          <p className="mt-4 font-serif text-lg leading-relaxed text-muted-foreground">
            {copy.safeguardIntro}
          </p>
          <div className="mt-8 space-y-5">
            {copy.safeguards.map((item) => (
              <Card key={item.title} className="border-border/80 bg-card/90">
                <CardContent className="space-y-4 p-8">
                  <h3 className="font-display text-3xl">{item.title}</h3>
                  <p className="font-serif text-lg leading-relaxed text-muted-foreground">
                    {item.body}
                  </p>
                  {item.bullets?.length ? (
                    <ul className="space-y-3">
                      {item.bullets.map((bullet) => (
                        <li
                          key={bullet}
                          className="font-serif text-lg leading-relaxed text-muted-foreground"
                        >
                          {bullet}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-14">
        <div className="max-w-4xl">
          <p className="section-kicker">{copy.judgmentTitle}</p>
          <h2 className="mt-3 font-display text-4xl sm:text-5xl">{copy.judgmentTitle}</h2>
          <p className="mt-4 font-serif text-lg leading-relaxed text-muted-foreground">
            {copy.judgmentIntro}
          </p>
        </div>
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {copy.judgmentCards.map((card) => (
            <Card key={card.title} className="border-border/80 bg-card/90">
              <CardContent className="space-y-5 p-8">
                <h3 className="font-display text-3xl">{card.title}</h3>
                <p className="font-serif text-lg leading-relaxed text-muted-foreground">
                  {card.body}
                </p>
                <ul className="space-y-3">
                  {card.bullets.map((bullet) => (
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
    </div>
  );
}
