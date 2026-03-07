import { unstable_noStore as noStore } from "next/cache";
import { setRequestLocale } from "next-intl/server";

import { SignUpForm } from "@/components/auth/sign-up-form";
import { FlashMessage } from "@/components/dashboard/flash-message";
import type { Locale } from "@/i18n/routing";
import { redirectAuthenticatedUser } from "@/lib/auth-guards";
import { getSafeCallbackUrl } from "@/lib/auth-routing";
import { getAuthFeedback } from "@/lib/feedback";
import { getPlatformCopy } from "@/lib/platform-copy";

type SignUpPageProps = {
  params: {
    locale: Locale;
  };
  searchParams?: {
    notice?: string;
    callbackUrl?: string;
  };
};

export const dynamic = "force-dynamic";

export default async function SignUpPage({
  params,
  searchParams,
}: SignUpPageProps) {
  noStore();
  setRequestLocale(params.locale);

  await redirectAuthenticatedUser(params.locale);

  const copy = getPlatformCopy(params.locale).signUp;
  const notice = getAuthFeedback(params.locale, searchParams?.notice);
  const callbackUrl = getSafeCallbackUrl(
    searchParams?.callbackUrl,
    params.locale,
    `/${params.locale}/dashboard`,
  );

  return (
    <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-12">
      <div className="mb-10 max-w-3xl">
        <p className="section-kicker">{params.locale === "zh" ? "账户" : "Account"}</p>
        <h1 className="mt-4 font-display text-5xl sm:text-6xl">{copy.title}</h1>
      </div>
      {notice ? <FlashMessage message={notice} /> : null}
      <div className="mt-6">
        <SignUpForm locale={params.locale} callbackUrl={callbackUrl} />
      </div>
    </div>
  );
}
