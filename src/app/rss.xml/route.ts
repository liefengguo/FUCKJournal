import { routing } from "@/i18n/routing";
import { getAllArticles } from "@/lib/articles";
import { getAbsoluteUrl, siteConfig } from "@/lib/site";

export const dynamic = "force-static";

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function GET() {
  const items = routing.locales.flatMap((locale) =>
    getAllArticles(locale).map(
      (article) => `
        <item>
          <title>${escapeXml(article.title)}</title>
          <link>${getAbsoluteUrl(`/${locale}/articles/${article.slug}`)}</link>
          <guid>${getAbsoluteUrl(`/${locale}/articles/${article.slug}`)}</guid>
          <description>${escapeXml(article.summary)}</description>
          <pubDate>${new Date(article.date).toUTCString()}</pubDate>
        </item>`,
    ),
  );

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${siteConfig.name}</title>
    <link>${siteConfig.url}</link>
    <description>${escapeXml(siteConfig.description)}</description>
    ${items.join("\n")}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}
