import type { Locale } from "@/i18n/routing";
import { getBrandSubtitle } from "@/lib/site";
import { cn } from "@/lib/utils";

type WordmarkProps = {
  locale: Locale;
  size?: "header" | "hero" | "footer" | "mobile";
  showSubtitle?: boolean;
  className?: string;
};

const styles = {
  header: {
    wrap: "gap-0.5",
    mark: "font-display text-lg leading-none tracking-[0.3em] sm:text-xl",
    journal:
      "pl-[0.12em] font-serif text-lg leading-none tracking-[0.12em] text-muted-foreground sm:text-xl",
    subtitle:
      "hidden pt-1 font-sans text-[10px] uppercase tracking-[0.28em] text-muted-foreground xl:block",
  },
  hero: {
    wrap: "gap-2",
    mark: "font-display text-6xl leading-[0.88] tracking-[0.26em] sm:text-7xl lg:text-[6.6rem]",
    journal:
      "pl-[0.16em] font-serif text-5xl leading-none tracking-[0.08em] text-foreground/90 sm:text-6xl lg:text-[5.25rem]",
    subtitle:
      "pt-3 max-w-3xl font-serif text-2xl leading-relaxed text-muted-foreground sm:text-3xl",
  },
  footer: {
    wrap: "gap-1",
    mark: "font-display text-3xl leading-none tracking-[0.28em]",
    journal:
      "pl-[0.14em] font-serif text-3xl leading-none tracking-[0.08em] text-muted-foreground",
    subtitle:
      "pt-2 max-w-md font-sans text-[10px] uppercase tracking-[0.28em] text-muted-foreground",
  },
  mobile: {
    wrap: "gap-1",
    mark: "font-display text-3xl leading-none tracking-[0.3em]",
    journal:
      "pl-[0.14em] font-serif text-3xl leading-none tracking-[0.08em] text-muted-foreground",
    subtitle: "pt-2 font-sans text-xs uppercase tracking-[0.22em] text-muted-foreground",
  },
} as const;

export function Wordmark({
  locale,
  size = "header",
  showSubtitle = false,
  className,
}: WordmarkProps) {
  const style = styles[size];

  return (
    <div className={cn("inline-flex flex-col", style.wrap, className)}>
      <span className={style.mark}>F.U.C.K</span>
      <span className={style.journal}>Journal</span>
      {showSubtitle ? (
        <span className={style.subtitle}>{getBrandSubtitle(locale)}</span>
      ) : null}
    </div>
  );
}
