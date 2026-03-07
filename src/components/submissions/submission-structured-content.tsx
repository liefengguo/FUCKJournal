import type { Locale } from "@/i18n/routing";
import { getPlatformCopy } from "@/lib/platform-copy";
import { getSubmissionUiCopy } from "@/lib/submission-ui-copy";

type SubmissionStructuredContentProps = {
  locale: Locale;
  abstract: string | null;
  keywords: string[];
  coverLetter: string | null;
  introduction: string | null;
  mainContent: string | null;
  conclusion: string | null;
  references: string | null;
};

type SectionProps = {
  label: string;
  value: string | null;
  emptyText: string;
};

function StructuredSection({ label, value, emptyText }: SectionProps) {
  return (
    <div>
      <p className="font-sans text-xs uppercase tracking-[0.22em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-3 whitespace-pre-wrap font-serif text-lg leading-relaxed text-muted-foreground">
        {value || emptyText}
      </p>
    </div>
  );
}

export function SubmissionStructuredContent({
  locale,
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

  return (
    <div className="space-y-8">
      <StructuredSection
        label={platformCopy.abstractLabel}
        value={abstract}
        emptyText={uiCopy.fields.noContent}
      />
      <div>
        <p className="font-sans text-xs uppercase tracking-[0.22em] text-muted-foreground">
          {uiCopy.fields.keywordsLabel}
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {keywords.length ? (
            keywords.map((keyword) => (
              <span
                key={keyword}
                className="rounded-full border border-border/60 bg-background/70 px-3 py-1 font-sans text-xs uppercase tracking-[0.2em] text-muted-foreground"
              >
                {keyword}
              </span>
            ))
          ) : (
            <p className="font-serif text-lg leading-relaxed text-muted-foreground">
              {uiCopy.fields.noContent}
            </p>
          )}
        </div>
      </div>
      <StructuredSection
        label={platformCopy.coverLetterLabel}
        value={coverLetter}
        emptyText={uiCopy.fields.noContent}
      />
      <StructuredSection
        label={uiCopy.fields.introductionLabel}
        value={introduction}
        emptyText={uiCopy.fields.noContent}
      />
      <StructuredSection
        label={uiCopy.fields.mainContentLabel}
        value={mainContent}
        emptyText={uiCopy.fields.noContent}
      />
      <StructuredSection
        label={uiCopy.fields.conclusionLabel}
        value={conclusion}
        emptyText={uiCopy.fields.noContent}
      />
      <StructuredSection
        label={uiCopy.fields.referencesLabel}
        value={references}
        emptyText={uiCopy.fields.noContent}
      />
    </div>
  );
}
