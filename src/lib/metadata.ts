import type { Metadata } from "next";

import type { Locale } from "@/i18n/routing";
import { getAbsoluteUrl, replaceLocaleInPath, siteConfig } from "@/lib/site";

type MetadataOptions = {
  locale: Locale;
  title: string;
  description: string;
  pathname: string;
  type?: "website" | "article";
  tags?: string[];
  publishedTime?: string;
};

export function createPageMetadata({
  locale,
  title,
  description,
  pathname,
  type = "website",
  tags,
  publishedTime,
}: MetadataOptions): Metadata {
  const absoluteUrl = getAbsoluteUrl(pathname);
  const imageUrl = getAbsoluteUrl("/opengraph-image");

  return {
    metadataBase: new URL(siteConfig.url),
    title,
    description,
    alternates: {
      canonical: absoluteUrl,
      languages: {
        en: getAbsoluteUrl(replaceLocaleInPath(pathname, "en")),
        zh: getAbsoluteUrl(replaceLocaleInPath(pathname, "zh")),
      },
    },
    openGraph: {
      type,
      url: absoluteUrl,
      title,
      description,
      siteName: siteConfig.name,
      locale: locale === "zh" ? "zh_CN" : "en_US",
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: siteConfig.name,
        },
      ],
      ...(publishedTime ? { publishedTime } : {}),
      ...(tags ? { tags } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
    },
  };
}
