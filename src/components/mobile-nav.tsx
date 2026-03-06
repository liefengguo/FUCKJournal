"use client";

import { Menu } from "lucide-react";
import { useState } from "react";

import type { Locale } from "@/i18n/routing";
import { LocaleLink } from "@/components/locale-link";
import { LanguageSwitcher } from "@/components/language-switcher";
import { Wordmark } from "@/components/wordmark";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { getBrandSubtitle } from "@/lib/site";

type MobileNavProps = {
  locale: Locale;
  items: Array<{ label: string; href: string }>;
};

export function MobileNav({ locale, items }: MobileNavProps) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-full md:hidden">
          <Menu className="h-5 w-5" />
          <span className="sr-only">Open navigation</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="md:hidden">
        <SheetHeader className="max-w-xs">
          <SheetTitle className="sr-only">F.U.C.K Journal</SheetTitle>
          <SheetDescription className="sr-only">
            {getBrandSubtitle(locale)}
          </SheetDescription>
          <Wordmark locale={locale} size="mobile" showSubtitle />
        </SheetHeader>
        <div className="mt-10 flex flex-col gap-2">
          {items.map((item) => (
            <SheetClose asChild key={item.href}>
              <LocaleLink
                locale={locale}
                href={item.href}
                className="rounded-2xl px-4 py-3 font-display text-3xl transition-colors hover:bg-accent"
              >
                {item.label}
              </LocaleLink>
            </SheetClose>
          ))}
        </div>
        <div className="mt-auto pt-8">
          <LanguageSwitcher />
        </div>
      </SheetContent>
    </Sheet>
  );
}
