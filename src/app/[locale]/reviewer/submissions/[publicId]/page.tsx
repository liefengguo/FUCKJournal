import { unstable_noStore as noStore } from "next/cache";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";

import { saveReviewerReviewAction } from "@/app/actions/submissions";
import { requireReviewerUser } from "@/lib/auth-guards";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { FlashMessage } from "@/components/dashboard/flash-message";
import { LocaleLink } from "@/components/locale-link";
import { ReviewDecisionBadge } from "@/components/reviews/review-decision-badge";
import { ReviewList } from "@/components/reviews/review-list";
import { ManuscriptDocumentView } from "@/components/submissions/manuscript-document-view";
import { SubmissionMetadataSummary } from "@/components/submissions/submission-metadata-summary";
import { SubmissionFilePanel } from "@/components/submissions/submission-file-panel";
import { SubmissionStatusBadge } from "@/components/submissions/submission-status-badge";
import { SubmissionTimeline } from "@/components/submissions/submission-timeline";
import { SubmissionVersionList } from "@/components/submissions/submission-version-list";
import { Button } from "@/components/ui/button";
import { FormSubmitButton } from "@/components/ui/form-submit-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import type { Locale } from "@/i18n/routing";
import { getSubmissionError, getSubmissionNotice } from "@/lib/feedback";
import { loadStoredManuscriptPreview } from "@/lib/manuscript-preview";
import { getPlatformCopy } from "@/lib/platform-copy";
import {
  getReviewDecisionLabel,
  getReviewerAssignmentStatusLabel,
  getSubmissionStatusLabel,
} from "@/lib/submission-status";
import { getSubmissionUiCopy } from "@/lib/submission-ui-copy";
import { getReviewerAssignmentDetail } from "@/lib/submissions";
import { formatDate } from "@/lib/site";
import { reviewDecisionValues } from "@/lib/validations/review";

type ReviewerSubmissionDetailPageProps = {
  params: {
    locale: Locale;
    publicId: string;
  };
  searchParams?: {
    notice?: string;
    error?: string;
  };
};

export default async function ReviewerSubmissionDetailPage({
  params,
  searchParams,
}: ReviewerSubmissionDetailPageProps) {
  const { locale, publicId } = params;
  noStore();
  setRequestLocale(locale);

  const reviewer = await requireReviewerUser(
    locale,
    `/${locale}/reviewer/submissions/${publicId}`,
  );
  const assignment = await getReviewerAssignmentDetail(reviewer.id, publicId);

  if (!assignment) {
    notFound();
  }

  const submission = assignment.submission;
  const copy = getPlatformCopy(locale);
  const uiCopy = getSubmissionUiCopy(locale);
  const notice = getSubmissionNotice(locale, searchParams?.notice);
  const errorMessage = getSubmissionError(locale, searchParams?.error);
  const reviewIsOpen = submission.status === "UNDER_REVIEW";
  const manuscriptPreview = await loadStoredManuscriptPreview({
    fileName: submission.manuscriptFileName,
    mimeType: submission.manuscriptMimeType,
    storageKey: submission.manuscriptStorageKey,
    storageProvider: submission.manuscriptStorageProvider,
    inlineUrl: `/api/submissions/${publicId}/assets/manuscript?inline=1`,
    downloadUrl: `/api/submissions/${publicId}/assets/manuscript`,
  });

  return (
    <DashboardShell
      locale={locale}
      title={copy.submission.detailTitle}
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
        <>
          <Button asChild variant="outline" size="sm">
            <LocaleLink locale={locale} href="/reviewer/submissions">
              {locale === "zh" ? "返回审稿列表" : "Back to assignments"}
            </LocaleLink>
          </Button>
          <SignOutButton locale={locale} label={locale === "zh" ? "退出" : "Sign out"} />
        </>
      }
    >
      {notice ? <FlashMessage message={notice} /> : null}
      {errorMessage ? <FlashMessage message={errorMessage} tone="error" /> : null}

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
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
            <p className="font-serif text-lg leading-relaxed text-muted-foreground">
              {uiCopy.reviewer.accessNote}
            </p>
          </CardHeader>
          <CardContent className="space-y-8">
            {manuscriptPreview ? (
              <ManuscriptDocumentView
                locale={locale}
                preview={manuscriptPreview}
                showDownloadLink={false}
              />
            ) : null}

            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <p className="font-sans text-xs uppercase tracking-[0.22em] text-muted-foreground">
                  {copy.submission.authorLabel}
                </p>
                <p className="mt-2 font-serif text-lg">
                  {submission.author.name || submission.author.email}
                </p>
              </div>
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
                  {copy.submission.updatedLabel}
                </p>
                <p className="mt-2 font-serif text-lg">
                  {formatDate(submission.updatedAt.toISOString(), locale)}
                </p>
              </div>
            </div>

            <SubmissionMetadataSummary
              locale={locale}
              abstract={submission.abstract}
              keywords={submission.keywords}
              showCoverLetter={false}
              details={[
                {
                  label: copy.submission.authorLabel,
                  value: submission.author.name || submission.author.email,
                },
                {
                  label: copy.submission.languageLabel,
                  value: submission.manuscriptLanguage,
                },
                {
                  label: copy.submission.fileNameLabel,
                  value: submission.manuscriptFileName,
                },
                {
                  label: locale === "zh" ? "审稿编号" : "Submission ID",
                  value: submission.publicId,
                },
              ]}
            />
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader className="space-y-4">
              <CardTitle>{uiCopy.reviewer.assignedTitle}</CardTitle>
              <p className="font-serif text-lg leading-relaxed text-muted-foreground">
                {uiCopy.reviewer.reviewNote}
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="font-sans text-xs uppercase tracking-[0.22em] text-muted-foreground">
                  {locale === "zh" ? "分配状态" : "Assignment status"}
                </p>
                <p className="mt-2 font-serif text-lg">
                  {getReviewerAssignmentStatusLabel(assignment.status, locale)}
                </p>
              </div>
              <div>
                <p className="font-sans text-xs uppercase tracking-[0.22em] text-muted-foreground">
                  {locale === "zh" ? "稿件状态" : "Submission status"}
                </p>
                <p className="mt-2 font-serif text-lg">
                  {getSubmissionStatusLabel(submission.status, locale)}
                </p>
              </div>
              <div>
                <p className="font-sans text-xs uppercase tracking-[0.22em] text-muted-foreground">
                  {locale === "zh" ? "分配人" : "Assigned by"}
                </p>
                <p className="mt-2 font-serif text-lg">
                  {assignment.assignedBy.name || assignment.assignedBy.email}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="space-y-4">
              <CardTitle>{uiCopy.uploads.sectionTitle}</CardTitle>
            </CardHeader>
            <CardContent>
              <SubmissionFilePanel
                locale={locale}
                publicId={publicId}
                editable={false}
                assets={[
                  {
                    kind: "manuscript",
                    fileName: submission.manuscriptFileName,
                    mimeType: submission.manuscriptMimeType,
                    sizeBytes: submission.manuscriptSizeBytes,
                    href: `/api/submissions/${publicId}/assets/manuscript`,
                  },
                ]}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="space-y-4">
              <CardTitle>{uiCopy.review.sectionTitle}</CardTitle>
              <p className="font-serif text-lg leading-relaxed text-muted-foreground">
                {uiCopy.review.sectionBody}
              </p>
            </CardHeader>
            <CardContent className="space-y-5">
              {assignment.review ? (
                <div className="rounded-[24px] border border-border/60 px-5 py-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <p className="font-serif text-lg">
                      {locale === "zh" ? "当前审稿建议" : "Current recommendation"}
                    </p>
                    <ReviewDecisionBadge
                      locale={locale}
                      decision={assignment.review.decision}
                    />
                  </div>
                  <p className="mt-3 font-sans text-xs uppercase tracking-[0.2em] text-muted-foreground">
                    {formatDate(assignment.review.updatedAt.toISOString(), locale)}
                  </p>
                </div>
              ) : null}

              <form
                action={saveReviewerReviewAction}
                className="space-y-5"
                data-testid="reviewer-review-form"
              >
                <input type="hidden" name="locale" value={locale} />
                <input type="hidden" name="publicId" value={publicId} />
                <div className="space-y-2">
                  <label className="font-sans text-xs uppercase tracking-[0.22em] text-muted-foreground">
                    {uiCopy.review.recommendationLabel}
                  </label>
                  <select
                    name="decision"
                    defaultValue={assignment.review?.decision ?? "MINOR_REVISION"}
                    disabled={!reviewIsOpen}
                    data-testid="reviewer-decision"
                    className="h-11 w-full rounded-[24px] border border-border bg-background/70 px-4 font-sans text-sm text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {reviewDecisionValues.map((decision) => (
                      <option key={decision} value={decision}>
                        {getReviewDecisionLabel(decision, locale)}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="font-sans text-xs uppercase tracking-[0.22em] text-muted-foreground">
                    {uiCopy.review.commentsToAuthorLabel}
                  </label>
                  <Textarea
                    name="commentsToAuthor"
                    defaultValue={assignment.review?.commentsToAuthor ?? ""}
                    disabled={!reviewIsOpen}
                    className="min-h-[180px]"
                    data-testid="reviewer-comments-author"
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-sans text-xs uppercase tracking-[0.22em] text-muted-foreground">
                    {uiCopy.review.commentsToEditorLabel}
                  </label>
                  <Textarea
                    name="commentsToEditor"
                    defaultValue={assignment.review?.commentsToEditor ?? ""}
                    disabled={!reviewIsOpen}
                    className="min-h-[180px]"
                    data-testid="reviewer-comments-editor"
                  />
                </div>
                {reviewIsOpen ? (
                  <FormSubmitButton
                    type="submit"
                    size="lg"
                    className="w-full"
                    data-testid="reviewer-save-review"
                    idleLabel={uiCopy.review.saveLabel}
                    pendingLabel={uiCopy.review.savingLabel}
                  />
                ) : (
                  <div className="rounded-[24px] border border-border/60 px-5 py-5">
                    <p className="font-serif text-lg leading-relaxed text-muted-foreground">
                      {locale === "zh"
                        ? "只有在稿件处于审稿中时，审稿意见表单才可提交。"
                        : "The review form is available only while the submission is under review."}
                    </p>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="space-y-4">
              <CardTitle>{uiCopy.versions.sectionTitle}</CardTitle>
            </CardHeader>
            <CardContent>
              <SubmissionVersionList locale={locale} versions={submission.versions} />
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

          {assignment.review ? (
            <Card>
              <CardHeader className="space-y-4">
                <CardTitle>{locale === "zh" ? "已提交审稿意见" : "Submitted review"}</CardTitle>
              </CardHeader>
              <CardContent>
                <ReviewList
                  locale={locale}
                  reviews={[assignment.review]}
                  showPrivateComments
                />
              </CardContent>
            </Card>
          ) : null}
        </div>
      </section>
    </DashboardShell>
  );
}
