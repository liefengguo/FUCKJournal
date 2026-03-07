import type { ReactNode } from "react";

import { unstable_noStore as noStore } from "next/cache";
import { setRequestLocale } from "next-intl/server";

import type { Locale } from "@/i18n/routing";
import { requireContributorUser } from "@/lib/auth-guards";

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

  await requireContributorUser(params.locale);

  return children;
}
