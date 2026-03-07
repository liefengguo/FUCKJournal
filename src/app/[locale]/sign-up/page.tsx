import { redirect } from "next/navigation";
import { unstable_noStore as noStore } from "next/cache";
import { setRequestLocale } from "next-intl/server";

import { getServerAuthSession } from "@/auth";
import { SignUpForm } from "@/components/auth/sign-up-form";
import type { Locale } from "@/i18n/routing";
import { getPlatformCopy } from "@/lib/platform-copy";
import { isStaffRole } from "@/lib/submission-status";

type SignUpPageProps = {
  params: {
    locale: Locale;
  };
};

export const dynamic = "force-dynamic";

export default async function SignUpPage({ params }: SignUpPageProps) {
  noStore();
  setRequestLocale(params.locale);

  const session = await getServerAuthSession();

  if (session?.user) {
    redirect(isStaffRole(session.user.role) ? `/${params.locale}/editor` : `/${params.locale}/dashboard`);
  }

  const copy = getPlatformCopy(params.locale).signUp;

  return (
    <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-12">
      <div className="mb-10 max-w-3xl">
        <p className="section-kicker">{params.locale === "zh" ? "账户" : "Account"}</p>
        <h1 className="mt-4 font-display text-5xl sm:text-6xl">{copy.title}</h1>
      </div>
      <SignUpForm locale={params.locale} />
    </div>
  );
}
