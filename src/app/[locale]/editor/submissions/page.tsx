import type { SubmissionStatus } from "@prisma/client";
import { unstable_noStore as noStore } from "next/cache";
import { setRequestLocale } from "next-intl/server";

import { requireEditorUser } from "@/lib/auth-guards";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { LocaleLink } from "@/components/locale-link";
import { PublicationStateBadge } from "@/components/submissions/publication-state-badge";
import { SubmissionStatusBadge } from "@/components/submissions/submission-status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { Locale } from "@/i18n/routing";
import { getPlatformCopy } from "@/lib/platform-copy";
import {
  getPublicationPipelineState,
  getSubmissionStatusLabel,
} from "@/lib/submission-status";
import { getSubmissionUiCopy } from "@/lib/submission-ui-copy";
import { listEditorialSubmissions } from "@/lib/submissions";
import { formatDate } from "@/lib/site";
import { manuscriptLanguages } from "@/lib/validations/submission";

type EditorSubmissionsPageProps = {
  params: {
    locale: Locale;
  };
  searchParams?: {
    status?: string;
    language?: string;
    q?: string;
  };
};

const statusFilters: SubmissionStatus[] = [
  "SUBMITTED",
  "UNDER_REVIEW",
  "REVISION_REQUESTED",
  "ACCEPTED",
  "REJECTED",
];

export default async function EditorSubmissionsPage({
  params,
  searchParams,
}: EditorSubmissionsPageProps) {
  const { locale } = params;
  noStore();
  setRequestLocale(locale);

  await requireEditorUser(locale, `/${locale}/editor/submissions`);

  const status =
    searchParams?.status && statusFilters.includes(searchParams.status as SubmissionStatus)
      ? (searchParams.status as SubmissionStatus)
      : "ALL";
  const language =
    searchParams?.language &&
    manuscriptLanguages.includes(searchParams.language as (typeof manuscriptLanguages)[number])
      ? searchParams.language
      : "all";
  const query = searchParams?.q?.trim() ?? "";

  const copy = getPlatformCopy(locale);
  const uiCopy = getSubmissionUiCopy(locale);
  const submissions = await listEditorialSubmissions({ status, language, query });
  const hasActiveFilters = status !== "ALL" || language !== "all" || Boolean(query);

  return (
    <DashboardShell
      locale={locale}
      title={copy.editor.queueTitle}
      intro={copy.editor.intro}
      navItems={[
        {
          href: "/editor",
          label: locale === "zh" ? "概览" : "Overview",
        },
        {
          href: "/editor/submissions",
          label: copy.editor.queueTitle,
          active: true,
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
      <div className="space-y-6">
        <Card>
          <CardHeader className="space-y-4">
            <CardTitle>{uiCopy.editor.filtersTitle}</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="grid gap-4 md:grid-cols-[1.2fr_1fr_1fr_auto] md:items-end">
              <div className="space-y-2">
                <label className="font-sans text-xs uppercase tracking-[0.22em] text-muted-foreground">
                  {locale === "zh" ? "搜索标题、编号、作者或关键词" : "Search title, ID, author or keywords"}
                </label>
                <Input
                  name="q"
                  defaultValue={query}
                  placeholder={locale === "zh" ? "例如：FJ- 或 contributor" : "For example: FJ- or contributor"}
                />
              </div>
              <div className="space-y-2">
                <label className="font-sans text-xs uppercase tracking-[0.22em] text-muted-foreground">
                  {uiCopy.editor.statusFilterLabel}
                </label>
                <select
                  name="status"
                  defaultValue={status}
                  className="h-11 w-full rounded-[24px] border border-border bg-background/70 px-4 font-sans text-sm text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="ALL">{uiCopy.editor.allStatuses}</option>
                  {statusFilters.map((item) => (
                    <option key={item} value={item}>
                      {getSubmissionStatusLabel(item, locale)}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="font-sans text-xs uppercase tracking-[0.22em] text-muted-foreground">
                  {uiCopy.editor.languageFilterLabel}
                </label>
                <select
                  name="language"
                  defaultValue={language}
                  className="h-11 w-full rounded-[24px] border border-border bg-background/70 px-4 font-sans text-sm text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="all">{uiCopy.editor.allLanguages}</option>
                  {manuscriptLanguages.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3">
                <Button type="submit" size="sm">
                  {uiCopy.editor.applyFiltersLabel}
                </Button>
                {hasActiveFilters ? (
                  <Button asChild variant="outline" size="sm">
                    <LocaleLink locale={locale} href="/editor/submissions">
                      {locale === "zh" ? "清除" : "Reset"}
                    </LocaleLink>
                  </Button>
                ) : null}
              </div>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{copy.editor.queueTitle}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {submissions.length ? (
              submissions.map((submission) => (
                <div
                  key={submission.publicId}
                  className="rounded-[24px] border border-border/60 px-5 py-4"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="space-y-3">
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
                      <div className="flex flex-wrap gap-3 font-sans text-xs uppercase tracking-[0.2em] text-muted-foreground">
                        <span>{formatDate(submission.updatedAt.toISOString(), locale)}</span>
                        <span>{submission.publicId}</span>
                        <span>
                          {submission.manuscriptLanguage ||
                            (locale === "zh" ? "语言未填" : "No language")}
                        </span>
                        <span>
                          {submission.manuscriptFileName
                            ? locale === "zh"
                              ? "有稿件文件"
                              : "Manuscript file"
                            : locale === "zh"
                              ? "无稿件文件"
                              : "No manuscript file"}
                        </span>
                        <span>
                          {locale === "zh" ? "审稿人" : "Reviewers"}:{" "}
                          {submission._count.reviewerAssignments}
                        </span>
                        <span>
                          {locale === "zh" ? "审稿意见" : "Reviews"}: {submission._count.reviews}
                        </span>
                        {submission.status === "ACCEPTED" ? (
                          <PublicationStateBadge
                            locale={locale}
                            state={getPublicationPipelineState(submission)}
                          />
                        ) : null}
                      </div>
                    </div>
                    <div className="flex flex-col gap-3 sm:items-end">
                      <SubmissionStatusBadge locale={locale} status={submission.status} />
                      <Button asChild variant="outline" size="sm">
                        <LocaleLink
                          locale={locale}
                          href={`/editor/submissions/${submission.publicId}`}
                        >
                          {copy.submission.detailTitle}
                        </LocaleLink>
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-[24px] border border-border/60 px-5 py-6">
                <p className="font-serif text-lg text-muted-foreground">
                  {hasActiveFilters
                    ? locale === "zh"
                      ? "当前筛选条件下没有匹配稿件。"
                      : "No submissions match the current filters."
                    : copy.editor.emptyBody}
                </p>
                <p className="mt-4 font-sans text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  {hasActiveFilters
                    ? locale === "zh"
                      ? "可调整搜索词、状态或语言筛选后重试。"
                      : "Adjust the query, status or language filters to broaden the queue."
                    : locale === "zh"
                      ? "当前不需要执行状态更新。"
                      : "No status changes are waiting for editorial action."}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  );
}
