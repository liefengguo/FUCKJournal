import { unstable_noStore as noStore } from "next/cache";
import { setRequestLocale } from "next-intl/server";

import { requireContributorUser } from "@/lib/auth-guards";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { LocaleLink } from "@/components/locale-link";
import { SubmissionStatusBadge } from "@/components/submissions/submission-status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Locale } from "@/i18n/routing";
import { getPlatformCopy } from "@/lib/platform-copy";
import { listAuthorSubmissions } from "@/lib/submissions";
import { formatDate } from "@/lib/site";

type SubmissionsPageProps = {
  params: {
    locale: Locale;
  };
};

export default async function SubmissionsPage({ params }: SubmissionsPageProps) {
  const { locale } = params;
  noStore();
  setRequestLocale(locale);

  const user = await requireContributorUser(locale, `/${locale}/dashboard/submissions`);
  const submissions = await listAuthorSubmissions(user.id);
  const copy = getPlatformCopy(locale);

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
              <p className="font-serif text-lg text-muted-foreground">
                {copy.submission.noSubmissions}
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
