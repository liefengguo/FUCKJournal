import { unstable_noStore as noStore } from "next/cache";
import { setRequestLocale } from "next-intl/server";

import { requireContributorUser } from "@/lib/auth-guards";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { FlashMessage } from "@/components/dashboard/flash-message";
import { LocaleLink } from "@/components/locale-link";
import { SubmissionStatusBadge } from "@/components/submissions/submission-status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Locale } from "@/i18n/routing";
import { getAuthFeedback } from "@/lib/feedback";
import { getPlatformCopy } from "@/lib/platform-copy";
import { listAuthorSubmissions } from "@/lib/submissions";
import { formatDate } from "@/lib/site";

type DashboardPageProps = {
  params: {
    locale: Locale;
  };
  searchParams?: {
    notice?: string;
  };
};

export default async function DashboardPage({
  params,
  searchParams,
}: DashboardPageProps) {
  const { locale } = params;
  noStore();
  setRequestLocale(locale);

  const user = await requireContributorUser(locale, `/${locale}/dashboard`);
  const submissions = await listAuthorSubmissions(user.id);
  const copy = getPlatformCopy(locale);
  const notice = getAuthFeedback(locale, searchParams?.notice);

  const counts = submissions.reduce(
    (accumulator, submission) => {
      if (submission.status === "DRAFT") {
        accumulator.draft += 1;
      }

      if (submission.status === "SUBMITTED") {
        accumulator.submitted += 1;
      }

      if (submission.status === "REVISION_REQUESTED") {
        accumulator.revisionRequested += 1;
      }

      return accumulator;
    },
    { draft: 0, submitted: 0, revisionRequested: 0 },
  );

  const recentSubmissions = submissions.slice(0, 3);

  return (
    <DashboardShell
      locale={locale}
      title={copy.dashboard.title}
      intro={copy.dashboard.intro}
      navItems={[
        {
          href: "/dashboard",
          label: locale === "zh" ? "概览" : "Overview",
          active: true,
        },
        {
          href: "/dashboard/submissions",
          label: copy.submission.submissionsTitle,
        },
      ]}
      action={
        <>
          <Button asChild size="sm">
            <LocaleLink locale={locale} href="/dashboard/submissions/new">
              {copy.dashboard.createDraftLabel}
            </LocaleLink>
          </Button>
          <SignOutButton locale={locale} label={locale === "zh" ? "退出" : "Sign out"} />
        </>
      }
    >
      {notice ? <FlashMessage message={notice} /> : null}
      <section className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">{copy.dashboard.draftCountLabel}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-display text-5xl">{counts.draft}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">{copy.dashboard.submittedCountLabel}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-display text-5xl">{counts.submitted}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">{copy.dashboard.revisionCountLabel}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-display text-5xl">{counts.revisionRequested}</p>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <Card>
          <CardHeader className="space-y-4">
            <CardTitle>{copy.dashboard.newDraftTitle}</CardTitle>
            <p className="font-serif text-lg leading-relaxed text-muted-foreground">
              {copy.dashboard.newDraftBody}
            </p>
          </CardHeader>
          <CardContent>
            <Button asChild size="lg">
              <LocaleLink locale={locale} href="/dashboard/submissions/new">
                {copy.dashboard.createDraftLabel}
              </LocaleLink>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="space-y-4">
            <CardTitle>{copy.dashboard.submissionsTitle}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentSubmissions.length ? (
              recentSubmissions.map((submission) => (
                <div
                  key={submission.publicId}
                  className="rounded-[24px] border border-border/60 px-5 py-4"
                >
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="space-y-2">
                      <LocaleLink
                        locale={locale}
                        href={`/dashboard/submissions/${submission.publicId}`}
                        className="font-display text-2xl leading-tight"
                      >
                        {submission.title || (locale === "zh" ? "未命名稿件" : "Untitled manuscript")}
                      </LocaleLink>
                      <p className="font-sans text-xs uppercase tracking-[0.2em] text-muted-foreground">
                        {formatDate(submission.updatedAt.toISOString(), locale)}
                      </p>
                    </div>
                    <SubmissionStatusBadge locale={locale} status={submission.status} />
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-[24px] border border-border/60 px-5 py-6">
                <p className="font-display text-2xl">{copy.dashboard.emptyTitle}</p>
                <p className="mt-3 font-serif text-lg leading-relaxed text-muted-foreground">
                  {copy.dashboard.emptyBody}
                </p>
                <div className="mt-5">
                  <Button asChild size="sm">
                    <LocaleLink locale={locale} href="/dashboard/submissions/new">
                      {copy.dashboard.createDraftLabel}
                    </LocaleLink>
                  </Button>
                </div>
              </div>
            )}
            <Button asChild variant="outline" size="sm">
              <LocaleLink locale={locale} href="/dashboard/submissions">
                {copy.dashboard.viewAllLabel}
              </LocaleLink>
            </Button>
          </CardContent>
        </Card>
      </section>
    </DashboardShell>
  );
}
