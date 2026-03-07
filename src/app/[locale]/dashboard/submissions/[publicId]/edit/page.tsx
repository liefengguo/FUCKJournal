import { unstable_noStore as noStore } from "next/cache";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";

import {
  saveDraftAction,
  submitDraftAction,
} from "@/app/actions/submissions";
import { requireContributorUser } from "@/lib/auth-guards";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { FlashMessage } from "@/components/dashboard/flash-message";
import { LocaleLink } from "@/components/locale-link";
import { SubmissionFilePanel } from "@/components/submissions/submission-file-panel";
import { SubmissionStatusBadge } from "@/components/submissions/submission-status-badge";
import { SubmissionVersionList } from "@/components/submissions/submission-version-list";
import { Button } from "@/components/ui/button";
import { FormSubmitButton } from "@/components/ui/form-submit-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { Locale } from "@/i18n/routing";
import {
  getSubmissionError,
  getSubmissionNotice,
} from "@/lib/feedback";
import { getPlatformCopy } from "@/lib/platform-copy";
import { canAuthorEditStatus } from "@/lib/submission-status";
import { getSubmissionUiCopy } from "@/lib/submission-ui-copy";
import { getAuthorSubmissionDetail } from "@/lib/submissions";
import { manuscriptLanguages } from "@/lib/validations/submission";

type EditSubmissionPageProps = {
  params: {
    locale: Locale;
    publicId: string;
  };
  searchParams?: {
    notice?: string;
    error?: string;
  };
};

export default async function EditSubmissionPage({
  params,
  searchParams,
}: EditSubmissionPageProps) {
  const { locale, publicId } = params;
  noStore();
  setRequestLocale(locale);

  const user = await requireContributorUser(
    locale,
    `/${locale}/dashboard/submissions/${publicId}/edit`,
  );
  const submission = await getAuthorSubmissionDetail(user.id, publicId);

  if (!submission) {
    notFound();
  }

  const copy = getPlatformCopy(locale);
  const uiCopy = getSubmissionUiCopy(locale);
  const isEditable = canAuthorEditStatus(submission.status);
  const notice = getSubmissionNotice(locale, searchParams?.notice);
  const errorMessage = getSubmissionError(locale, searchParams?.error);

  return (
    <DashboardShell
      locale={locale}
      title={copy.submission.editTitle}
      intro={copy.submission.editIntro}
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
          <Button asChild variant="outline" size="sm">
            <LocaleLink locale={locale} href={`/dashboard/submissions/${publicId}`}>
              {copy.submission.detailTitle}
            </LocaleLink>
          </Button>
          <SignOutButton locale={locale} label={locale === "zh" ? "退出" : "Sign out"} />
        </>
      }
    >
      {notice ? <FlashMessage message={notice} /> : null}
      {errorMessage ? <FlashMessage message={errorMessage} tone="error" /> : null}

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardHeader className="space-y-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <CardTitle>
                {submission.title || (locale === "zh" ? "未命名稿件" : "Untitled manuscript")}
              </CardTitle>
              <SubmissionStatusBadge locale={locale} status={submission.status} />
            </div>
            <p className="font-serif text-lg leading-relaxed text-muted-foreground">
              {uiCopy.fields.structureBody}
            </p>
          </CardHeader>
          <CardContent>
            <form action={saveDraftAction} className="space-y-5">
              <input type="hidden" name="locale" value={locale} />
              <input type="hidden" name="publicId" value={publicId} />
              <div className="space-y-2">
                <label className="font-sans text-xs uppercase tracking-[0.22em] text-muted-foreground">
                  {copy.submission.titleLabel}
                </label>
                <Input
                  name="title"
                  defaultValue={submission.title}
                  disabled={!isEditable}
                />
              </div>
              <div className="space-y-2">
                <label className="font-sans text-xs uppercase tracking-[0.22em] text-muted-foreground">
                  {copy.submission.abstractLabel}
                </label>
                <Textarea
                  name="abstract"
                  defaultValue={submission.abstract ?? ""}
                  disabled={!isEditable}
                />
              </div>
              <div className="space-y-2">
                <label className="font-sans text-xs uppercase tracking-[0.22em] text-muted-foreground">
                  {uiCopy.fields.keywordsLabel}
                </label>
                <Input
                  name="keywords"
                  defaultValue={submission.keywords.join(", ")}
                  disabled={!isEditable}
                  required={submission.status !== "DRAFT"}
                />
                <p className="font-serif text-base text-muted-foreground">
                  {uiCopy.fields.keywordsHint}
                </p>
              </div>
              <div className="space-y-2">
                <label className="font-sans text-xs uppercase tracking-[0.22em] text-muted-foreground">
                  {copy.submission.coverLetterLabel}
                </label>
                <Textarea
                  name="coverLetter"
                  defaultValue={submission.coverLetter ?? ""}
                  disabled={!isEditable}
                  className="min-h-[180px]"
                />
              </div>
              <div className="space-y-2">
                <label className="font-sans text-xs uppercase tracking-[0.22em] text-muted-foreground">
                  {uiCopy.fields.introductionLabel}
                </label>
                <Textarea
                  name="introduction"
                  defaultValue={submission.introduction ?? ""}
                  disabled={!isEditable}
                  className="min-h-[180px]"
                />
              </div>
              <div className="space-y-2">
                <label className="font-sans text-xs uppercase tracking-[0.22em] text-muted-foreground">
                  {uiCopy.fields.mainContentLabel}
                </label>
                <Textarea
                  name="mainContent"
                  defaultValue={submission.mainContent ?? ""}
                  disabled={!isEditable}
                  className="min-h-[320px]"
                  required={submission.status !== "DRAFT"}
                />
              </div>
              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="font-sans text-xs uppercase tracking-[0.22em] text-muted-foreground">
                    {uiCopy.fields.conclusionLabel}
                  </label>
                  <Textarea
                    name="conclusion"
                    defaultValue={submission.conclusion ?? ""}
                    disabled={!isEditable}
                    className="min-h-[180px]"
                  />
                </div>
                <div className="space-y-2">
                  <label className="font-sans text-xs uppercase tracking-[0.22em] text-muted-foreground">
                    {uiCopy.fields.referencesLabel}
                  </label>
                  <Textarea
                    name="references"
                    defaultValue={submission.references ?? ""}
                    disabled={!isEditable}
                    className="min-h-[180px]"
                  />
                </div>
              </div>
              <div className="grid gap-5 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="font-sans text-xs uppercase tracking-[0.22em] text-muted-foreground">
                    {copy.submission.languageLabel}
                  </label>
                  <select
                    name="manuscriptLanguage"
                    defaultValue={submission.manuscriptLanguage ?? ""}
                    disabled={!isEditable}
                    className="h-11 w-full rounded-[24px] border border-border bg-background/70 px-4 font-sans text-sm text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <option value="">{locale === "zh" ? "请选择" : "Select"}</option>
                    {manuscriptLanguages.map((language) => (
                      <option key={language} value={language}>
                        {language}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex flex-wrap gap-3 pt-2">
                <FormSubmitButton
                  type="submit"
                  size="lg"
                  disabled={!isEditable}
                  idleLabel={copy.submission.saveDraftLabel}
                  pendingLabel={locale === "zh" ? "保存中..." : "Saving draft..."}
                />
                <Button asChild variant="outline" size="lg">
                  <LocaleLink locale={locale} href={`/dashboard/submissions/${publicId}`}>
                    {copy.submission.backToDashboardLabel}
                  </LocaleLink>
                </Button>
                <Button asChild variant="ghost" size="lg">
                  <LocaleLink locale={locale} href="/templates">
                    {locale === "zh" ? "查看模板" : "View templates"}
                  </LocaleLink>
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader className="space-y-4">
              <CardTitle>{uiCopy.uploads.sectionTitle}</CardTitle>
              <p className="font-serif text-lg leading-relaxed text-muted-foreground">
                {uiCopy.uploads.sectionBody}
              </p>
            </CardHeader>
            <CardContent className="space-y-3">
              <SubmissionFilePanel
                locale={locale}
                publicId={publicId}
                editable={isEditable}
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
              <CardTitle>{uiCopy.versions.sectionTitle}</CardTitle>
              <p className="font-serif text-lg leading-relaxed text-muted-foreground">
                {uiCopy.versions.sectionBody}
              </p>
            </CardHeader>
            <CardContent>
              <SubmissionVersionList locale={locale} versions={submission.versions} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="space-y-4">
              <CardTitle>{copy.submission.submitManuscriptLabel}</CardTitle>
              <p className="font-serif text-lg leading-relaxed text-muted-foreground">
                {locale === "zh"
                  ? "提交后，作者将无法继续编辑，直到编辑团队要求修改。"
                  : "After submission, the manuscript locks for authors until the editorial team requests revisions."}
              </p>
            </CardHeader>
            <CardContent>
              <form action={submitDraftAction}>
                <input type="hidden" name="locale" value={locale} />
                <input type="hidden" name="publicId" value={publicId} />
                <FormSubmitButton
                  type="submit"
                  size="lg"
                  className="w-full"
                  disabled={!isEditable}
                  idleLabel={copy.submission.submitManuscriptLabel}
                  pendingLabel={locale === "zh" ? "提交中..." : "Submitting manuscript..."}
                />
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </DashboardShell>
  );
}
