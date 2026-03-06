import type { MetadataRoute } from "next";

import { getArticleSlugs, getArticleBySlug } from "@/lib/articles";
import { getAbsoluteUrl } from "@/lib/site";
import { routing } from "@/i18n/routing";

const staticRoutes = [
  "",
  "/articles",
  "/manifesto",
  "/submit",
  "/community",
  "/about",
  "/contact",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const pageEntries = routing.locales.flatMap((locale) =>
    staticRoutes.map((route) => ({
      url: getAbsoluteUrl(`/${locale}${route}`),
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: route === "" ? 1 : 0.8,
    })),
  );

  const articleEntries = routing.locales.flatMap((locale) =>
    getArticleSlugs()
      .map((slug) => getArticleBySlug(slug, locale))
      .filter((article): article is NonNullable<typeof article> => article !== null)
      .map((article) => ({
        url: getAbsoluteUrl(`/${locale}/articles/${article.slug}`),
        lastModified: new Date(article.date),
        changeFrequency: "monthly" as const,
        priority: 0.7,
      })),
  );

  return [...pageEntries, ...articleEntries];
}
