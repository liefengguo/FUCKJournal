import { unstable_noStore as noStore } from "next/cache";
import { setRequestLocale } from "next-intl/server";

import { SignOutButton } from "@/components/auth/sign-out-button";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { SubmissionStatusBadge } from "@/components/submissions/submission-status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Locale } from "@/i18n/routing";
import { LocaleLink } from "@/components/locale-link";
import { getPlatformCopy } from "@/lib/platform-copy";
import { listEditorialSubmissions } from "@/lib/submissions";
import { formatDate } from "@/lib/site";

type EditorSubmissionsPageProps = {
  params: {
    locale: Locale;
  };
};

export default async function EditorSubmissionsPage({
  params,
}: EditorSubmissionsPageProps) {
  const { locale } = params;
  noStore();
  setRequestLocale(locale);

  const copy = getPlatformCopy(locale);
  const submissions = await listEditorialSubmissions();

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
      ]}
      action={
        <SignOutButton locale={locale} label={locale === "zh" ? "退出" : "Sign out"} />
      }
    >
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
                  <div className="space-y-2">
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
                    <p className="font-sans text-xs uppercase tracking-[0.2em] text-muted-foreground">
                      {formatDate(submission.updatedAt.toISOString(), locale)}
                    </p>
                  </div>
                  <SubmissionStatusBadge locale={locale} status={submission.status} />
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-[24px] border border-border/60 px-5 py-6 font-serif text-lg text-muted-foreground">
              {copy.editor.emptyBody}
            </div>
          )}
        </CardContent>
      </Card>
    </DashboardShell>
  );
}
