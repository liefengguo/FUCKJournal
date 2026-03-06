import { getTranslations } from "next-intl/server";

import type { Locale } from "@/i18n/routing";
import { LocaleLink } from "@/components/locale-link";
import { Separator } from "@/components/ui/separator";
import { Wordmark } from "@/components/wordmark";
import { getCopy } from "@/lib/copy";
import { navigation, siteConfig } from "@/lib/site";

type FooterProps = {
  locale: Locale;
};

export async function Footer({ locale }: FooterProps) {
  const tNav = await getTranslations("Navigation");
  const copy = getCopy(locale);

  return (
    <footer className="border-t border-border/70 bg-card/70">
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-12">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-4">
            <Wordmark locale={locale} size="footer" showSubtitle />
            <p className="max-w-xl font-serif text-lg leading-relaxed text-muted-foreground">
              {copy.footer.blurb}
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href={siteConfig.social.github}
                target="_blank"
                rel="noreferrer"
                className="font-sans text-xs uppercase tracking-[0.24em] text-muted-foreground transition-colors hover:text-foreground"
              >
                GitHub
              </a>
              <a
                href={siteConfig.social.x}
                target="_blank"
                rel="noreferrer"
                className="font-sans text-xs uppercase tracking-[0.24em] text-muted-foreground transition-colors hover:text-foreground"
              >
                X
              </a>
              <a
                href={siteConfig.social.instagram}
                target="_blank"
                rel="noreferrer"
                className="font-sans text-xs uppercase tracking-[0.24em] text-muted-foreground transition-colors hover:text-foreground"
              >
                Instagram
              </a>
            </div>
          </div>
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-3">
              <p className="font-sans text-xs uppercase tracking-[0.3em] text-muted-foreground">
                {copy.footer.sitemapLabel}
              </p>
              <div className="flex flex-col gap-3">
                {navigation.map((item) => (
                  <LocaleLink
                    key={item.href}
                    locale={locale}
                    href={item.href}
                    className="font-display text-xl transition-colors hover:text-journal-red dark:hover:text-journal-gold"
                  >
                    {tNav(item.key)}
                  </LocaleLink>
                ))}
                <LocaleLink
                  locale={locale}
                  href="/contact"
                  className="font-display text-xl transition-colors hover:text-journal-red dark:hover:text-journal-gold"
                >
                  {tNav("contact")}
                </LocaleLink>
              </div>
            </div>
            <div className="space-y-3">
              <p className="font-sans text-xs uppercase tracking-[0.3em] text-muted-foreground">
                {copy.footer.contactLabel}
              </p>
              <a
                href={`mailto:${siteConfig.email}`}
                className="block font-serif text-lg text-muted-foreground transition-colors hover:text-foreground"
              >
                {siteConfig.email}
              </a>
              <p className="font-serif text-base leading-relaxed text-muted-foreground">
                {copy.footer.blurb}
              </p>
            </div>
          </div>
        </div>
        <Separator className="my-8" />
        <div className="flex flex-col gap-3 font-sans text-xs uppercase tracking-[0.24em] text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 {siteConfig.name}</p>
          <p>{copy.footer.buildNote}</p>
        </div>
      </div>
    </footer>
  );
}
