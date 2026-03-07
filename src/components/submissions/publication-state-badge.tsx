import type { Locale } from "@/i18n/routing";
import {
  getPublicationPipelineStateLabel,
  type PublicationPipelineState,
} from "@/lib/submission-status";
import { cn } from "@/lib/utils";

type PublicationStateBadgeProps = {
  locale: Locale;
  state: PublicationPipelineState;
};

export function PublicationStateBadge({
  locale,
  state,
}: PublicationStateBadgeProps) {
  const toneClass =
    state === "PUBLISHED"
      ? "border-journal-red/30 bg-journal-red/10 text-foreground"
      : state === "READY"
        ? "border-border bg-secondary/80 text-foreground"
        : "border-border/60 bg-background/70 text-muted-foreground";

  return (
    <span
      className={cn(
        "inline-flex rounded-full border px-3 py-1 font-sans text-[11px] uppercase tracking-[0.22em]",
        toneClass,
      )}
    >
      {getPublicationPipelineStateLabel(state, locale)}
    </span>
  );
}
