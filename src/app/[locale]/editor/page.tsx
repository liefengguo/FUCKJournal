import { unstable_noStore as noStore } from "next/cache";
import { setRequestLocale } from "next-intl/server";

import { SignOutButton } from "@/components/auth/sign-out-button";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { LocaleLink } from "@/components/locale-link";
import { SubmissionStatusBadge } from "@/components/submissions/submission-status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Locale } from "@/i18n/routing";
import { getPlatformCopy } from "@/lib/platform-copy";
import { listEditorialSubmissions } from "@/lib/submissions";
import { formatDate } from "@/lib/site";

type EditorPageProps = {
  params: {
    locale: Locale;
  };
};

export default async function EditorPage({ params }: EditorPageProps) {
  const { locale } = params;
  noStore();
  setRequestLocale(locale);

  const copy = getPlatformCopy(locale);
  const submissions = await listEditorialSubmissions();
  const counts = submissions.reduce(
    (accumulator, submission) => {
      if (submission.status === "SUBMITTED") {
        accumulator.submitted += 1;
      }

      if (submission.status === "UNDER_REVIEW") {
        accumulator.underReview += 1;
      }

      if (submission.status === "REVISION_REQUESTED") {
        accumulator.revisionRequested += 1;
      }

      if (submission.status === "ACCEPTED") {
        accumulator.accepted += 1;
      }

      return accumulator;
    },
    { submitted: 0, underReview: 0, revisionRequested: 0, accepted: 0 },
  );

  return (
    <DashboardShell
      locale={locale}
      title={copy.editor.title}
      intro={copy.editor.intro}
      navItems={[
        {
          href: "/editor",
          label: locale === "zh" ? "概览" : "Overview",
          active: true,
        },
        {
          href: "/editor/submissions",
          label: copy.editor.queueTitle,
        },
      ]}
      action={
        <>
          <Button asChild size="sm">
            <LocaleLink locale={locale} href="/editor/submissions">
              {copy.editor.queueTitle}
            </LocaleLink>
          </Button>
          <SignOutButton locale={locale} label={locale === "zh" ? "退出" : "Sign out"} />
        </>
      }
    >
      <section className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">{copy.editor.submittedCountLabel}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-display text-5xl">{counts.submitted}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">{copy.editor.reviewCountLabel}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-display text-5xl">{counts.underReview}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">{copy.editor.revisionCountLabel}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-display text-5xl">{counts.revisionRequested}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">{copy.editor.acceptedCountLabel}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-display text-5xl">{counts.accepted}</p>
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>{copy.editor.queueTitle}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {submissions.length ? (
            submissions.slice(0, 5).map((submission) => (
              <div
                key={submission.publicId}
                className="rounded-[24px] border border-border/60 px-5 py-4"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="space-y-2">
                    <LocaleLink
                      locale={locale}
                      href={`/editor/submissions/${submission.publicId}`}
                      className="font-display text-2xl"
                    >
                      {submission.title || (locale === "zh" ? "未命名稿件" : "Untitled manuscript")}
                    </LocaleLink>
                    <p className="font-serif text-base text-muted-foreground">
                      {submission.author.name || submission.author.email}
                    </p>
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
              <p className="font-display text-2xl">{copy.editor.emptyTitle}</p>
              <p className="mt-3 font-serif text-lg leading-relaxed text-muted-foreground">
                {copy.editor.emptyBody}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </DashboardShell>
  );
}
