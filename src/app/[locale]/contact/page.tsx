import type { Metadata } from "next";

import { ArrowUpRight } from "lucide-react";
import { setRequestLocale } from "next-intl/server";

import { Card, CardContent } from "@/components/ui/card";
import type { Locale } from "@/i18n/routing";
import { getCopy } from "@/lib/copy";
import { createPageMetadata } from "@/lib/metadata";

type ContactPageProps = {
  params: {
    locale: Locale;
  };
};

export async function generateMetadata({
  params,
}: ContactPageProps): Promise<Metadata> {
  const copy = getCopy(params.locale);

  return createPageMetadata({
    locale: params.locale,
    title: copy.contact.title,
    description: copy.contact.intro,
    pathname: `/${params.locale}/contact`,
  });
}

export default function ContactPage({ params }: ContactPageProps) {
  const { locale } = params;

  setRequestLocale(locale);
  const copy = getCopy(locale);

  return (
    <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-12">
      <div className="max-w-3xl">
        <p className="section-kicker">{locale === "zh" ? "联系" : "Contact"}</p>
        <h1 className="mt-4 font-display text-5xl sm:text-6xl">
          {copy.contact.title}
        </h1>
        <p className="mt-6 font-serif text-xl leading-relaxed text-muted-foreground">
          {copy.contact.intro}
        </p>
      </div>
      <div className="mt-12 grid gap-6 lg:grid-cols-3">
        {copy.contact.cards.map((card) => (
          <a key={card.title} href={card.href} className="group block">
            <Card className="h-full transition-transform duration-300 group-hover:-translate-y-1">
              <CardContent className="flex h-full flex-col gap-5 p-8">
                <h2 className="font-display text-3xl">{card.title}</h2>
                <p className="font-serif text-lg leading-relaxed text-muted-foreground">
                  {card.body}
                </p>
                <div className="mt-auto inline-flex items-center gap-2 font-sans text-xs uppercase tracking-[0.22em] text-foreground">
                  <span>{card.action}</span>
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </CardContent>
            </Card>
          </a>
        ))}
      </div>
    </div>
  );
}
