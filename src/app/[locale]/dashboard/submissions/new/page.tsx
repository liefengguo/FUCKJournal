import { unstable_noStore as noStore } from "next/cache";
import { setRequestLocale } from "next-intl/server";

import { createDraftAction } from "@/app/actions/submissions";
import { getServerAuthSession } from "@/auth";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { FlashMessage } from "@/components/dashboard/flash-message";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Locale } from "@/i18n/routing";
import { getPlatformCopy } from "@/lib/platform-copy";

type NewDraftPageProps = {
  params: {
    locale: Locale;
  };
  searchParams?: {
    error?: string;
  };
};

export default async function NewDraftPage({
  params,
  searchParams,
}: NewDraftPageProps) {
  const { locale } = params;
  noStore();
  setRequestLocale(locale);

  await getServerAuthSession();
  const copy = getPlatformCopy(locale);

  return (
    <DashboardShell
      locale={locale}
      title={copy.submission.newTitle}
      intro={copy.submission.newIntro}
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
        <SignOutButton locale={locale} label={locale === "zh" ? "退出" : "Sign out"} />
      }
    >
      {searchParams?.error ? (
        <FlashMessage message={searchParams.error} tone="error" />
      ) : null}
      <Card className="max-w-3xl">
        <CardHeader className="space-y-4">
          <CardTitle>{copy.dashboard.newDraftTitle}</CardTitle>
          <p className="font-serif text-lg leading-relaxed text-muted-foreground">
            {copy.dashboard.newDraftBody}
          </p>
        </CardHeader>
        <CardContent>
          <form action={createDraftAction}>
            <input type="hidden" name="locale" value={locale} />
            <Button type="submit" size="lg">
              {copy.submission.createDraftLabel}
            </Button>
          </form>
        </CardContent>
      </Card>
    </DashboardShell>
  );
}
