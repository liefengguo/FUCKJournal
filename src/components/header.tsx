import { getTranslations } from "next-intl/server";

import type { Locale } from "@/i18n/routing";
import { LocaleLink } from "@/components/locale-link";
import { LanguageSwitcher } from "@/components/language-switcher";
import { MobileNav } from "@/components/mobile-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { navigation } from "@/lib/site";

type HeaderProps = {
  locale: Locale;
};

export async function Header({ locale }: HeaderProps) {
  const tNav = await getTranslations("Navigation");
  const items = navigation.map((item) => ({
    ...item,
    label: tNav(item.key),
  }));

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-8 lg:px-12">
        <div className="flex min-w-0 flex-1 items-center">
          <LocaleLink locale={locale} href="/" className="group inline-flex flex-col">
            <span className="font-display text-xl leading-none tracking-[0.08em] sm:text-2xl">
              FUCK Journal
            </span>
            <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-muted-foreground transition-colors group-hover:text-foreground">
              Foundations of Understanding, Culture and Knowledge
            </span>
          </LocaleLink>
        </div>
        <nav className="hidden items-center justify-center gap-8 md:flex">
          {items.map((item) => (
            <LocaleLink
              key={item.href}
              locale={locale}
              href={item.href}
              className="font-sans text-sm uppercase tracking-[0.18em] text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </LocaleLink>
          ))}
        </nav>
        <div className="flex flex-1 items-center justify-end gap-2">
          <div className="hidden md:block">
            <LanguageSwitcher />
          </div>
          <ThemeToggle />
          <MobileNav locale={locale} items={items} />
        </div>
      </div>
    </header>
  );
}
