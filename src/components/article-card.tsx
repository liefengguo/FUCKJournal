import { ArrowUpRight } from "lucide-react";

import { LocaleLink } from "@/components/locale-link";
import type { Locale } from "@/i18n/routing";
import {
  formatArticleIssue,
  getArticleByline,
  type ArticleSummary,
} from "@/lib/articles";
import { formatDate } from "@/lib/site";
import { cn } from "@/lib/utils";

type ArticleCardProps = {
  article: ArticleSummary;
  locale: Locale;
  variant?: "grid" | "list";
};

export function ArticleCard({
  article,
  locale,
  variant = "grid",
}: ArticleCardProps) {
  const issueLine = formatArticleIssue(article.issue, locale);
  const byline = getArticleByline(article, locale);
  const articleType = article.articleType || (locale === "zh" ? "研究论文" : "Research article");

  return (
    <LocaleLink locale={locale} href={`/articles/${article.slug}`} className="group block">
      <article
        className={cn(
          "h-full rounded-[30px] border border-border/80 bg-card/80 p-6 shadow-editorial transition-transform duration-300 hover:-translate-y-1 sm:p-7",
          variant === "list" &&
            "rounded-none border-x-0 border-t-0 bg-transparent px-0 py-0 shadow-none",
        )}
      >
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 font-sans text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
          <span>{articleType}</span>
          <span>{issueLine}</span>
          {article.availableLocales.length > 1 ? (
            <span>{locale === "zh" ? "中英双语" : "Bilingual edition"}</span>
          ) : null}
        </div>

        <h3
          className={cn(
            "mt-5 max-w-3xl font-display leading-tight transition-colors group-hover:text-journal-red dark:group-hover:text-journal-gold",
            variant === "list" ? "text-[2.1rem] sm:text-[2.6rem]" : "text-[1.95rem] sm:text-[2.25rem]",
          )}
        >
          {article.title}
        </h3>

        {article.subtitle ? (
          <p className="mt-4 max-w-3xl font-serif text-[1.05rem] leading-8 text-foreground/76">
            {article.subtitle}
          </p>
        ) : null}

        <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 font-serif text-[1.02rem] leading-relaxed text-foreground/82">
          <span>{byline}</span>
          <span>{formatDate(article.date, locale)}</span>
          <span>{article.readTime}</span>
        </div>

        <p
          className={cn(
            "mt-5 max-w-3xl font-serif leading-8 text-muted-foreground",
            variant === "list" ? "text-[1.05rem]" : "text-[1rem]",
          )}
        >
          {article.summary}
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2">
          <div className="inline-flex items-center gap-2 font-sans text-[11px] uppercase tracking-[0.24em] text-foreground">
            <span>{locale === "zh" ? "进入论文页" : "Open paper"}</span>
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
          {article.tags.length ? (
            <p className="font-sans text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
              {article.tags.join(" / ")}
            </p>
          ) : null}
        </div>
      </article>
    </LocaleLink>
  );
}
