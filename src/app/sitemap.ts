import type { MetadataRoute } from "next";

import { getArticleSlugs, getArticleBySlug } from "@/lib/articles";
import { getAbsoluteUrl } from "@/lib/site";
import { listPublishedSubmissionSummaries } from "@/lib/submissions";
import { routing } from "@/i18n/routing";

export const dynamic = "force-dynamic";

const indexedRoutes = [
  "",
  "/articles",
  "/manifesto",
  "/protocol",
  "/governance",
  "/submit",
  "/templates",
  "/community",
  "/about",
  "/contact",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pageEntries = routing.locales.flatMap((locale) =>
    indexedRoutes.map((route) => ({
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

  const publicationEntries = (
    await Promise.all(
      routing.locales.map(async (locale) => {
        const publications = await listPublishedSubmissionSummaries(locale);
        return publications
          .filter((publication) => Boolean(publication.publicationSlug))
          .map((publication) => ({
            url: getAbsoluteUrl(`/${locale}/articles/${publication.publicationSlug}`),
            lastModified: publication.publishedAt ?? publication.updatedAt,
            changeFrequency: "monthly" as const,
            priority: 0.7,
          }));
      }),
    )
  ).flat();

  return [...pageEntries, ...articleEntries, ...publicationEntries];
}
