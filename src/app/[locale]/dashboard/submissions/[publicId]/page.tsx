import { unstable_noStore as noStore } from "next/cache";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";

import { requireContributorUser } from "@/lib/auth-guards";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { FlashMessage } from "@/components/dashboard/flash-message";
import { LocaleLink } from "@/components/locale-link";
import { SubmissionStatusBadge } from "@/components/submissions/submission-status-badge";
import { SubmissionTimeline } from "@/components/submissions/submission-timeline";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Locale } from "@/i18n/routing";
import {
  getSubmissionError,
  getSubmissionNotice,
} from "@/lib/feedback";
import { getPlatformCopy } from "@/lib/platform-copy";
import { canAuthorEditStatus } from "@/lib/submission-status";
import { getAuthorSubmissionDetail } from "@/lib/submissions";
import { formatDate } from "@/lib/site";

type SubmissionDetailPageProps = {
  params: {
    locale: Locale;
    publicId: string;
  };
  searchParams?: {
    notice?: string;
    error?: string;
  };
};

function getGateBody(locale: Locale, status: Parameters<typeof canAuthorEditStatus>[0]) {
  const submissionCopy = getPlatformCopy(locale).submission;

  switch (status) {
    case "DRAFT":
      return submissionCopy.draftGateBody;
    case "REVISION_REQUESTED":
      return submissionCopy.reviseGateBody;
    case "SUBMITTED":
      return submissionCopy.submittedGateBody;
    case "UNDER_REVIEW":
      return submissionCopy.underReviewGateBody;
    case "ACCEPTED":
      return submissionCopy.acceptedGateBody;
    case "REJECTED":
      return submissionCopy.rejectedGateBody;
    default:
      return submissionCopy.draftGateBody;
  }
}

export default async function SubmissionDetailPage({
  params,
  searchParams,
}: SubmissionDetailPageProps) {
  const { locale, publicId } = params;
  noStore();
  setRequestLocale(locale);

  const user = await requireContributorUser(
    locale,
    `/${locale}/dashboard/submissions/${publicId}`,
  );
  const submission = await getAuthorSubmissionDetail(user.id, publicId);

  if (!submission) {
    notFound();
  }

  const copy = getPlatformCopy(locale);
  const canEdit = canAuthorEditStatus(submission.status);
  const notice = getSubmissionNotice(locale, searchParams?.notice);
  const errorMessage = getSubmissionError(locale, searchParams?.error);

  return (
    <DashboardShell
      locale={locale}
      title={copy.submission.detailTitle}
      intro={copy.submission.submissionsIntro}
      navItems={[
        {
          href: "/dashboard",
          label: locale === "zh" ? "概览" : "Overview",
        },
        {
          href: "/dashboard/submissions",
          label: copy.submission.submissionsTitle,
          active: true,
        },
      ]}
      action={
        <>
          {canEdit ? (
            <Button asChild size="sm">
              <LocaleLink locale={locale} href={`/dashboard/submissions/${publicId}/edit`}>
                {copy.submission.editTitle}
              </LocaleLink>
            </Button>
          ) : null}
          <SignOutButton locale={locale} label={locale === "zh" ? "退出" : "Sign out"} />
        </>
      }
    >
      {notice ? <FlashMessage message={notice} /> : null}
      {errorMessage ? <FlashMessage message={errorMessage} tone="error" /> : null}

      <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader className="space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <CardTitle className="text-3xl">
                  {submission.title || (locale === "zh" ? "未命名稿件" : "Untitled manuscript")}
                </CardTitle>
                <p className="mt-3 font-sans text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  {submission.publicId}
                </p>
              </div>
              <SubmissionStatusBadge locale={locale} status={submission.status} />
            </div>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="font-sans text-xs uppercase tracking-[0.22em] text-muted-foreground">
                  {copy.submission.updatedLabel}
                </p>
                <p className="mt-2 font-serif text-lg">
                  {formatDate(submission.updatedAt.toISOString(), locale)}
                </p>
              </div>
              <div>
                <p className="font-sans text-xs uppercase tracking-[0.22em] text-muted-foreground">
                  {copy.submission.submittedLabel}
                </p>
                <p className="mt-2 font-serif text-lg">
                  {submission.submittedAt
                    ? formatDate(submission.submittedAt.toISOString(), locale)
                    : locale === "zh"
                      ? "尚未提交"
                      : "Not submitted"}
                </p>
              </div>
            </div>

            <div>
              <p className="font-sans text-xs uppercase tracking-[0.22em] text-muted-foreground">
                {copy.submission.abstractLabel}
              </p>
              <p className="mt-3 whitespace-pre-wrap font-serif text-lg leading-relaxed text-muted-foreground">
                {submission.abstract || (locale === "zh" ? "暂无摘要。" : "No abstract yet.")}
              </p>
            </div>

            <div>
              <p className="font-sans text-xs uppercase tracking-[0.22em] text-muted-foreground">
                {copy.submission.coverLetterLabel}
              </p>
              <p className="mt-3 whitespace-pre-wrap font-serif text-lg leading-relaxed text-muted-foreground">
                {submission.coverLetter || (locale === "zh" ? "暂无附信。" : "No cover letter yet.")}
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader className="space-y-4">
              <CardTitle>{copy.submission.draftGateTitle}</CardTitle>
              <p className="font-serif text-lg leading-relaxed text-muted-foreground">
                {getGateBody(locale, submission.status)}
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="font-sans text-xs uppercase tracking-[0.22em] text-muted-foreground">
                  {copy.submission.languageLabel}
                </p>
                <p className="mt-2 font-serif text-lg">
                  {submission.manuscriptLanguage || (locale === "zh" ? "未填写" : "Not specified")}
                </p>
              </div>
              <div>
                <p className="font-sans text-xs uppercase tracking-[0.22em] text-muted-foreground">
                  {copy.submission.fileNameLabel}
                </p>
                <p className="mt-2 font-serif text-lg">
                  {submission.manuscriptFileName || (locale === "zh" ? "未填写" : "Not specified")}
                </p>
              </div>
              <div>
                <p className="font-sans text-xs uppercase tracking-[0.22em] text-muted-foreground">
                  {copy.submission.latestVersionLabel}
                </p>
                <p className="mt-2 font-serif text-lg">
                  {submission.versions[0]?.versionNumber ?? 1}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="space-y-4">
              <CardTitle>{copy.submission.statusHistoryTitle}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <SubmissionTimeline
                locale={locale}
                events={submission.statusEvents}
                isDraft={submission.status === "DRAFT"}
              />
            </CardContent>
          </Card>
        </div>
      </section>
    </DashboardShell>
  );
}
