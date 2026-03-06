import type { Locale } from "@/i18n/routing";

export const siteConfig = {
  name: "F.U.C.K Journal",
  shortName: "F.U.C.K",
  fullName: "Foundations of Universality, Complexity and Knowledge",
  description:
    "F.U.C.K Journal is a bilingual interdisciplinary publication on universality, complexity, knowledge, systems, culture, uncertainty and human meaning.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://fuck-journal.vercel.app",
  email: "editorial@fuckjournal.org",
  social: {
    x: "https://x.com",
    instagram: "https://instagram.com",
    github: "https://github.com/liefengguo/FUCKJournal",
  },
} as const;

export const brandSubtitle: Record<Locale, string> = {
  en: "Foundations of Universality, Complexity and Knowledge",
  zh: "普遍性、复杂性与知识基础",
};

export const brandMeanings: Record<
  Locale,
  Array<{ letter: "F" | "U" | "C" | "K"; label: string }>
> = {
  en: [
    { letter: "F", label: "Foundations" },
    { letter: "U", label: "Universality" },
    { letter: "C", label: "Complexity" },
    { letter: "K", label: "Knowledge" },
  ],
  zh: [
    { letter: "F", label: "基础" },
    { letter: "U", label: "普遍性" },
    { letter: "C", label: "复杂性" },
    { letter: "K", label: "知识" },
  ],
};

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

export function getBrandSubtitle(locale: Locale) {
  return brandSubtitle[locale];
}

export function getBrandMeanings(locale: Locale) {
  return brandMeanings[locale];
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
