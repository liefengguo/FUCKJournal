"use client";

import { useLocale, useTranslations } from "next-intl";

import type { Locale } from "@/i18n/routing";
import { LocaleLink } from "@/components/locale-link";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/site";

export default function NotFound() {
  const locale = useLocale() as Locale;
  const t = useTranslations("Common");

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-3xl flex-col items-start justify-center px-5 py-24 sm:px-8 lg:px-12">
      <p className="section-kicker">404</p>
      <h1 className="mt-4 font-display text-5xl">{t("notFoundTitle")}</h1>
      <p className="mt-5 max-w-xl font-serif text-xl leading-relaxed text-muted-foreground">
        {t("notFoundBody")}
      </p>
      <Button asChild className="mt-8">
        <LocaleLink locale={locale} href="/">
          {siteConfig.name}
        </LocaleLink>
      </Button>
    </div>
  );
}
