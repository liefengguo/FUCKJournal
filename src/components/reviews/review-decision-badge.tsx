import type { ReviewDecision } from "@prisma/client";

import type { Locale } from "@/i18n/routing";
import { getReviewDecisionLabel } from "@/lib/submission-status";
import { cn } from "@/lib/utils";

type ReviewDecisionBadgeProps = {
  locale: Locale;
  decision: ReviewDecision;
};

export function ReviewDecisionBadge({
  locale,
  decision,
}: ReviewDecisionBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full border px-3 py-1 font-sans text-[11px] uppercase tracking-[0.22em]",
        decision === "ACCEPT" && "border-emerald-600/30 bg-emerald-600/10 text-emerald-900 dark:text-emerald-200",
        decision === "MINOR_REVISION" && "border-amber-700/30 bg-amber-700/10 text-amber-900 dark:text-amber-200",
        decision === "MAJOR_REVISION" && "border-journal-red/30 bg-journal-red/10 text-foreground",
        decision === "REJECT" && "border-muted-foreground/30 bg-muted/50 text-muted-foreground",
      )}
    >
      {getReviewDecisionLabel(decision, locale)}
    </span>
  );
}
