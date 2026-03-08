import type { ReviewerAssignmentStatus } from "@prisma/client";
import { unstable_noStore as noStore } from "next/cache";
import { setRequestLocale } from "next-intl/server";

import { requireReviewerUser } from "@/lib/auth-guards";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { LocaleLink } from "@/components/locale-link";
import { ReviewDecisionBadge } from "@/components/reviews/review-decision-badge";
import { SubmissionStatusBadge } from "@/components/submissions/submission-status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { Locale } from "@/i18n/routing";
import { getPlatformCopy } from "@/lib/platform-copy";
import {
  getReviewerAssignmentStatusLabel,
  getSubmissionStatusLabel,
} from "@/lib/submission-status";
import { getSubmissionUiCopy } from "@/lib/submission-ui-copy";
import { listReviewerAssignments } from "@/lib/submissions";
import { formatDate } from "@/lib/site";
import { manuscriptLanguages } from "@/lib/validations/submission";

type ReviewerSubmissionsPageProps = {
  params: {
    locale: Locale;
  };
  searchParams?: {
    status?: string;
    language?: string;
    q?: string;
  };
};

const assignmentStatusFilters: ReviewerAssignmentStatus[] = ["ACTIVE", "COMPLETED"];

export default async function ReviewerSubmissionsPage({
  params,
  searchParams,
}: ReviewerSubmissionsPageProps) {
  const { locale } = params;
  noStore();
  setRequestLocale(locale);

  const reviewer = await requireReviewerUser(locale, `/${locale}/reviewer/submissions`);
  const status =
    searchParams?.status &&
    assignmentStatusFilters.includes(searchParams.status as ReviewerAssignmentStatus)
      ? (searchParams.status as ReviewerAssignmentStatus)
      : "ALL";
  const language =
    searchParams?.language &&
    manuscriptLanguages.includes(searchParams.language as (typeof manuscriptLanguages)[number])
      ? searchParams.language
      : "all";
  const query = searchParams?.q?.trim() ?? "";
  const assignments = await listReviewerAssignments(reviewer.id, {
    status,
    language,
    query,
  });
  const copy = getPlatformCopy(locale);
  const uiCopy = getSubmissionUiCopy(locale);
  const hasActiveFilters = status !== "ALL" || language !== "all" || Boolean(query);

  return (
    <DashboardShell
      locale={locale}
      title={copy.reviewer.assignmentsTitle}
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
        <SignOutButton locale={locale} label={locale === "zh" ? "退出" : "Sign out"} />
      }
    >
      <Card>
        <CardHeader className="space-y-4">
          <CardTitle>{locale === "zh" ? "检索与筛选" : "Search and filter"}</CardTitle>
          <p className="font-serif text-lg leading-relaxed text-muted-foreground">
            {locale === "zh"
              ? "只显示已分配给你的稿件。搜索不会扩大你的访问范围。"
              : "Only assignments already granted to your reviewer desk appear here. Search does not expand your access."}
          </p>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4 md:grid-cols-[1.2fr_0.8fr_0.8fr_auto] md:items-end">
            <div className="space-y-2">
              <label className="font-sans text-xs uppercase tracking-[0.22em] text-muted-foreground">
                {locale === "zh" ? "搜索标题、编号、作者或关键词" : "Search title, ID, author or keywords"}
              </label>
              <Input
                name="q"
                defaultValue={query}
                placeholder={locale === "zh" ? "例如：FJ- 或 human" : "For example: FJ- or human"}
              />
            </div>
            <div className="space-y-2">
              <label className="font-sans text-xs uppercase tracking-[0.22em] text-muted-foreground">
                {locale === "zh" ? "任务状态" : "Assignment status"}
              </label>
              <select
                name="status"
                defaultValue={status}
                className="h-11 w-full rounded-[24px] border border-border bg-background/70 px-4 font-sans text-sm text-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="ALL">{locale === "zh" ? "全部任务" : "All assignments"}</option>
                {assignmentStatusFilters.map((item) => (
                  <option key={item} value={item}>
                    {getReviewerAssignmentStatusLabel(item, locale)}
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
                <option value="all">{locale === "zh" ? "全部语言" : "All languages"}</option>
                {manuscriptLanguages.map((item) => (
                  <option key={item} value={item}>
                    {item}
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
                  <LocaleLink locale={locale} href="/reviewer/submissions">
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
          <CardTitle>{uiCopy.reviewer.assignedTitle}</CardTitle>
          <p className="font-serif text-lg leading-relaxed text-muted-foreground">
            {uiCopy.reviewer.accessNote}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {assignments.length ? (
            assignments.map((assignment) => (
              <div
                key={assignment.id}
                className="rounded-[24px] border border-border/60 px-5 py-4"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div className="space-y-3">
                    <LocaleLink
                      locale={locale}
                      href={`/reviewer/submissions/${assignment.submission.publicId}`}
                      className="font-display text-2xl"
                    >
                      {assignment.submission.title ||
                        (locale === "zh" ? "未命名稿件" : "Untitled manuscript")}
                    </LocaleLink>
                    <p className="font-serif text-base text-muted-foreground">
                      {assignment.submission.author.name || assignment.submission.author.email}
                    </p>
                    <div className="flex flex-wrap gap-3 font-sans text-xs uppercase tracking-[0.2em] text-muted-foreground">
                      <span>{assignment.submission.publicId}</span>
                      <span>{formatDate(assignment.updatedAt.toISOString(), locale)}</span>
                      <span>{getSubmissionStatusLabel(assignment.submission.status, locale)}</span>
                      <span>{getReviewerAssignmentStatusLabel(assignment.status, locale)}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <SubmissionStatusBadge locale={locale} status={assignment.submission.status} />
                    {assignment.review ? (
                      <ReviewDecisionBadge locale={locale} decision={assignment.review.decision} />
                    ) : null}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-[24px] border border-border/60 px-5 py-6">
              <p className="font-display text-2xl">
                {hasActiveFilters
                  ? locale === "zh"
                    ? "没有匹配当前条件的审稿任务"
                    : "No assignments match the current filters"
                  : copy.reviewer.emptyTitle}
              </p>
              <p className="mt-3 font-serif text-lg leading-relaxed text-muted-foreground">
                {hasActiveFilters
                  ? locale === "zh"
                    ? "可以调整搜索词、任务状态或语言筛选。"
                    : "Adjust the query, assignment status or language filter."
                  : copy.reviewer.emptyBody}
              </p>
              <div className="mt-5">
                <Button asChild variant="outline" size="sm">
                  <LocaleLink locale={locale} href="/reviewer">
                    {locale === "zh" ? "返回概览" : "Back to overview"}
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
