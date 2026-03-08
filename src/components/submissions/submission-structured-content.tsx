import type { Locale } from "@/i18n/routing";
import { getPlatformCopy } from "@/lib/platform-copy";
import { getSubmissionUiCopy } from "@/lib/submission-ui-copy";

type SubmissionStructuredContentProps = {
  locale: Locale;
  title?: string | null;
  byline?: string | null;
  manuscriptId?: string | null;
  language?: string | null;
  abstract: string | null;
  keywords: string[];
  coverLetter: string | null;
  introduction: string | null;
  mainContent: string | null;
  conclusion: string | null;
  references: string | null;
};

type SectionProps = {
  index?: string;
  label: string;
  value: string | null;
  emptyText: string;
  compact?: boolean;
};

function renderParagraphs(value: string | null, emptyText: string, compact = false) {
  if (!value) {
    return (
      <p className="font-serif text-lg italic leading-relaxed text-muted-foreground">
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
        className={
          compact
            ? "font-serif text-[1.02rem] leading-8 text-foreground/85"
            : "font-serif text-[1.06rem] leading-8 text-foreground/90"
        }
      >
        {paragraph}
      </p>
    ));
}

function StructuredSection({
  index,
  label,
  value,
  emptyText,
  compact = false,
}: SectionProps) {
  return (
    <section className="border-t border-border/60 pt-6">
      <div className="flex items-baseline gap-3">
        {index ? (
          <span className="font-sans text-[11px] uppercase tracking-[0.28em] text-journal-red dark:text-journal-gold">
            {index}
          </span>
        ) : null}
        <h3 className="font-display text-2xl leading-tight">{label}</h3>
      </div>
      <div className="mt-4 space-y-4">{renderParagraphs(value, emptyText, compact)}</div>
    </section>
  );
}

export function SubmissionStructuredContent({
  locale,
  title,
  byline,
  manuscriptId,
  language,
  abstract,
  keywords,
  coverLetter,
  introduction,
  mainContent,
  conclusion,
  references,
}: SubmissionStructuredContentProps) {
  const platformCopy = getPlatformCopy(locale).submission;
  const uiCopy = getSubmissionUiCopy(locale);
  const manuscriptTitle =
    title || (locale === "zh" ? "未命名稿件" : "Untitled manuscript");

  return (
    <div className="rounded-[32px] border border-border/80 bg-background/70 px-6 py-7 shadow-sm sm:px-8 sm:py-8 lg:px-10">
      <header className="border-b border-border/70 pb-7">
        <p className="font-sans text-[11px] uppercase tracking-[0.34em] text-muted-foreground">
          {locale === "zh" ? "F.U.C.K Journal 审稿稿件" : "F.U.C.K Journal review copy"}
        </p>
        <h2 className="mt-5 font-display text-4xl leading-tight sm:text-5xl">
          {manuscriptTitle}
        </h2>
        {byline ? (
          <p className="mt-5 font-serif text-xl leading-relaxed text-foreground/85">
            {byline}
          </p>
        ) : null}
        <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 font-sans text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
          {manuscriptId ? <span>{manuscriptId}</span> : null}
          <span>{language || (locale === "zh" ? "语言未注明" : "Language unspecified")}</span>
          <span>
            {locale === "zh"
              ? "结构化稿件视图"
              : "Structured manuscript view"}
          </span>
        </div>
      </header>

      <div className="mt-8 space-y-8">
        <section className="rounded-[24px] border border-border/60 bg-card/70 px-5 py-5 sm:px-6">
          <p className="font-sans text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
            {platformCopy.abstractLabel}
          </p>
          <div className="mt-4 space-y-4">
            {renderParagraphs(abstract, uiCopy.fields.noContent, true)}
          </div>
          <div className="mt-5 border-t border-border/60 pt-4">
            <p className="font-sans text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
              {uiCopy.fields.keywordsLabel}
            </p>
            {keywords.length ? (
              <p className="mt-3 font-serif text-[1.02rem] leading-8 text-foreground/85">
                {keywords.join("  •  ")}
              </p>
            ) : (
              <p className="mt-3 font-serif text-lg italic leading-relaxed text-muted-foreground">
                {uiCopy.fields.noContent}
              </p>
            )}
          </div>
        </section>

        <StructuredSection
          index="01"
          label={uiCopy.fields.introductionLabel}
          value={introduction}
          emptyText={uiCopy.fields.noContent}
        />
        <StructuredSection
          index="02"
          label={uiCopy.fields.mainContentLabel}
          value={mainContent}
          emptyText={uiCopy.fields.noContent}
        />
        <StructuredSection
          index="03"
          label={uiCopy.fields.conclusionLabel}
          value={conclusion}
          emptyText={uiCopy.fields.noContent}
        />
        <StructuredSection
          index="04"
          label={uiCopy.fields.referencesLabel}
          value={references}
          emptyText={uiCopy.fields.noContent}
          compact
        />

        <section className="rounded-[24px] border border-border/60 bg-card/60 px-5 py-5 sm:px-6">
          <p className="font-sans text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
            {platformCopy.coverLetterLabel}
          </p>
          <div className="mt-4 space-y-4">
            {renderParagraphs(coverLetter, uiCopy.fields.noContent, true)}
          </div>
        </section>
      </div>
    </div>
  );
}
