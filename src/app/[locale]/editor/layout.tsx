import type { ReactNode } from "react";

import { unstable_noStore as noStore } from "next/cache";
import { setRequestLocale } from "next-intl/server";

import type { Locale } from "@/i18n/routing";

type EditorLayoutProps = {
  children: ReactNode;
  params: {
    locale: Locale;
  };
};

export const dynamic = "force-dynamic";

export default async function EditorLayout({
  children,
  params,
}: EditorLayoutProps) {
  noStore();
  setRequestLocale(params.locale);

  return children;
}
