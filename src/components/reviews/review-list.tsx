import type { ReviewDecision } from "@prisma/client";

import type { Locale } from "@/i18n/routing";
import { getSubmissionUiCopy } from "@/lib/submission-ui-copy";
import { formatDate } from "@/lib/site";
import { ReviewDecisionBadge } from "@/components/reviews/review-decision-badge";

type ReviewItem = {
  id: string;
  decision: ReviewDecision;
  commentsToAuthor: string | null;
  commentsToEditor: string | null;
  updatedAt: Date;
  reviewer: {
    name: string | null;
    email: string;
  };
};

type ReviewListProps = {
  locale: Locale;
  reviews: ReviewItem[];
  emptyText?: string;
  showPrivateComments?: boolean;
};

export function ReviewList({
  locale,
  reviews,
  emptyText,
  showPrivateComments = true,
}: ReviewListProps) {
  const copy = getSubmissionUiCopy(locale);

  if (!reviews.length) {
    return (
      <div className="rounded-[24px] border border-border/60 px-5 py-6">
        <p className="font-serif text-lg leading-relaxed text-muted-foreground">
          {emptyText || copy.review.empty}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div key={review.id} className="rounded-[24px] border border-border/60 px-5 py-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-2">
              <p className="font-serif text-lg">
                {review.reviewer.name || review.reviewer.email}
              </p>
              <p className="font-sans text-xs uppercase tracking-[0.2em] text-muted-foreground">
                {formatDate(review.updatedAt.toISOString(), locale)}
              </p>
            </div>
            <ReviewDecisionBadge locale={locale} decision={review.decision} />
          </div>
          <div className="mt-5 space-y-5">
            <div>
              <p className="font-sans text-xs uppercase tracking-[0.22em] text-muted-foreground">
                {copy.review.commentsToAuthorLabel}
              </p>
              <p className="mt-2 whitespace-pre-wrap font-serif text-lg leading-relaxed text-muted-foreground">
                {review.commentsToAuthor || copy.review.empty}
              </p>
            </div>
            {showPrivateComments ? (
              <div>
                <p className="font-sans text-xs uppercase tracking-[0.22em] text-muted-foreground">
                  {copy.review.commentsToEditorLabel}
                </p>
                <p className="mt-2 whitespace-pre-wrap font-serif text-lg leading-relaxed text-muted-foreground">
                  {review.commentsToEditor || copy.review.empty}
                </p>
              </div>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}
