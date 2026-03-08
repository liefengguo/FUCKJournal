import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Locale } from "@/i18n/routing";
import { getTemplatePackages } from "@/lib/template-packages";

type TemplateDownloadGridProps = {
  locale: Locale;
  compact?: boolean;
  downloadLabel: string;
};

export function TemplateDownloadGrid({
  locale,
  compact = false,
  downloadLabel,
}: TemplateDownloadGridProps) {
  const packages = getTemplatePackages(locale);

  return (
    <div
      className={
        compact
          ? "grid gap-4 sm:grid-cols-2"
          : "grid gap-5 md:grid-cols-2 xl:grid-cols-4"
      }
    >
      {packages.map((item) => (
        <Card
          key={item.id}
          className={
            compact ? "border-border/70 bg-card/85" : "border-border/80 bg-card/90"
          }
        >
          <CardHeader className={compact ? "space-y-3 p-6" : "space-y-4 p-7"}>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full border border-border/70 px-3 py-1 font-sans text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                {item.format}
              </span>
              <span className="rounded-full border border-border/70 px-3 py-1 font-sans text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                {item.language}
              </span>
              <span className="rounded-full border border-journal-red/20 bg-journal-red/5 px-3 py-1 font-sans text-[11px] uppercase tracking-[0.22em] text-journal-red dark:border-journal-gold/20 dark:bg-journal-gold/10 dark:text-journal-gold">
                {item.fileLabel}
              </span>
            </div>
            <CardTitle className={compact ? "text-2xl" : "text-[1.8rem]"}>
              {item.title}
            </CardTitle>
          </CardHeader>
          <CardContent className={compact ? "space-y-5 p-6 pt-0" : "space-y-5 p-7 pt-0"}>
            <p className="font-serif text-lg leading-relaxed text-muted-foreground">
              {item.description}
            </p>
            <p className="font-serif text-base leading-relaxed text-foreground/80">
              {item.note}
            </p>
            <Button asChild size={compact ? "sm" : "lg"} className="w-full">
              <a href={item.href} download>
                {downloadLabel}
              </a>
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
