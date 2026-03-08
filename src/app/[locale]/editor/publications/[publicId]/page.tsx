import { unstable_noStore as noStore } from "next/cache";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";

import { updatePublicationSettingsAction } from "@/app/actions/submissions";
import { requireEditorUser } from "@/lib/auth-guards";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { FlashMessage } from "@/components/dashboard/flash-message";
import { LocaleLink } from "@/components/locale-link";
import { PublicationAuditTrail } from "@/components/submissions/publication-audit-trail";
import { PublicationExportPanel } from "@/components/submissions/publication-export-panel";
import { PublicationStateBadge } from "@/components/submissions/publication-state-badge";
import { SubmissionFilePanel } from "@/components/submissions/submission-file-panel";
import { SubmissionStructuredContent } from "@/components/submissions/submission-structured-content";
import { SubmissionTimeline } from "@/components/submissions/submission-timeline";
import { SubmissionVersionList } from "@/components/submissions/submission-version-list";
import { Button } from "@/components/ui/button";
import { FormSubmitButton } from "@/components/ui/form-submit-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { Locale } from "@/i18n/routing";
import { getSubmissionError, getSubmissionNotice } from "@/lib/feedback";
import { getPlatformCopy } from "@/lib/platform-copy";
import {
  getPublicationPipelineState,
  getSubmissionStatusLabel,
} from "@/lib/submission-status";
import { getSubmissionUiCopy } from "@/lib/submission-ui-copy";
import { getPublicationSubmissionDetail } from "@/lib/submissions";
import { formatDate } from "@/lib/site";
import { publicationLocaleValues } from "@/lib/validations/publication";

type PublicationDetailPageProps = {
  params: {
    locale: Locale;
    publicId: string;
  };
  searchParams?: {
    notice?: string;
    error?: string;
  };
};

function toDatetimeLocal(value: Date | null) {
  if (!value) {
    return "";
  }

  return new Date(value.getTime() - value.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);
}

export default async function PublicationDetailPage({
  params,
  searchParams,
}: PublicationDetailPageProps) {
  const { locale, publicId } = params;
  noStore();
  setRequestLocale(locale);

  await requireEditorUser(locale, `/${locale}/editor/publications/${publicId}`);
  const submission = await getPublicationSubmissionDetail(publicId);

  if (!submission) {
    notFound();
  }

  const copy = getPlatformCopy(locale);
  const uiCopy = getSubmissionUiCopy(locale);
  const notice = getSubmissionNotice(locale, searchParams?.notice);
  const errorMessage = getSubmissionError(locale, searchParams?.error);
  const publicationState = getPublicationPipelineState(submission);
  const latestVersion = submission.versions[0]?.versionNumber ?? 1;
  const tagValue = (
    submission.publicationTags.length
      ? submission.publicationTags
      : submission.keywords
  ).join(", ");

  return (
    <DashboardShell
      locale={locale}
      title={copy.editor.publicationsTitle}
      intro={uiCopy.publication.workflowBody}
      navItems={[
        {
          href: "/editor",
          label: locale === "zh" ? "概览" : "Overview",
        },
        {
          href: "/editor/submissions",
          label: copy.editor.queueTitle,
        },
        {
          href: "/editor/publications",
          label: copy.editor.publicationsTitle,
          active: true,
        },
        {
          href: "/editor/issues",
          label: copy.editor.issuesTitle,
        },
      ]}
      action={
        <>
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
      {errorMessage ? <FlashMessage message={errorMessage} tone="error" /> : null}

      <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <Card>
          <CardHeader className="space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <CardTitle className="text-3xl">
                  {submission.publicationTitle ||
                    submission.title ||
                    (locale === "zh" ? "未命名稿件" : "Untitled manuscript")}
                </CardTitle>
                <p className="mt-3 font-sans text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  {submission.publicId}
                </p>
              </div>
              <PublicationStateBadge locale={locale} state={publicationState} />
            </div>
            <p className="font-serif text-lg leading-relaxed text-muted-foreground">
              {uiCopy.publication.publicationWorkspaceHint}
            </p>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="font-sans text-xs uppercase tracking-[0.22em] text-muted-foreground">
                  {copy.submission.authorLabel}
                </p>
                <p className="mt-2 font-serif text-lg">
                  {submission.author.name || (locale === "zh" ? "未填写姓名" : "No name provided")}
                </p>
              </div>
              <div>
                <p className="font-sans text-xs uppercase tracking-[0.22em] text-muted-foreground">
                  {copy.submission.emailLabel}
                </p>
                <p className="mt-2 font-serif text-lg">{submission.author.email}</p>
              </div>
              <div>
                <p className="font-sans text-xs uppercase tracking-[0.22em] text-muted-foreground">
                  {copy.submission.statusLabel}
                </p>
                <p className="mt-2 font-serif text-lg">
                  {getSubmissionStatusLabel(submission.status, locale)}
                </p>
              </div>
              <div>
                <p className="font-sans text-xs uppercase tracking-[0.22em] text-muted-foreground">
                  {uiCopy.publication.currentStateLabel}
                </p>
                <div className="mt-2">
                  <PublicationStateBadge locale={locale} state={publicationState} />
                </div>
              </div>
              <div>
                <p className="font-sans text-xs uppercase tracking-[0.22em] text-muted-foreground">
                  {copy.submission.languageLabel}
                </p>
                <p className="mt-2 font-serif text-lg">
                  {submission.publicationLocale ||
                    submission.manuscriptLanguage ||
                    (locale === "zh" ? "未填写" : "Not specified")}
                </p>
              </div>
              <div>
                <p className="font-sans text-xs uppercase tracking-[0.22em] text-muted-foreground">
                  {copy.submission.latestVersionLabel}
                </p>
                <p className="mt-2 font-serif text-lg">v{latestVersion}</p>
              </div>
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
                  {uiCopy.editorialReview.publishedAtLabel}
                </p>
                <p className="mt-2 font-serif text-lg">
                  {submission.publishedAt
                    ? formatDate(submission.publishedAt.toISOString(), locale)
                    : locale === "zh"
                      ? "尚未发布"
                    : "Not published"}
                </p>
              </div>
              <div>
                <p className="font-sans text-xs uppercase tracking-[0.22em] text-muted-foreground">
                  {locale === "zh" ? "期次编排" : "Issue placement"}
                </p>
                <p className="mt-2 font-serif text-lg">
                  {submission.publicationYear &&
                  submission.publicationVolume &&
                  submission.publicationIssue
                    ? locale === "zh"
                      ? `${submission.publicationYear} / 第 ${submission.publicationVolume} 卷 / 第 ${submission.publicationIssue} 期`
                      : `${submission.publicationYear} / Vol. ${submission.publicationVolume} / Issue ${submission.publicationIssue}`
                    : locale === "zh"
                      ? "尚未分配期次"
                      : "Not assigned to an issue yet"}
                </p>
              </div>
            </div>

            <SubmissionStructuredContent
              locale={locale}
              title={submission.publicationTitle || submission.title}
              byline={submission.author.name || submission.author.email}
              manuscriptId={submission.publicId}
              language={submission.publicationLocale || submission.manuscriptLanguage}
              abstract={submission.abstract}
              keywords={submission.keywords}
              coverLetter={submission.coverLetter}
              introduction={submission.introduction}
              mainContent={submission.mainContent}
              conclusion={submission.conclusion}
              references={submission.references}
            />
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader className="space-y-4">
              <CardTitle>{uiCopy.publication.metadataTitle}</CardTitle>
              <p className="font-serif text-lg leading-relaxed text-muted-foreground">
                {uiCopy.publication.metadataBody}
              </p>
            </CardHeader>
            <CardContent className="space-y-5">
              <form action={updatePublicationSettingsAction} className="space-y-5">
                <input type="hidden" name="locale" value={locale} />
                <input type="hidden" name="publicId" value={publicId} />
                <input
                  type="hidden"
                  name="returnPath"
                  value={`/${locale}/editor/publications/${publicId}`}
                />

                <div className="grid gap-4 md:grid-cols-2">
                  <label className="flex items-center gap-3 rounded-[24px] border border-border/60 px-4 py-4">
                    <input
                      type="checkbox"
                      name="isPublicationReady"
                      defaultChecked={submission.isPublicationReady}
                      className="h-4 w-4 rounded border-border"
                    />
                    <span className="font-serif text-lg">
                      {uiCopy.publication.publicationReadyLabel}
                    </span>
                  </label>
                  <label className="flex items-center gap-3 rounded-[24px] border border-border/60 px-4 py-4">
                    <input
                      type="checkbox"
                      name="isPublished"
                      defaultChecked={Boolean(submission.publishedAt)}
                      className="h-4 w-4 rounded border-border"
                    />
                    <span className="font-serif text-lg">
                      {uiCopy.publication.publishedLabel}
                    </span>
                  </label>
                </div>

                <div className="space-y-2">
                  <label className="font-sans text-xs uppercase tracking-[0.22em] text-muted-foreground">
                    {uiCopy.publication.publicationSlugLabel}
                  </label>
                  <Input
                    name="publicationSlug"
                    defaultValue={submission.publicationSlug ?? ""}
                    placeholder="issue-essay-slug"
                  />
                </div>

                <div className="space-y-2">
                  <label className="font-sans text-xs uppercase tracking-[0.22em] text-muted-foreground">
                    {uiCopy.publication.publicationTitleLabel}
                  </label>
                  <Input
                    name="publicationTitle"
                    defaultValue={submission.publicationTitle ?? ""}
                    placeholder={submission.title}
                  />
                </div>

                <div className="space-y-2">
                  <label className="font-sans text-xs uppercase tracking-[0.22em] text-muted-foreground">
                    {uiCopy.publication.publicationExcerptLabel}
                  </label>
                  <Textarea
                    name="publicationExcerpt"
                    className="min-h-[140px]"
                    defaultValue={submission.publicationExcerpt ?? submission.abstract ?? ""}
                  />
                </div>

                <div className="space-y-2">
                  <label className="font-sans text-xs uppercase tracking-[0.22em] text-muted-foreground">
                    {uiCopy.publication.publicationTagsLabel}
                  </label>
                  <Input name="keywords" defaultValue={tagValue} />
                  <p className="font-serif text-base text-muted-foreground">
                    {uiCopy.publication.publicationTagsHint}
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="font-sans text-xs uppercase tracking-[0.22em] text-muted-foreground">
                      {uiCopy.publication.publicationLocaleLabel}
                    </label>
                    <select
                      name="publicationLocale"
                      defaultValue={submission.publicationLocale ?? ""}
                      className="h-11 w-full rounded-[24px] border border-border bg-background/70 px-4 font-sans text-sm text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <option value="">{locale === "zh" ? "沿用稿件语言" : "Use manuscript locale"}</option>
                      {publicationLocaleValues.map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))}
                    </select>
                    <p className="font-serif text-base text-muted-foreground">
                      {uiCopy.publication.publicationLocaleHint}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <label className="font-sans text-xs uppercase tracking-[0.22em] text-muted-foreground">
                      {uiCopy.publication.publishedAtLabel}
                    </label>
                    <Input
                      name="publishedAt"
                      type="datetime-local"
                      defaultValue={toDatetimeLocal(submission.publishedAt)}
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-2">
                    <label className="font-sans text-xs uppercase tracking-[0.22em] text-muted-foreground">
                      {uiCopy.publication.publicationVolumeLabel}
                    </label>
                    <Input
                      name="publicationVolume"
                      defaultValue={submission.publicationVolume ?? ""}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="font-sans text-xs uppercase tracking-[0.22em] text-muted-foreground">
                      {uiCopy.publication.publicationIssueLabel}
                    </label>
                    <Input
                      name="publicationIssue"
                      defaultValue={submission.publicationIssue ?? ""}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="font-sans text-xs uppercase tracking-[0.22em] text-muted-foreground">
                      {uiCopy.publication.publicationYearLabel}
                    </label>
                    <Input
                      name="publicationYear"
                      inputMode="numeric"
                      defaultValue={submission.publicationYear ?? ""}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="font-sans text-xs uppercase tracking-[0.22em] text-muted-foreground">
                    {uiCopy.publication.seoTitleLabel}
                  </label>
                  <Input name="seoTitle" defaultValue={submission.seoTitle ?? ""} />
                </div>

                <div className="space-y-2">
                  <label className="font-sans text-xs uppercase tracking-[0.22em] text-muted-foreground">
                    {uiCopy.publication.seoDescriptionLabel}
                  </label>
                  <Textarea
                    name="seoDescription"
                    className="min-h-[140px]"
                    defaultValue={submission.seoDescription ?? ""}
                  />
                </div>

                <FormSubmitButton
                  type="submit"
                  size="lg"
                  className="w-full"
                  idleLabel={uiCopy.publication.savePublicationLabel}
                  pendingLabel={uiCopy.publication.savingPublicationLabel}
                />
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="space-y-4">
              <CardTitle>{uiCopy.publication.exportTitle}</CardTitle>
              <p className="font-serif text-lg leading-relaxed text-muted-foreground">
                {uiCopy.publication.exportBody}
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <PublicationExportPanel locale={locale} publicId={publicId} />
              <Button asChild variant="ghost" className="w-full justify-center">
                <LocaleLink locale={locale} href={`/editor/submissions/${publicId}`}>
                  {uiCopy.publication.reviewWorkspaceLinkLabel}
                </LocaleLink>
              </Button>
              {submission.publicationYear &&
              submission.publicationVolume &&
              submission.publicationIssue ? (
                <Button asChild variant="ghost" className="w-full justify-center">
                  <LocaleLink
                    locale={locale}
                    href={`/editor/issues/${submission.publicationYear}/${encodeURIComponent(submission.publicationVolume ?? "")}/${encodeURIComponent(submission.publicationIssue ?? "")}`}
                  >
                    {locale === "zh" ? "查看所属期次" : "Open issue group"}
                  </LocaleLink>
                </Button>
              ) : null}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="space-y-4">
              <CardTitle>{uiCopy.editor.filesTitle}</CardTitle>
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
                  {
                    kind: "source",
                    fileName: submission.sourceArchiveFileName,
                    mimeType: submission.sourceArchiveMimeType,
                    sizeBytes: submission.sourceArchiveSizeBytes,
                    href: `/api/submissions/${publicId}/assets/source`,
                  },
                ]}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="space-y-4">
              <CardTitle>{uiCopy.editor.versionsTitle}</CardTitle>
            </CardHeader>
            <CardContent>
              <SubmissionVersionList locale={locale} versions={submission.versions} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="space-y-4">
              <CardTitle>{locale === "zh" ? "出版审计记录" : "Publication audit trail"}</CardTitle>
              <p className="font-serif text-lg leading-relaxed text-muted-foreground">
                {locale === "zh"
                  ? "记录是谁更新了出版元数据、谁将稿件标记为可发布，以及谁写入了发布时间。"
                  : "Track who updated publication metadata, who marked the manuscript publication-ready, and who recorded the publication timestamp."}
              </p>
            </CardHeader>
            <CardContent>
              <PublicationAuditTrail
                locale={locale}
                items={submission.publicationAuditEvents}
              />
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
                isDraft={false}
              />
            </CardContent>
          </Card>
        </div>
      </section>
    </DashboardShell>
  );
}
