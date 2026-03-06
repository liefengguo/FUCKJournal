import type { Locale } from "@/i18n/routing";

export const siteConfig = {
  name: "FUCK Journal",
  shortName: "F.U.C.K",
  fullName: "Foundations of Understanding, Culture and Knowledge",
  description: "Research on the beautiful chaos of being human.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://fuck-journal.vercel.app",
  email: "editorial@fuckjournal.org",
  social: {
    x: "https://x.com",
    instagram: "https://instagram.com",
    github: "https://github.com/liefengguo/FUCKJournal",
  },
} as const;

export const navigation = [
  { key: "home", href: "/" },
  { key: "articles", href: "/articles" },
  { key: "manifesto", href: "/manifesto" },
  { key: "submit", href: "/submit" },
  { key: "community", href: "/community" },
  { key: "about", href: "/about" },
] as const;

export function getLocalizedHref(locale: Locale, href: string) {
  if (!href || href === "/") {
    return `/${locale}`;
  }

  return `/${locale}${href.startsWith("/") ? href : `/${href}`}`;
}

export function replaceLocaleInPath(pathname: string, locale: Locale) {
  const segments = pathname.split("/");

  if (segments.length > 1 && ["en", "zh"].includes(segments[1])) {
    segments[1] = locale;
    return segments.join("/") || `/${locale}`;
  }

  return getLocalizedHref(locale, pathname);
}

export function formatDate(date: string, locale: Locale) {
  return new Intl.DateTimeFormat(locale === "zh" ? "zh-CN" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}

export function getAbsoluteUrl(pathname = "/") {
  return new URL(pathname, siteConfig.url).toString();
}
