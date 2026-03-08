import type { Locale } from "@/i18n/routing";
import {
  getPublicationExcerpt,
  getPublicationLocale,
  getPublicationTags,
  getPublicationTitle,
  type PublicationExportSource,
} from "@/lib/publication-export";
import { formatDate, getBrandSubtitle } from "@/lib/site";
import { getSubmissionUiCopy } from "@/lib/submission-ui-copy";

type PublicationProofProps = {
  locale: Locale;
  source: PublicationExportSource;
};

type ProofSectionProps = {
  label: string;
  value: string | null;
  emptyText: string;
  compact?: boolean;
};

function renderParagraphs(
  value: string | null,
  emptyText: string,
  compact = false,
) {
  if (!value?.trim()) {
    return (
      <p className="font-serif text-[1.02rem] italic leading-8 text-muted-foreground">
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
        key={`${paragraph.slice(0, 40)}-${index}`}
        className={
          compact
            ? "font-serif text-[1.02rem] leading-8 text-foreground/88"
            : "font-serif text-[1.08rem] leading-9 text-foreground/92"
        }
      >
        {paragraph}
      </p>
    ));
}

function ProofSection({
  label,
  value,
  emptyText,
  compact = false,
}: ProofSectionProps) {
  return (
    <section className="publication-proof-section">
      <header className="flex items-baseline justify-between gap-4 border-b border-border/60 pb-3">
        <h2 className="font-display text-[1.85rem] leading-tight">{label}</h2>
        <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          F.U.C.K Journal
        </span>
      </header>
      <div className="mt-5 space-y-4">
        {renderParagraphs(value, emptyText, compact)}
      </div>
    </section>
  );
}

function getIssuePlacement(locale: Locale, source: PublicationExportSource) {
  if (
    source.publicationYear &&
    source.publicationVolume &&
    source.publicationIssue
  ) {
    return locale === "zh"
      ? `${source.publicationYear} / 第 ${source.publicationVolume} 卷 / 第 ${source.publicationIssue} 期`
      : `${source.publicationYear} / Vol. ${source.publicationVolume} / Issue ${source.publicationIssue}`;
  }

  return locale === "zh" ? "期次待编排" : "Issue placement pending";
}

export function PublicationProof({
  locale,
  source,
}: PublicationProofProps) {
  const copy = getSubmissionUiCopy(locale);
  const title = getPublicationTitle(source);
  const excerpt = getPublicationExcerpt(source);
  const tags = getPublicationTags(source);
  const byline = source.author.name?.trim() || source.author.email;
  const publicationLocale = getPublicationLocale(source);

  return (
    <article className="publication-proof-sheet mx-auto max-w-[8.5in] rounded-[32px] border border-border/70 bg-background/96 px-6 py-8 shadow-xl shadow-black/5 sm:px-10 sm:py-10 lg:px-14 lg:py-14">
      <header className="border-b border-border/70 pb-8">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-4">
            <div>
              <p className="font-display text-[2.6rem] leading-none tracking-[0.28em] sm:text-[3.1rem]">
                F.U.C.K
              </p>
              <p className="pl-[0.14em] font-serif text-[2.2rem] leading-none tracking-[0.08em] text-foreground/88 sm:text-[2.6rem]">
                Journal
              </p>
            </div>
            <p className="max-w-xl font-sans text-[10px] uppercase tracking-[0.34em] text-muted-foreground">
              {getBrandSubtitle(locale)}
            </p>
          </div>

          <div className="grid gap-4 text-left lg:max-w-[18rem] lg:text-right">
            <div>
              <p className="font-sans text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
                {copy.publication.proofKicker}
              </p>
              <p className="mt-2 font-serif text-base leading-relaxed text-foreground/85">
                {getIssuePlacement(locale, source)}
              </p>
            </div>
            <div>
              <p className="font-sans text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
                {copy.publication.proofMetaLabel}
              </p>
              <div className="mt-2 space-y-1 font-serif text-base leading-relaxed text-foreground/85">
                <p>{source.publicId}</p>
                <p>{publicationLocale.toUpperCase()}</p>
                {source.publicationSlug ? <p>{source.publicationSlug}</p> : null}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="mt-10">
        <p className="font-sans text-[10px] uppercase tracking-[0.34em] text-journal-red dark:text-journal-gold">
          {copy.publication.proofKicker}
        </p>
        <h1 className="mt-4 font-display text-[2.6rem] leading-[1.06] sm:text-[3.4rem]">
          {title}
        </h1>
        <p className="mt-5 font-serif text-[1.45rem] leading-relaxed text-foreground/88">
          {byline}
        </p>
        {excerpt ? (
          <p className="mt-6 max-w-[42rem] font-serif text-[1.18rem] italic leading-9 text-foreground/78">
            {excerpt}
          </p>
        ) : null}

        <div className="mt-8 grid gap-4 border-y border-border/70 py-5 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="font-sans text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
              {locale === "zh" ? "语言" : "Locale"}
            </p>
            <p className="mt-2 font-serif text-base leading-relaxed text-foreground/86">
              {publicationLocale}
            </p>
          </div>
          <div>
            <p className="font-sans text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
              {copy.publication.proofPreparedLabel}
            </p>
            <p className="mt-2 font-serif text-base leading-relaxed text-foreground/86">
              {source.publicId}
            </p>
          </div>
          <div>
            <p className="font-sans text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
              {locale === "zh" ? "投稿时间" : "Submitted"}
            </p>
            <p className="mt-2 font-serif text-base leading-relaxed text-foreground/86">
              {source.submittedAt
                ? formatDate(source.submittedAt.toISOString(), locale)
                : locale === "zh"
                  ? "尚未正式提交"
                  : "Not formally submitted"}
            </p>
          </div>
          <div>
            <p className="font-sans text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
              {copy.publication.proofUpdatedLabel}
            </p>
            <p className="mt-2 font-serif text-base leading-relaxed text-foreground/86">
              {formatDate(source.updatedAt.toISOString(), locale)}
            </p>
          </div>
        </div>
      </div>

      <section className="mt-10 rounded-[24px] border border-border/70 bg-card/55 px-5 py-5 sm:px-7 sm:py-6">
        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              {locale === "zh" ? "摘要" : "Abstract"}
            </p>
            <div className="mt-4 space-y-4">
              {renderParagraphs(source.abstract, copy.fields.noContent, true)}
            </div>
          </div>
          <div>
            <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              {copy.fields.keywordsLabel}
            </p>
            {tags.length ? (
              <p className="mt-4 font-serif text-[1.02rem] leading-8 text-foreground/85">
                {tags.join("  •  ")}
              </p>
            ) : (
              <p className="mt-4 font-serif text-[1.02rem] italic leading-8 text-muted-foreground">
                {copy.fields.noContent}
              </p>
            )}
          </div>
        </div>
      </section>

      <div className="mt-10 space-y-10">
        <ProofSection
          label={copy.fields.introductionLabel}
          value={source.introduction}
          emptyText={copy.fields.noContent}
        />
        <ProofSection
          label={copy.fields.mainContentLabel}
          value={source.mainContent}
          emptyText={copy.fields.noContent}
        />
        <ProofSection
          label={copy.fields.conclusionLabel}
          value={source.conclusion}
          emptyText={copy.fields.noContent}
        />
        <ProofSection
          label={copy.fields.referencesLabel}
          value={source.references}
          emptyText={copy.fields.noContent}
          compact
        />
      </div>

      <footer className="mt-12 flex flex-col gap-3 border-t border-border/70 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-sans text-[10px] uppercase tracking-[0.28em] text-muted-foreground">
          {copy.publication.proofPreparedLabel} {source.publicId}
        </p>
        <p className="font-serif text-sm leading-relaxed text-muted-foreground">
          {locale === "zh"
            ? "内部编辑 proof，仅用于出版准备与 PDF 导出。"
            : "Internal editorial proof for publication preparation and PDF export."}
        </p>
      </footer>
    </article>
  );
}
