import type { Locale } from "@/i18n/routing";
import { cn } from "@/lib/utils";

type SubmissionMetadataSummaryProps = {
  locale: Locale;
  abstract: string | null;
  keywords: string[];
  coverLetter?: string | null;
  details?: Array<{
    label: string;
    value: string | null | undefined;
  }>;
  className?: string;
  showCoverLetter?: boolean;
};

function renderParagraphs(value: string | null | undefined, emptyText: string) {
  if (!value?.trim()) {
    return (
      <p className="font-serif text-base italic leading-7 text-muted-foreground">
        {emptyText}
      </p>
    );
  }

  return value
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean)
    .map((paragraph, index) => (
      <p
        key={`${paragraph.slice(0, 32)}-${index}`}
        className="font-serif text-[1.02rem] leading-8 text-foreground/90"
      >
        {paragraph}
      </p>
    ));
}

export function SubmissionMetadataSummary({
  locale,
  abstract,
  keywords,
  coverLetter,
  details = [],
  className,
  showCoverLetter = true,
}: SubmissionMetadataSummaryProps) {
  const emptyText = locale === "zh" ? "尚未填写。" : "Not provided yet.";

  return (
    <div
      className={cn(
        "rounded-[28px] border border-border/70 bg-background/65 px-6 py-6 shadow-sm sm:px-7",
        className,
      )}
    >
      {details.length ? (
        <div className="grid gap-4 border-b border-border/60 pb-6 md:grid-cols-2">
          {details.map((detail) => (
            <div key={`${detail.label}-${detail.value ?? ""}`}>
              <p className="font-sans text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
                {detail.label}
              </p>
              <p className="mt-2 font-serif text-lg leading-relaxed">
                {detail.value?.trim() || emptyText}
              </p>
            </div>
          ))}
        </div>
      ) : null}

      <div className={cn("space-y-7", details.length ? "pt-6" : "")}>
        <section className="space-y-3">
          <p className="font-sans text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
            {locale === "zh" ? "摘要" : "Abstract"}
          </p>
          <div className="space-y-4">{renderParagraphs(abstract, emptyText)}</div>
        </section>

        <section className="space-y-3">
          <p className="font-sans text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
            {locale === "zh" ? "关键词" : "Keywords"}
          </p>
          {keywords.length ? (
            <p className="font-serif text-[1.02rem] leading-8 text-foreground/90">
              {keywords.join(locale === "zh" ? "，" : ", ")}
            </p>
          ) : (
            <p className="font-serif text-base italic leading-7 text-muted-foreground">
              {emptyText}
            </p>
          )}
        </section>

        {showCoverLetter ? (
          <section className="space-y-3 border-t border-border/60 pt-6">
            <p className="font-sans text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
              {locale === "zh" ? "附信" : "Cover letter"}
            </p>
            <div className="space-y-4">{renderParagraphs(coverLetter, emptyText)}</div>
          </section>
        ) : null}
      </div>
    </div>
  );
}
