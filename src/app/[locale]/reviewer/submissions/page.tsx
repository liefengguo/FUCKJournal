import { unstable_noStore as noStore } from "next/cache";
import { setRequestLocale } from "next-intl/server";

import { requireReviewerUser } from "@/lib/auth-guards";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { LocaleLink } from "@/components/locale-link";
import { ReviewDecisionBadge } from "@/components/reviews/review-decision-badge";
import { SubmissionStatusBadge } from "@/components/submissions/submission-status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Locale } from "@/i18n/routing";
import { getPlatformCopy } from "@/lib/platform-copy";
import {
  getReviewerAssignmentStatusLabel,
  getSubmissionStatusLabel,
} from "@/lib/submission-status";
import { getSubmissionUiCopy } from "@/lib/submission-ui-copy";
import { listReviewerAssignments } from "@/lib/submissions";
import { formatDate } from "@/lib/site";

type ReviewerSubmissionsPageProps = {
  params: {
    locale: Locale;
  };
};

export default async function ReviewerSubmissionsPage({
  params,
}: ReviewerSubmissionsPageProps) {
  const { locale } = params;
  noStore();
  setRequestLocale(locale);

  const reviewer = await requireReviewerUser(locale, `/${locale}/reviewer/submissions`);
  const assignments = await listReviewerAssignments(reviewer.id);
  const copy = getPlatformCopy(locale);
  const uiCopy = getSubmissionUiCopy(locale);

  return (
    <DashboardShell
      locale={locale}
      title={copy.reviewer.assignmentsTitle}
      intro={copy.reviewer.intro}
      navItems={[
        {
          href: "/reviewer",
          label: locale === "zh" ? "概览" : "Overview",
        },
        {
          href: "/reviewer/submissions",
          label: copy.reviewer.assignmentsTitle,
          active: true,
        },
      ]}
      action={
        <SignOutButton locale={locale} label={locale === "zh" ? "退出" : "Sign out"} />
      }
    >
      <Card>
        <CardHeader className="space-y-4">
          <CardTitle>{uiCopy.reviewer.assignedTitle}</CardTitle>
          <p className="font-serif text-lg leading-relaxed text-muted-foreground">
            {uiCopy.reviewer.accessNote}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {assignments.length ? (
            assignments.map((assignment) => (
              <div
                key={assignment.id}
                className="rounded-[24px] border border-border/60 px-5 py-4"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="space-y-3">
                    <LocaleLink
                      locale={locale}
                      href={`/reviewer/submissions/${assignment.submission.publicId}`}
                      className="font-display text-2xl"
                    >
                      {assignment.submission.title ||
                        (locale === "zh" ? "未命名稿件" : "Untitled manuscript")}
                    </LocaleLink>
                    <p className="font-serif text-base text-muted-foreground">
                      {assignment.submission.author.name || assignment.submission.author.email}
                    </p>
                    <div className="flex flex-wrap gap-3 font-sans text-xs uppercase tracking-[0.2em] text-muted-foreground">
                      <span>{assignment.submission.publicId}</span>
                      <span>{formatDate(assignment.updatedAt.toISOString(), locale)}</span>
                      <span>{getSubmissionStatusLabel(assignment.submission.status, locale)}</span>
                      <span>{getReviewerAssignmentStatusLabel(assignment.status, locale)}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <SubmissionStatusBadge locale={locale} status={assignment.submission.status} />
                    {assignment.review ? (
                      <ReviewDecisionBadge locale={locale} decision={assignment.review.decision} />
                    ) : null}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-[24px] border border-border/60 px-5 py-6">
              <p className="font-display text-2xl">{copy.reviewer.emptyTitle}</p>
              <p className="mt-3 font-serif text-lg leading-relaxed text-muted-foreground">
                {copy.reviewer.emptyBody}
              </p>
              <div className="mt-5">
                <Button asChild variant="outline" size="sm">
                  <LocaleLink locale={locale} href="/reviewer">
                    {locale === "zh" ? "返回概览" : "Back to overview"}
                  </LocaleLink>
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </DashboardShell>
  );
}
