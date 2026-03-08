import { unstable_noStore as noStore } from "next/cache";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";

import { requireEditorUser } from "@/lib/auth-guards";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { LocaleLink } from "@/components/locale-link";
import { PublicationStateBadge } from "@/components/submissions/publication-state-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { Locale } from "@/i18n/routing";
import { getPlatformCopy } from "@/lib/platform-copy";
import { getPublicationPipelineState } from "@/lib/submission-status";
import { getEditorialIssueGroupDetail } from "@/lib/submissions";
import { formatDate } from "@/lib/site";
import { publicationLocaleValues } from "@/lib/validations/publication";

type IssueDetailPageProps = {
  params: {
    locale: Locale;
    year: string;
    volume: string;
    issue: string;
  };
  searchParams?: {
    locale?: string;
    q?: string;
  };
};

export default async function IssueDetailPage({
  params,
  searchParams,
}: IssueDetailPageProps) {
  const { locale, year, volume, issue } = params;
  noStore();
  setRequestLocale(locale);

  await requireEditorUser(locale, `/${locale}/editor/issues/${year}/${volume}/${issue}`);

  const parsedYear = Number(year);

  if (!Number.isInteger(parsedYear)) {
    notFound();
  }

  const publicationLocale =
    searchParams?.locale &&
    publicationLocaleValues.includes(
      searchParams.locale as (typeof publicationLocaleValues)[number],
    )
      ? searchParams.locale
      : "all";
  const query = searchParams?.q?.trim() ?? "";

  const [allSubmissions, submissions] = await Promise.all([
    getEditorialIssueGroupDetail(parsedYear, volume, issue),
    getEditorialIssueGroupDetail(parsedYear, volume, issue, {
      locale: publicationLocale,
      query,
    }),
  ]);

  if (!allSubmissions.length) {
    notFound();
  }

  const counts = allSubmissions.reduce(
    (accumulator, submission) => {
      const state = getPublicationPipelineState(submission);

      accumulator.total += 1;

      if (state === "PUBLISHED") {
        accumulator.published += 1;
      } else if (state === "READY") {
        accumulator.ready += 1;
      } else {
        accumulator.pending += 1;
      }

      return accumulator;
    },
    { total: 0, pending: 0, ready: 0, published: 0 },
  );
  const hasActiveFilters = publicationLocale !== "all" || Boolean(query);
  const copy = getPlatformCopy(locale);

  return (
    <DashboardShell
      locale={locale}
      title={copy.editor.issuesTitle}
      intro={
        locale === "zh"
          ? `${parsedYear} / 第 ${volume} 卷 / 第 ${issue} 期的内部出版视图。`
          : `Internal publication view for ${parsedYear} / Vol. ${volume} / Issue ${issue}.`
      }
      navItems={[
        {
          href: "/editor",
          label: locale === "zh" ? "概览" : "Overview",
        },
        {
          href: "/editor/publications",
          label: copy.editor.publicationsTitle,
        },
        {
          href: "/editor/issues",
          label: copy.editor.issuesTitle,
          active: true,
        },
      ]}
      action={
        <>
          <Button asChild variant="outline" size="sm">
            <LocaleLink locale={locale} href="/editor/issues">
              {copy.editor.issuesTitle}
            </LocaleLink>
          </Button>
          <SignOutButton locale={locale} label={locale === "zh" ? "退出" : "Sign out"} />
        </>
      }
    >
      <section className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">{locale === "zh" ? "总数" : "Total"}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-display text-5xl">{counts.total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">{copy.editor.publicationPendingCountLabel}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-display text-5xl">{counts.pending}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">{copy.editor.publicationReadyCountLabel}</CardTitle>
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
          <CardTitle>{locale === "zh" ? "检索与筛选" : "Search and filter"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4 md:grid-cols-[1.3fr_0.8fr_auto] md:items-end">
            <div className="space-y-2">
              <label className="font-sans text-xs uppercase tracking-[0.22em] text-muted-foreground">
                {locale === "zh" ? "搜索标题、slug、编号或作者" : "Search title, slug, ID or author"}
              </label>
              <Input
                name="q"
                defaultValue={query}
                placeholder={locale === "zh" ? "例如：essay 或 FJ-" : "For example: essay or FJ-"}
              />
            </div>
            <div className="space-y-2">
              <label className="font-sans text-xs uppercase tracking-[0.22em] text-muted-foreground">
                {locale === "zh" ? "语言" : "Locale"}
              </label>
              <select
                name="locale"
                defaultValue={publicationLocale}
                className="h-11 w-full rounded-[24px] border border-border bg-background/70 px-4 font-sans text-sm text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="all">{locale === "zh" ? "全部语言" : "All locales"}</option>
                {publicationLocaleValues.map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-3">
              <Button type="submit" size="sm">
                {locale === "zh" ? "应用" : "Apply"}
              </Button>
              {hasActiveFilters ? (
                <Button asChild variant="outline" size="sm">
                  <LocaleLink
                    locale={locale}
                    href={`/editor/issues/${parsedYear}/${volume}/${issue}`}
                  >
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
          <CardTitle>
            {locale === "zh"
              ? `${parsedYear} / 第 ${volume} 卷 / 第 ${issue} 期`
              : `${parsedYear} / Vol. ${volume} / Issue ${issue}`}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {submissions.length ? (
            submissions.map((submission) => (
              <div key={submission.publicId} className="rounded-[24px] border border-border/60 px-5 py-4">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="space-y-3">
                    <LocaleLink
                      locale={locale}
                      href={`/editor/publications/${submission.publicId}`}
                      className="font-display text-2xl"
                    >
                      {submission.publicationTitle ||
                        submission.title ||
                        (locale === "zh" ? "未命名稿件" : "Untitled manuscript")}
                    </LocaleLink>
                    <p className="font-serif text-base text-muted-foreground">
                      {submission.author.name || submission.author.email}
                    </p>
                    <div className="flex flex-wrap gap-3 font-sans text-xs uppercase tracking-[0.2em] text-muted-foreground">
                      <span>{submission.publicId}</span>
                      <span>{formatDate(submission.updatedAt.toISOString(), locale)}</span>
                      <span>
                        {submission.publicationLocale ||
                          submission.manuscriptLanguage ||
                          (locale === "zh" ? "语言未填" : "No locale")}
                      </span>
                      <span>
                        {submission.publicationSlug ||
                          (locale === "zh" ? "无 slug" : "No slug")}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-3 sm:items-end">
                    <PublicationStateBadge
                      locale={locale}
                      state={getPublicationPipelineState(submission)}
                    />
                    <Button asChild variant="outline" size="sm">
                      <LocaleLink locale={locale} href={`/editor/publications/${submission.publicId}`}>
                        {locale === "zh" ? "打开出版工作区" : "Open publication workspace"}
                      </LocaleLink>
                    </Button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-[24px] border border-border/60 px-5 py-6">
              <p className="font-display text-2xl">
                {locale === "zh"
                  ? "没有匹配当前条件的稿件"
                  : "No submissions match the current filters"}
              </p>
              <p className="mt-3 font-serif text-lg leading-relaxed text-muted-foreground">
                {locale === "zh"
                  ? "可以调整搜索词或语言筛选后重试。"
                  : "Adjust the query or locale filter and try again."}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </DashboardShell>
  );
}
