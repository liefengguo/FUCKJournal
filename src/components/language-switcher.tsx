"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";

import type { Locale } from "@/i18n/routing";
import { replaceLocaleInPath } from "@/lib/site";
import { cn } from "@/lib/utils";

const locales: Locale[] = ["en", "zh"];

export function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const pathname = usePathname();
  const t = useTranslations("LocaleSwitcher");

  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-border bg-background/80 p-1 backdrop-blur-sm">
      {locales.map((item) => {
        const targetPath = replaceLocaleInPath(pathname, item);

        return (
          <Link
            key={item}
            href={targetPath}
            aria-label={`${t("label")}: ${t(item)}`}
            className={cn(
              "rounded-full px-3 py-1.5 font-sans text-xs uppercase tracking-[0.22em] transition-colors",
              item === locale
                ? "bg-foreground text-background"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {t(item)}
          </Link>
        );
      })}
    </div>
  );
}
