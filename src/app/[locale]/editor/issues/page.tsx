import { unstable_noStore as noStore } from "next/cache";
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
import { listEditorialIssueGroups } from "@/lib/submissions";
import { formatDate } from "@/lib/site";
import { publicationLocaleValues } from "@/lib/validations/publication";

type EditorIssuesPageProps = {
  params: {
    locale: Locale;
  };
  searchParams?: {
    locale?: string;
    q?: string;
  };
};

function getIssueLabel(
  locale: Locale,
  group: {
    year: number | null;
    volume: string | null;
    issue: string | null;
  },
) {
  if (!group.year || !group.volume || !group.issue) {
    return locale === "zh" ? "未分配期次" : "Unassigned issue";
  }

  return locale === "zh"
    ? `${group.year} / 第 ${group.volume} 卷 / 第 ${group.issue} 期`
    : `${group.year} / Vol. ${group.volume} / Issue ${group.issue}`;
}

export default async function EditorIssuesPage({
  params,
  searchParams,
}: EditorIssuesPageProps) {
  const { locale } = params;
  noStore();
  setRequestLocale(locale);

  await requireEditorUser(locale, `/${locale}/editor/issues`);

  const publicationLocale =
    searchParams?.locale &&
    publicationLocaleValues.includes(
      searchParams.locale as (typeof publicationLocaleValues)[number],
    )
      ? searchParams.locale
      : "all";
  const query = searchParams?.q?.trim() ?? "";
  const groups = await listEditorialIssueGroups({
    locale: publicationLocale,
    query,
  });
  const copy = getPlatformCopy(locale);
  const hasActiveFilters = publicationLocale !== "all" || Boolean(query);

  return (
    <DashboardShell
      locale={locale}
      title={copy.editor.issuesTitle}
      intro={
        locale === "zh"
          ? "按年份、卷期将已接收稿件分组，查看哪些稿件仍未分配期次，哪些已经进入出版准备，哪些已经写入发布时间。"
          : "Group accepted manuscripts by year, volume and issue so the editorial desk can track what is still unassigned, what is publication-ready, and what has already been marked published."
      }
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
            <LocaleLink locale={locale} href="/editor/publications">
              {copy.editor.publicationsTitle}
            </LocaleLink>
          </Button>
          <SignOutButton locale={locale} label={locale === "zh" ? "退出" : "Sign out"} />
        </>
      }
    >
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
                placeholder={locale === "zh" ? "例如：knowledge 或 FJ-" : "For example: knowledge or FJ-"}
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
                  <LocaleLink locale={locale} href="/editor/issues">
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
          <CardTitle>{copy.editor.issuesTitle}</CardTitle>
          <p className="font-serif text-lg leading-relaxed text-muted-foreground">
            {locale === "zh"
              ? "未分配期次的稿件会单独列出，便于编辑先补齐出版元数据。"
              : "Submissions without a full year/volume/issue assignment are grouped separately so the desk can complete publication metadata before release planning."}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {groups.length ? (
            groups.map((group) => (
              <div key={group.key} className="rounded-[24px] border border-border/60 px-5 py-5">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="space-y-3">
                    <p className="font-display text-2xl">{getIssueLabel(locale, group)}</p>
                    <div className="flex flex-wrap gap-3 font-sans text-xs uppercase tracking-[0.2em] text-muted-foreground">
                      <span>
                        {locale === "zh" ? "总数" : "Total"}: {group.counts.total}
                      </span>
                      <span>
                        {copy.editor.publicationPendingCountLabel}: {group.counts.pending}
                      </span>
                      <span>
                        {copy.editor.publicationReadyCountLabel}: {group.counts.ready}
                      </span>
                      <span>
                        {copy.editor.publishedCountLabel}: {group.counts.published}
                      </span>
                    </div>
                    <div className="space-y-2">
                      {group.submissions.slice(0, 4).map((submission) => (
                        <div
                          key={submission.publicId}
                          className="flex flex-col gap-2 rounded-[20px] border border-border/50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                        >
                          <div>
                            <LocaleLink
                              locale={locale}
                              href={`/editor/publications/${submission.publicId}`}
                              className="font-serif text-lg"
                            >
                              {submission.publicationTitle ||
                                submission.title ||
                                (locale === "zh" ? "未命名稿件" : "Untitled manuscript")}
                            </LocaleLink>
                            <p className="mt-1 font-sans text-xs uppercase tracking-[0.2em] text-muted-foreground">
                              {submission.publicId} · {submission.author.name || submission.author.email} ·{" "}
                              {formatDate(submission.updatedAt.toISOString(), locale)}
                            </p>
                          </div>
                          <PublicationStateBadge
                            locale={locale}
                            state={getPublicationPipelineState(submission)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col gap-3 sm:items-end">
                    {group.key === "unassigned" ? (
                      <Button asChild variant="outline" size="sm">
                        <LocaleLink locale={locale} href="/editor/publications">
                          {locale === "zh" ? "前往出版队列处理" : "Open publication queue"}
                        </LocaleLink>
                      </Button>
                    ) : (
                      <Button asChild variant="outline" size="sm">
                        <LocaleLink
                          locale={locale}
                          href={`/editor/issues/${group.year}/${encodeURIComponent(group.volume ?? "")}/${encodeURIComponent(group.issue ?? "")}`}
                        >
                          {locale === "zh" ? "查看期次详情" : "Open issue detail"}
                        </LocaleLink>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-[24px] border border-border/60 px-5 py-6">
              <p className="font-display text-2xl">
                {hasActiveFilters
                  ? locale === "zh"
                    ? "没有匹配当前条件的期次分组"
                    : "No issue groups match the current filters"
                  : locale === "zh"
                    ? "目前还没有可规划的期次稿件"
                    : "No accepted manuscripts are ready for issue planning yet"}
              </p>
              <p className="mt-3 font-serif text-lg leading-relaxed text-muted-foreground">
                {hasActiveFilters
                  ? locale === "zh"
                    ? "可以调整搜索词或语言筛选后重试。"
                    : "Adjust the query or locale filter and try again."
                  : locale === "zh"
                    ? "稿件被接收后，会在这里进入内部期次规划。"
                    : "Accepted submissions will appear here for internal issue planning."}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </DashboardShell>
  );
}
