import type { SubmissionStatus } from "@prisma/client";

import type { Locale } from "@/i18n/routing";
import { getVersionLabel } from "@/lib/feedback";
import { getSubmissionStatusLabel } from "@/lib/submission-status";
import { getSubmissionUiCopy } from "@/lib/submission-ui-copy";
import { formatDate } from "@/lib/site";

type VersionItem = {
  id: string;
  versionNumber: number;
  label: string;
  statusContext: SubmissionStatus;
  createdAt: Date;
  createdBy: {
    name: string | null;
    email: string;
  };
};

type SubmissionVersionListProps = {
  locale: Locale;
  versions: VersionItem[];
};

export function SubmissionVersionList({
  locale,
  versions,
}: SubmissionVersionListProps) {
  const copy = getSubmissionUiCopy(locale).versions;

  if (!versions.length) {
    return (
      <div className="rounded-[24px] border border-border/60 px-5 py-6 font-serif text-lg leading-relaxed text-muted-foreground">
        {copy.empty}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {versions.map((version) => (
        <div key={version.id} className="rounded-[24px] border border-border/60 px-5 py-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-2">
              <p className="font-display text-2xl">v{version.versionNumber}</p>
              <p className="font-serif text-base text-muted-foreground">
                {getVersionLabel(locale, version.label)}
              </p>
            </div>
            <p className="font-sans text-xs uppercase tracking-[0.2em] text-muted-foreground">
              {formatDate(version.createdAt.toISOString(), locale)}
            </p>
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div>
              <p className="font-sans text-xs uppercase tracking-[0.22em] text-muted-foreground">
                {copy.statusContextLabel}
              </p>
              <p className="mt-2 font-serif text-base">
                {getSubmissionStatusLabel(version.statusContext, locale)}
              </p>
            </div>
            <div>
              <p className="font-sans text-xs uppercase tracking-[0.22em] text-muted-foreground">
                {copy.createdByLabel}
              </p>
              <p className="mt-2 font-serif text-base">
                {version.createdBy.name || version.createdBy.email}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
