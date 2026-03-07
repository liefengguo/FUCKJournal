import type { SubmissionStatus } from "@prisma/client";

import type { Locale } from "@/i18n/routing";
import { Badge } from "@/components/ui/badge";
import { getSubmissionStatusLabel } from "@/lib/submission-status";
import { cn } from "@/lib/utils";

type SubmissionStatusBadgeProps = {
  status: SubmissionStatus;
  locale: Locale;
};

const statusClasses: Record<SubmissionStatus, string> = {
  DRAFT: "border-border bg-background/60 text-muted-foreground",
  SUBMITTED: "border-journal-red/20 bg-journal-red/10 text-journal-red",
  UNDER_REVIEW:
    "border-journal-gold/20 bg-journal-gold/10 text-journal-gold dark:text-journal-gold",
  REVISION_REQUESTED: "border-journal-red/30 bg-journal-red/10 text-foreground",
  ACCEPTED: "border-emerald-700/20 bg-emerald-700/10 text-emerald-800 dark:text-emerald-300",
  REJECTED: "border-border bg-muted text-muted-foreground",
};

export function SubmissionStatusBadge({
  status,
  locale,
}: SubmissionStatusBadgeProps) {
  return (
    <Badge variant="neutral" className={cn(statusClasses[status])}>
      {getSubmissionStatusLabel(status, locale)}
    </Badge>
  );
}
