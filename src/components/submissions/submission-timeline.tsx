import type { SubmissionStatus } from "@prisma/client";

import type { Locale } from "@/i18n/routing";
import { getSubmissionTimelineEmptyMessage } from "@/lib/feedback";
import { getSubmissionStatusLabel } from "@/lib/submission-status";
import { formatDate } from "@/lib/site";

type TimelineEvent = {
  id: string;
  createdAt: Date;
  fromStatus: SubmissionStatus | null;
  toStatus: SubmissionStatus;
  note: string | null;
  actor?: {
    name: string | null;
    email: string;
  } | null;
};

type SubmissionTimelineProps = {
  locale: Locale;
  events: TimelineEvent[];
  isDraft: boolean;
};

export function SubmissionTimeline({
  locale,
  events,
  isDraft,
}: SubmissionTimelineProps) {
  if (!events.length) {
    return (
      <div className="rounded-[24px] border border-border/60 px-5 py-6 font-serif text-lg leading-relaxed text-muted-foreground">
        {getSubmissionTimelineEmptyMessage(locale, isDraft)}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {events.map((event, index) => (
        <div key={event.id} className="relative pl-8">
          {index !== events.length - 1 ? (
            <div className="absolute left-[11px] top-7 h-[calc(100%+1.25rem)] w-px bg-border" />
          ) : null}
          <div className="absolute left-0 top-2 h-6 w-6 rounded-full border border-journal-red/30 bg-journal-red/10" />
          <div className="rounded-[20px] border border-border/60 px-4 py-4">
            <p className="font-sans text-xs uppercase tracking-[0.2em] text-muted-foreground">
              {formatDate(event.createdAt.toISOString(), locale)}
            </p>
            <p className="mt-2 font-serif text-lg">
              {event.fromStatus ? (
                <>
                  {getSubmissionStatusLabel(event.fromStatus, locale)} {"->"}{" "}
                </>
              ) : null}
              {getSubmissionStatusLabel(event.toStatus, locale)}
            </p>
            {event.actor ? (
              <p className="mt-2 font-serif text-base text-muted-foreground">
                {event.actor.name || event.actor.email}
              </p>
            ) : null}
            {event.note ? (
              <p className="mt-2 whitespace-pre-wrap font-serif text-base leading-relaxed text-muted-foreground">
                {event.note}
              </p>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}
