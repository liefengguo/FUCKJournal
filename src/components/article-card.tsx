import { ArrowUpRight } from "lucide-react";

import type { Locale } from "@/i18n/routing";
import type { ArticleSummary } from "@/lib/articles";
import { LocaleLink } from "@/components/locale-link";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  const bilingualLabel = locale === "zh" ? "双语" : "Bilingual";

  return (
    <LocaleLink locale={locale} href={`/articles/${article.slug}`} className="group block">
      <Card
        className={cn(
          "h-full transition-transform duration-300 hover:-translate-y-1",
          variant === "list" && "rounded-none border-x-0 border-t-0 bg-transparent p-0 shadow-none",
        )}
      >
        <CardHeader className={cn(variant === "list" && "px-0 pt-0")}>
          <div className="flex flex-wrap items-center gap-2">
            {article.tags.map((tag) => (
              <Badge key={tag} variant="neutral">
                {tag}
              </Badge>
            ))}
            {article.availableLocales.length > 1 ? (
              <Badge>{bilingualLabel}</Badge>
            ) : null}
          </div>
          <CardTitle
            className={cn(
              "max-w-2xl transition-colors group-hover:text-journal-red dark:group-hover:text-journal-gold",
              variant === "list" ? "text-3xl sm:text-4xl" : "text-2xl sm:text-3xl",
            )}
          >
            {article.title}
          </CardTitle>
          <div className="flex flex-wrap gap-x-4 gap-y-1 font-sans text-xs uppercase tracking-[0.22em] text-muted-foreground">
            <span>{article.author}</span>
            <span>{formatDate(article.date, locale)}</span>
            <span>{article.readTime}</span>
          </div>
        </CardHeader>
        <CardContent className={cn("space-y-4", variant === "list" && "px-0 pb-8")}>
          <p className="max-w-xl font-serif text-lg leading-relaxed text-muted-foreground">
            {article.summary}
          </p>
          <div className="inline-flex items-center gap-2 font-sans text-xs uppercase tracking-[0.24em] text-foreground">
            <span>{locale === "zh" ? "阅读全文" : "Read essay"}</span>
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
        </CardContent>
      </Card>
    </LocaleLink>
  );
}
