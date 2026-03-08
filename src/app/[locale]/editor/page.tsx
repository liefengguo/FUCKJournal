import { unstable_noStore as noStore } from "next/cache";
import { setRequestLocale } from "next-intl/server";

import { requireEditorUser } from "@/lib/auth-guards";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { FlashMessage } from "@/components/dashboard/flash-message";
import { LocaleLink } from "@/components/locale-link";
import { PublicationStateBadge } from "@/components/submissions/publication-state-badge";
import { SubmissionStatusBadge } from "@/components/submissions/submission-status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Locale } from "@/i18n/routing";
import { getAuthFeedback } from "@/lib/feedback";
import { getPlatformCopy } from "@/lib/platform-copy";
import { getPublicationPipelineState } from "@/lib/submission-status";
import { listEditorialSubmissions } from "@/lib/submissions";
import { formatDate } from "@/lib/site";

type EditorPageProps = {
  params: {
    locale: Locale;
  };
  searchParams?: {
    notice?: string;
  };
};

export default async function EditorPage({
  params,
  searchParams,
}: EditorPageProps) {
  const { locale } = params;
  noStore();
  setRequestLocale(locale);

  await requireEditorUser(locale, `/${locale}/editor`);
  const copy = getPlatformCopy(locale);
  const submissions = await listEditorialSubmissions();
  const notice = getAuthFeedback(locale, searchParams?.notice);
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
  const publicationCounts = submissions
    .filter((submission) => submission.status === "ACCEPTED")
    .reduce(
      (accumulator, submission) => {
        const state = getPublicationPipelineState(submission);

        if (state === "PUBLISHED") {
          accumulator.published += 1;
        } else if (state === "READY") {
          accumulator.ready += 1;
        } else {
          accumulator.pending += 1;
        }

        return accumulator;
      },
      { pending: 0, ready: 0, published: 0 },
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
        {
          href: "/editor/publications",
          label: copy.editor.publicationsTitle,
        },
        {
          href: "/editor/issues",
          label: copy.editor.issuesTitle,
        },
      ]}
      action={
        <>
          <Button asChild size="sm">
            <LocaleLink locale={locale} href="/editor/submissions">
              {copy.editor.queueTitle}
            </LocaleLink>
          </Button>
          <Button asChild variant="outline" size="sm">
            <LocaleLink locale={locale} href="/editor/issues">
              {copy.editor.issuesTitle}
            </LocaleLink>
          </Button>
          <Button asChild variant="outline" size="sm">
            <LocaleLink locale={locale} href="/editor/publications">
              {copy.editor.publicationsTitle}
            </LocaleLink>
          </Button>
          <SignOutButton locale={locale} label={locale === "zh" ? "退出" : "Sign out"} />
        </>
      }
    >
      {notice ? <FlashMessage message={notice} /> : null}
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

      <section className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">
              {copy.editor.publicationPendingCountLabel}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-display text-5xl">{publicationCounts.pending}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">
              {copy.editor.publicationReadyCountLabel}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-display text-5xl">{publicationCounts.ready}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">{copy.editor.publishedCountLabel}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-display text-5xl">{publicationCounts.published}</p>
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
                    {submission.status === "ACCEPTED" ? (
                      <div className="pt-1">
                        <PublicationStateBadge
                          locale={locale}
                          state={getPublicationPipelineState(submission)}
                        />
                      </div>
                    ) : null}
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
              <p className="mt-4 font-sans text-xs uppercase tracking-[0.2em] text-muted-foreground">
                {locale === "zh"
                  ? "作者一旦提交，稿件会自动进入这里。"
                  : "As soon as authors submit, new entries will appear here."}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </DashboardShell>
  );
}
