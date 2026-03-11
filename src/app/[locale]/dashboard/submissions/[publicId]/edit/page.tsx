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
import { ManuscriptDocumentView } from "@/components/submissions/manuscript-document-view";
import { SubmissionMetadataSummary } from "@/components/submissions/submission-metadata-summary";
import { SubmissionFilePanel } from "@/components/submissions/submission-file-panel";
import { SubmissionStatusBadge } from "@/components/submissions/submission-status-badge";
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
import { loadStoredManuscriptPreview } from "@/lib/manuscript-preview";
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

function formatBytes(sizeBytes: number | null, locale: Locale) {
  if (!sizeBytes) {
    return locale === "zh" ? "尚未上传" : "Not uploaded yet";
  }

  if (sizeBytes < 1024) {
    return `${sizeBytes} B`;
  }

  if (sizeBytes < 1024 * 1024) {
    return `${Math.round(sizeBytes / 1024)} KB`;
  }

  return `${(sizeBytes / (1024 * 1024)).toFixed(1)} MB`;
}

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
  const manuscriptPreview = await loadStoredManuscriptPreview({
    fileName: submission.manuscriptFileName,
    mimeType: submission.manuscriptMimeType,
    storageKey: submission.manuscriptStorageKey,
    storageProvider: submission.manuscriptStorageProvider,
    inlineUrl: `/api/submissions/${publicId}/assets/manuscript?inline=1`,
    downloadUrl: `/api/submissions/${publicId}/assets/manuscript`,
  });
  const readinessItems = [
    {
      done: submission.title.trim().length >= 3,
      label:
        locale === "zh"
          ? "稿件标题已经填写。"
          : "The manuscript title is in place.",
    },
    {
      done: (submission.abstract?.trim().length ?? 0) >= 50,
      label:
        locale === "zh"
          ? "摘要已具备送审所需的基本信息。"
          : "The abstract is detailed enough for screening.",
    },
    {
      done: submission.keywords.length >= 1,
      label:
        locale === "zh"
          ? "关键词已填写。"
          : "Keywords have been provided.",
    },
    {
      done: Boolean(submission.manuscriptLanguage),
      label:
        locale === "zh"
          ? "稿件语言已标记。"
          : "The manuscript language has been selected.",
    },
    {
      done: Boolean(submission.manuscriptFileName),
      label:
        locale === "zh"
          ? "正式稿 PDF 已上传。"
          : "The final manuscript PDF has been uploaded.",
    },
  ];
  const readyToSubmit = readinessItems.every((item) => item.done);

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
              {locale === "zh"
                ? "作者后台现在只处理投稿元数据、附信与正式稿 PDF。正文版式以作者上传的 PDF 为准，不再要求在平台内重复粘贴论文全文。"
                : "The author workspace now handles submission metadata, cover letter, and the final manuscript PDF. The paper layout is taken from the uploaded PDF rather than duplicated inside the platform."}
            </p>
          </CardHeader>
          <CardContent>
            <form
              action={saveDraftAction}
              className="space-y-5"
              data-testid="submission-edit-form"
            >
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
                  data-testid="submission-title"
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
                  data-testid="submission-abstract"
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
                  data-testid="submission-keywords"
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
                  data-testid="submission-cover-letter"
                />
                <p className="font-serif text-base text-muted-foreground">
                  {locale === "zh"
                    ? "附信仅供编辑初筛使用，不会作为公开论文正文的一部分展示给读者。"
                    : "The cover letter is for editorial screening only and is not shown as part of the public article."}
                </p>
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
                    data-testid="submission-language"
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
                  data-testid="submission-save-button"
                  idleLabel={copy.submission.saveDraftLabel}
                  pendingLabel={
                    locale === "zh" ? "保存投稿信息..." : "Saving submission details..."
                  }
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
              <CardTitle>{locale === "zh" ? "稿件 PDF" : "Manuscript PDF"}</CardTitle>
              <p className="font-serif text-lg leading-relaxed text-muted-foreground">
                {locale === "zh"
                  ? "作者只需上传正式送审版 PDF。Word、LaTeX 等源文件不再作为常规投稿入口的一部分。"
                  : "Authors now upload only the review-ready PDF manuscript. Word and LaTeX source files are no longer part of the routine submission form."}
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
                ]}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="space-y-4">
              <CardTitle>{locale === "zh" ? "提交检查" : "Submission checklist"}</CardTitle>
              <p className="font-serif text-lg leading-relaxed text-muted-foreground">
                {locale === "zh"
                  ? "主流期刊通常先要一份可审稿的 PDF，再进入编辑初筛与外审。只要下面这些项目就绪，就可以正式提交。"
                  : "Most journals ask for a review-ready PDF first, then move into editorial screening and peer review. Once these items are complete, the manuscript can be submitted."}
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-3">
                {readinessItems.map((item) => (
                  <li
                    key={item.label}
                    className="flex items-start gap-3 rounded-[20px] border border-border/60 px-4 py-4"
                  >
                    <span
                      className={`mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold ${item.done ? "bg-foreground text-background" : "border border-border text-muted-foreground"}`}
                    >
                      {item.done ? "✓" : "·"}
                    </span>
                    <span className="font-serif text-base leading-7 text-foreground/90">
                      {item.label}
                    </span>
                  </li>
                ))}
              </ul>
              <SubmissionMetadataSummary
                locale={locale}
                abstract={submission.abstract}
                keywords={submission.keywords}
                coverLetter={submission.coverLetter}
                details={[
                  {
                    label: locale === "zh" ? "稿件语言" : "Language",
                    value: submission.manuscriptLanguage,
                  },
                  {
                    label: locale === "zh" ? "当前 PDF" : "Current PDF",
                    value: submission.manuscriptFileName,
                  },
                  {
                    label: locale === "zh" ? "文件大小" : "File size",
                    value: formatBytes(submission.manuscriptSizeBytes, locale),
                  },
                  {
                    label: locale === "zh" ? "投稿编号" : "Submission ID",
                    value: submission.publicId,
                  },
                ]}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="space-y-4">
              <CardTitle>{copy.submission.submitManuscriptLabel}</CardTitle>
              <p className="font-serif text-lg leading-relaxed text-muted-foreground">
                {locale === "zh"
                  ? readyToSubmit
                    ? "正式提交后，稿件会进入编辑初筛。此后作者无法继续改动，直到编辑要求返修。"
                    : "请先补齐标题、摘要、关键词、语言和稿件 PDF，再提交到编辑部。"
                  : readyToSubmit
                    ? "After submission, the manuscript moves into editorial screening and locks until the editors request a revision."
                    : "Complete the title, abstract, keywords, language, and manuscript PDF before submitting to the editorial desk."}
              </p>
            </CardHeader>
            <CardContent>
              <form action={submitDraftAction} data-testid="submission-send-form">
                <input type="hidden" name="locale" value={locale} />
                <input type="hidden" name="publicId" value={publicId} />
                <FormSubmitButton
                  type="submit"
                  size="lg"
                  className="w-full"
                  disabled={!isEditable || !readyToSubmit}
                  data-testid="submission-send-button"
                  idleLabel={copy.submission.submitManuscriptLabel}
                  pendingLabel={locale === "zh" ? "提交投稿..." : "Submitting manuscript..."}
                />
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {manuscriptPreview ? (
        <section className="space-y-4">
          <div className="max-w-3xl">
            <p className="section-kicker">
              {locale === "zh" ? "MANUSCRIPT PDF" : "MANUSCRIPT PDF"}
            </p>
            <h2 className="mt-3 font-display text-3xl leading-tight sm:text-4xl">
              {locale === "zh" ? "作者提交的正式稿预览" : "Submitted manuscript preview"}
            </h2>
          </div>
          <ManuscriptDocumentView
            locale={locale}
            preview={manuscriptPreview}
            showDownloadLink={false}
          />
        </section>
      ) : null}
    </DashboardShell>
  );
}
