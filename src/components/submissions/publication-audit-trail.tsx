import type { PublicationAuditAction } from "@prisma/client";

import type { Locale } from "@/i18n/routing";
import { getPublicationAuditActionLabel } from "@/lib/submission-status";
import { formatDate } from "@/lib/site";

type PublicationAuditItem = {
  id: string;
  action: PublicationAuditAction;
  changedFields: string[];
  createdAt: Date;
  actor: {
    name: string | null;
    email: string;
  };
};

type PublicationAuditTrailProps = {
  locale: Locale;
  items: PublicationAuditItem[];
};

function formatFieldLabel(field: string, locale: Locale) {
  const labels: Record<string, Record<Locale, string>> = {
    publicationSlug: {
      en: "Slug",
      zh: "Slug",
    },
    publicationTitle: {
      en: "Publication title",
      zh: "出版标题",
    },
    publicationExcerpt: {
      en: "Excerpt",
      zh: "出版摘要",
    },
    publicationTags: {
      en: "Tags",
      zh: "出版标签",
    },
    publicationLocale: {
      en: "Locale",
      zh: "出版语言",
    },
    publicationVolume: {
      en: "Volume",
      zh: "卷",
    },
    publicationIssue: {
      en: "Issue",
      zh: "期",
    },
    publicationYear: {
      en: "Year",
      zh: "年份",
    },
    seoTitle: {
      en: "SEO title",
      zh: "SEO 标题",
    },
    seoDescription: {
      en: "SEO description",
      zh: "SEO 描述",
    },
  };

  return labels[field]?.[locale] ?? field;
}

export function PublicationAuditTrail({
  locale,
  items,
}: PublicationAuditTrailProps) {
  if (!items.length) {
    return (
      <div className="rounded-[24px] border border-border/60 px-5 py-6">
        <p className="font-serif text-lg leading-relaxed text-muted-foreground">
          {locale === "zh"
            ? "目前还没有出版审计记录。"
            : "No publication audit events have been recorded yet."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item.id} className="rounded-[24px] border border-border/60 px-5 py-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-2">
              <p className="font-serif text-lg">
                {getPublicationAuditActionLabel(item.action, locale)}
              </p>
              <p className="font-serif text-base text-muted-foreground">
                {item.actor.name || item.actor.email}
              </p>
            </div>
            <p className="font-sans text-xs uppercase tracking-[0.2em] text-muted-foreground">
              {formatDate(item.createdAt.toISOString(), locale)}
            </p>
          </div>
          {item.changedFields.length ? (
            <div className="mt-4">
              <p className="font-sans text-xs uppercase tracking-[0.22em] text-muted-foreground">
                {locale === "zh" ? "更新字段" : "Updated fields"}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {item.changedFields.map((field) => (
                  <span
                    key={field}
                    className="inline-flex rounded-full border border-border/60 bg-background/70 px-3 py-1 font-sans text-[11px] uppercase tracking-[0.2em] text-muted-foreground"
                  >
                    {formatFieldLabel(field, locale)}
                  </span>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}
