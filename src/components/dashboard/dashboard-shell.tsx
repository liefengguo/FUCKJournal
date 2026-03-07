import type { ReactNode } from "react";

import type { Locale } from "@/i18n/routing";
import { LocaleLink } from "@/components/locale-link";
import { cn } from "@/lib/utils";

type DashboardShellProps = {
  locale: Locale;
  title: string;
  intro: string;
  navItems: Array<{
    href: string;
    label: string;
    active?: boolean;
  }>;
  action?: ReactNode;
  children: ReactNode;
};

export function DashboardShell({
  locale,
  title,
  intro,
  navItems,
  action,
  children,
}: DashboardShellProps) {
  return (
    <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-12">
      <div className="flex flex-col gap-6 border-b border-border/60 pb-8 md:flex-row md:items-end md:justify-between">
        <div className="max-w-3xl">
          <h1 className="font-display text-4xl sm:text-5xl">{title}</h1>
          <p className="mt-4 font-serif text-lg leading-relaxed text-muted-foreground">
            {intro}
          </p>
        </div>
        {action ? <div className="flex items-center gap-3">{action}</div> : null}
      </div>
      <nav className="flex flex-wrap gap-3 py-6">
        {navItems.map((item) => (
          <LocaleLink
            key={item.href}
            locale={locale}
            href={item.href}
            className={cn(
              "rounded-full border px-4 py-2 font-sans text-xs uppercase tracking-[0.2em] transition-colors",
              item.active
                ? "border-journal-red/30 bg-journal-red/10 text-foreground"
                : "border-border bg-background/70 text-muted-foreground hover:text-foreground",
            )}
          >
            {item.label}
          </LocaleLink>
        ))}
      </nav>
      <div className="space-y-8">{children}</div>
    </div>
  );
}
