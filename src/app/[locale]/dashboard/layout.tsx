import type { ReactNode } from "react";

import { unstable_noStore as noStore } from "next/cache";
import { redirect } from "next/navigation";
import { setRequestLocale } from "next-intl/server";

import { getServerAuthSession } from "@/auth";
import type { Locale } from "@/i18n/routing";
import { isStaffRole } from "@/lib/submission-status";

type DashboardLayoutProps = {
  children: ReactNode;
  params: {
    locale: Locale;
  };
};

export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
  params,
}: DashboardLayoutProps) {
  noStore();
  setRequestLocale(params.locale);

  const session = await getServerAuthSession();

  if (!session?.user) {
    redirect(`/${params.locale}/sign-in`);
  }

  if (isStaffRole(session.user.role)) {
    redirect(`/${params.locale}/editor`);
  }

  return children;
}
