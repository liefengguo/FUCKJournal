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
import { Input } from "@/components/ui/input";
import type { Locale } from "@/i18n/routing";
import { getSubmissionError, getSubmissionNotice } from "@/lib/feedback";
import { getPlatformCopy } from "@/lib/platform-copy";
import {
  getPublicationPipelineState,
  type PublicationPipelineState,
  publicationPipelineStates,
} from "@/lib/submission-status";
import { getSubmissionUiCopy } from "@/lib/submission-ui-copy";
import { listPublicationSubmissions } from "@/lib/submissions";
import { formatDate } from "@/lib/site";
import { publicationLocaleValues } from "@/lib/validations/publication";

type EditorPublicationsPageProps = {
  params: {
    locale: Locale;
  };
  searchParams?: {
    state?: string;
    locale?: string;
    year?: string;
    q?: string;
    notice?: string;
    error?: string;
  };
};

export const dynamic = "force-dynamic";

export default async function EditorPublicationsPage({
  params,
  searchParams,
}: EditorPublicationsPageProps) {
  const { locale } = params;
  noStore();
  setRequestLocale(locale);

  await requireEditorUser(locale, `/${locale}/editor/publications`);

  const state =
    searchParams?.state &&
    publicationPipelineStates.includes(
      searchParams.state as PublicationPipelineState,
    )
      ? (searchParams.state as PublicationPipelineState)
      : "ALL";
  const publicationLocale =
    searchParams?.locale &&
    publicationLocaleValues.includes(
      searchParams.locale as (typeof publicationLocaleValues)[number],
    )
      ? searchParams.locale
      : "all";
  const publicationYear =
    searchParams?.year && /^\d{4}$/.test(searchParams.year)
      ? Number(searchParams.year)
      : "all";
  const query = searchParams?.q?.trim() ?? "";

  const [allSubmissions, submissions] = await Promise.all([
    listPublicationSubmissions(),
    listPublicationSubmissions({
      state,
      locale: publicationLocale,
      year: publicationYear,
      query,
    }),
  ]);

  const copy = getPlatformCopy(locale);
  const uiCopy = getSubmissionUiCopy(locale);
  const notice = getSubmissionNotice(locale, searchParams?.notice);
  const errorMessage = getSubmissionError(locale, searchParams?.error);
  const hasActiveFilters =
    state !== "ALL" ||
    publicationLocale !== "all" ||
    publicationYear !== "all" ||
    Boolean(query);
  const availableYears = Array.from(
    new Set(allSubmissions.map((submission) => submission.publicationYear).filter(Boolean)),
  ).sort((left, right) => (right ?? 0) - (left ?? 0));
  const counts = allSubmissions.reduce(
    (accumulator, submission) => {
      const pipelineState = getPublicationPipelineState(submission);

      if (pipelineState === "PUBLISHED") {
        accumulator.published += 1;
      } else if (pipelineState === "READY") {
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
      title={copy.editor.publicationsTitle}
      intro={uiCopy.publication.queueBody}
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
            <LocaleLink locale={locale} href="/editor/submissions">
              {copy.editor.queueTitle}
            </LocaleLink>
          </Button>
          <SignOutButton locale={locale} label={locale === "zh" ? "退出" : "Sign out"} />
        </>
      }
    >
      {notice ? <FlashMessage message={notice} /> : null}
      {errorMessage ? <FlashMessage message={errorMessage} tone="error" /> : null}

      <section className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">
              {copy.editor.publicationPendingCountLabel}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-display text-5xl">{counts.pending}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">
              {copy.editor.publicationReadyCountLabel}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-display text-5xl">{counts.ready}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">{copy.editor.publishedCountLabel}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-display text-5xl">{counts.published}</p>
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardHeader className="space-y-4">
          <CardTitle>{uiCopy.publication.queueTitle}</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4 md:grid-cols-[1.25fr_0.9fr_0.9fr_0.8fr_auto] md:items-end">
            <div className="space-y-2">
              <label className="font-sans text-xs uppercase tracking-[0.22em] text-muted-foreground">
                {locale === "zh" ? "搜索标题、slug、编号或作者" : "Search title, slug, ID or author"}
              </label>
              <Input
                name="q"
                defaultValue={query}
                placeholder={locale === "zh" ? "例如：issue 或 FJ-" : "For example: issue or FJ-"}
              />
            </div>
            <div className="space-y-2">
              <label className="font-sans text-xs uppercase tracking-[0.22em] text-muted-foreground">
                {uiCopy.publication.stateFilterLabel}
              </label>
              <select
                name="state"
                defaultValue={state}
                className="h-11 w-full rounded-[24px] border border-border bg-background/70 px-4 font-sans text-sm text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="ALL">{uiCopy.publication.allStates}</option>
                {publicationPipelineStates.map((item) => (
                  <option key={item} value={item}>
                    {locale === "zh"
                      ? item === "ACCEPTED_PENDING"
                        ? "已接收未准备"
                        : item === "READY"
                          ? "已进入出版准备"
                          : "已发布"
                      : item === "ACCEPTED_PENDING"
                        ? "Accepted, not ready"
                        : item === "READY"
                          ? "Publication-ready"
                          : "Published"}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="font-sans text-xs uppercase tracking-[0.22em] text-muted-foreground">
                {uiCopy.publication.localeFilterLabel}
              </label>
              <select
                name="locale"
                defaultValue={publicationLocale}
                className="h-11 w-full rounded-[24px] border border-border bg-background/70 px-4 font-sans text-sm text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="all">{uiCopy.publication.allLocales}</option>
                {publicationLocaleValues.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="font-sans text-xs uppercase tracking-[0.22em] text-muted-foreground">
                {locale === "zh" ? "年份" : "Year"}
              </label>
              <select
                name="year"
                defaultValue={publicationYear === "all" ? "all" : String(publicationYear)}
                className="h-11 w-full rounded-[24px] border border-border bg-background/70 px-4 font-sans text-sm text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="all">{locale === "zh" ? "全部年份" : "All years"}</option>
                {availableYears.map((year) => (
                  <option key={year} value={String(year)}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-3">
              <Button type="submit" size="sm">
                {locale === "zh" ? "应用筛选" : "Apply filters"}
              </Button>
              {hasActiveFilters ? (
                <Button asChild variant="outline" size="sm">
                  <LocaleLink locale={locale} href="/editor/publications">
                    {locale === "zh" ? "清除" : "Reset"}
                  </LocaleLink>
                </Button>
              ) : null}
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="space-y-4">
          <CardTitle>{copy.editor.publicationsTitle}</CardTitle>
          <p className="font-serif text-lg leading-relaxed text-muted-foreground">
            {locale === "zh"
              ? "accepted 稿件会在这里进入出版准备。issue 规划请转到期次规划页。"
              : "Accepted manuscripts move through publication preparation here. Use issue planning for grouped volume and issue management."}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {submissions.length ? (
            submissions.map((submission) => {
              const pipelineState = getPublicationPipelineState(submission);
              const displayTitle =
                submission.publicationTitle ||
                submission.title ||
                (locale === "zh" ? "未命名稿件" : "Untitled manuscript");

              return (
                <div
                  key={submission.publicId}
                  className="rounded-[24px] border border-border/60 px-5 py-4"
                >
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="space-y-3">
                      <LocaleLink
                        locale={locale}
                        href={`/editor/publications/${submission.publicId}`}
                        className="font-display text-2xl"
                      >
                        {displayTitle}
                      </LocaleLink>
                      <p className="font-serif text-base text-muted-foreground">
                        {submission.author.name || submission.author.email}
                      </p>
                      <div className="flex flex-wrap gap-3 font-sans text-xs uppercase tracking-[0.2em] text-muted-foreground">
                        <span>{formatDate(submission.updatedAt.toISOString(), locale)}</span>
                        <span>{submission.publicId}</span>
                        <span>
                          {submission.publicationLocale ||
                            submission.manuscriptLanguage ||
                            (locale === "zh" ? "语言未填" : "No locale")}
                        </span>
                        <span>
                          {submission.publicationSlug ||
                            (locale === "zh" ? "无 slug" : "No slug")}
                        </span>
                        <span>
                          {submission.publicationYear && submission.publicationVolume && submission.publicationIssue
                            ? locale === "zh"
                              ? `${submission.publicationYear} / 第 ${submission.publicationVolume} 卷 / 第 ${submission.publicationIssue} 期`
                              : `${submission.publicationYear} / Vol. ${submission.publicationVolume} / Issue ${submission.publicationIssue}`
                            : locale === "zh"
                              ? "未分配期次"
                              : "Issue unassigned"}
                        </span>
                        <span>
                          {locale === "zh" ? "版本" : "Versions"}: {submission._count.versions}
                        </span>
                        <span>
                          {locale === "zh" ? "审稿意见" : "Reviews"}: {submission._count.reviews}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-3 sm:items-end">
                      <SubmissionStatusBadge locale={locale} status={submission.status} />
                      <PublicationStateBadge locale={locale} state={pipelineState} />
                      <Button asChild variant="outline" size="sm">
                        <LocaleLink
                          locale={locale}
                          href={`/editor/publications/${submission.publicId}`}
                        >
                          {uiCopy.publication.openWorkspaceLabel}
                        </LocaleLink>
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="rounded-[24px] border border-border/60 px-5 py-6">
              <p className="font-serif text-lg text-muted-foreground">
                {hasActiveFilters
                  ? locale === "zh"
                    ? "当前筛选条件下没有匹配稿件。"
                    : "No publications match the current filters."
                  : uiCopy.publication.queueEmpty}
              </p>
              <p className="mt-4 font-sans text-xs uppercase tracking-[0.2em] text-muted-foreground">
                {hasActiveFilters
                  ? locale === "zh"
                    ? "调整搜索词、流程状态、语言或年份筛选后重试。"
                    : "Adjust the query, pipeline state, locale or year filters to broaden the queue."
                  : locale === "zh"
                    ? "稿件在被接收后才会进入这里。"
                    : "Submissions appear here only after they are accepted."}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </DashboardShell>
  );
}
