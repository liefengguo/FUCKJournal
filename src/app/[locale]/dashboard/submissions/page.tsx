import type { SubmissionStatus } from "@prisma/client";
import { unstable_noStore as noStore } from "next/cache";
import { setRequestLocale } from "next-intl/server";

import { requireContributorUser } from "@/lib/auth-guards";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { LocaleLink } from "@/components/locale-link";
import { SubmissionStatusBadge } from "@/components/submissions/submission-status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { Locale } from "@/i18n/routing";
import { getPlatformCopy } from "@/lib/platform-copy";
import { getSubmissionStatusLabel } from "@/lib/submission-status";
import { listAuthorSubmissions } from "@/lib/submissions";
import { formatDate } from "@/lib/site";

type SubmissionsPageProps = {
  params: {
    locale: Locale;
  };
  searchParams?: {
    status?: string;
    q?: string;
  };
};

const statusFilters: SubmissionStatus[] = [
  "DRAFT",
  "SUBMITTED",
  "UNDER_REVIEW",
  "REVISION_REQUESTED",
  "ACCEPTED",
  "REJECTED",
];

export default async function SubmissionsPage({
  params,
  searchParams,
}: SubmissionsPageProps) {
  const { locale } = params;
  noStore();
  setRequestLocale(locale);

  const user = await requireContributorUser(locale, `/${locale}/dashboard/submissions`);
  const status =
    searchParams?.status && statusFilters.includes(searchParams.status as SubmissionStatus)
      ? (searchParams.status as SubmissionStatus)
      : "ALL";
  const query = searchParams?.q?.trim() ?? "";
  const submissions = await listAuthorSubmissions(user.id, {
    status,
    query,
  });
  const copy = getPlatformCopy(locale);
  const hasActiveFilters = status !== "ALL" || Boolean(query);

  return (
    <DashboardShell
      locale={locale}
      title={copy.submission.submissionsTitle}
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
          <Button asChild size="sm">
            <LocaleLink locale={locale} href="/dashboard/submissions/new">
              {copy.submission.createDraftLabel}
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
          <form className="grid gap-4 md:grid-cols-[1.2fr_0.8fr_auto] md:items-end">
            <div className="space-y-2">
              <label className="font-sans text-xs uppercase tracking-[0.22em] text-muted-foreground">
                {locale === "zh" ? "搜索标题、编号或关键词" : "Search title, ID or keywords"}
              </label>
              <Input
                name="q"
                defaultValue={query}
                placeholder={locale === "zh" ? "例如：loneliness 或 FJ-" : "For example: loneliness or FJ-"}
              />
            </div>
            <div className="space-y-2">
              <label className="font-sans text-xs uppercase tracking-[0.22em] text-muted-foreground">
                {copy.submission.statusLabel}
              </label>
              <select
                name="status"
                defaultValue={status}
                className="h-11 w-full rounded-[24px] border border-border bg-background/70 px-4 font-sans text-sm text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="ALL">{locale === "zh" ? "全部状态" : "All statuses"}</option>
                {statusFilters.map((item) => (
                  <option key={item} value={item}>
                    {getSubmissionStatusLabel(item, locale)}
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
                  <LocaleLink locale={locale} href="/dashboard/submissions">
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
          <CardTitle>{copy.submission.submissionsTitle}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {submissions.length ? (
            submissions.map((submission) => (
              <div
                key={submission.publicId}
                className="rounded-[24px] border border-border/60 px-5 py-4"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="space-y-2">
                    <LocaleLink
                      locale={locale}
                      href={`/dashboard/submissions/${submission.publicId}`}
                      className="font-display text-2xl"
                    >
                      {submission.title || (locale === "zh" ? "未命名稿件" : "Untitled manuscript")}
                    </LocaleLink>
                    <p className="font-sans text-xs uppercase tracking-[0.2em] text-muted-foreground">
                      {copy.submission.updatedLabel}:{" "}
                      {formatDate(submission.updatedAt.toISOString(), locale)}
                    </p>
                    <p className="font-sans text-xs uppercase tracking-[0.2em] text-muted-foreground">
                      {submission.publicId}
                    </p>
                  </div>
                  <div className="flex flex-col gap-3 sm:items-end">
                    <SubmissionStatusBadge locale={locale} status={submission.status} />
                    <Button asChild variant="outline" size="sm">
                      <LocaleLink
                        locale={locale}
                        href={`/dashboard/submissions/${submission.publicId}`}
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
              <p className="font-display text-2xl">
                {hasActiveFilters
                  ? locale === "zh"
                    ? "没有匹配当前条件的稿件"
                    : "No submissions match the current filters"
                  : copy.dashboard.emptyTitle}
              </p>
              <p className="mt-3 font-serif text-lg text-muted-foreground">
                {hasActiveFilters
                  ? locale === "zh"
                    ? "可以调整搜索词或状态筛选，或者开始一条新的投稿。"
                    : "Adjust the query or status filter, or start a new submission."
                  : copy.submission.noSubmissions}
              </p>
              <div className="mt-5">
                <Button asChild size="sm">
                  <LocaleLink locale={locale} href="/dashboard/submissions/new">
                    {copy.submission.createDraftLabel}
                  </LocaleLink>
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </DashboardShell>
  );
}
