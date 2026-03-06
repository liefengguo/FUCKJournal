import type { HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-3 py-1 font-sans text-[11px] uppercase tracking-[0.22em]",
  {
    variants: {
      variant: {
        default:
          "border-journal-red/20 bg-journal-red/10 text-journal-red dark:border-journal-gold/20 dark:bg-journal-gold/10 dark:text-journal-gold",
        neutral:
          "border-border bg-background/60 text-muted-foreground backdrop-blur-sm",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}
