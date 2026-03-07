import { unstable_noStore as noStore } from "next/cache";
import { setRequestLocale } from "next-intl/server";

import { SignInForm } from "@/components/auth/sign-in-form";
import { FlashMessage } from "@/components/dashboard/flash-message";
import type { Locale } from "@/i18n/routing";
import { redirectAuthenticatedUser } from "@/lib/auth-guards";
import { getSafeCallbackUrl } from "@/lib/auth-routing";
import { getAuthFeedback } from "@/lib/feedback";
import { getPlatformCopy } from "@/lib/platform-copy";

type SignInPageProps = {
  params: {
    locale: Locale;
  };
  searchParams?: {
    notice?: string;
    callbackUrl?: string;
  };
};

export const dynamic = "force-dynamic";

export default async function SignInPage({
  params,
  searchParams,
}: SignInPageProps) {
  noStore();
  setRequestLocale(params.locale);

  await redirectAuthenticatedUser(params.locale);

  const copy = getPlatformCopy(params.locale).signIn;
  const notice = getAuthFeedback(params.locale, searchParams?.notice);
  const callbackUrl = getSafeCallbackUrl(
    searchParams?.callbackUrl,
    params.locale,
    `/${params.locale}/dashboard`,
  );

  return (
    <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-12">
      <div className="mb-10 max-w-3xl">
        <p className="section-kicker">{params.locale === "zh" ? "认证" : "Authentication"}</p>
        <h1 className="mt-4 font-display text-5xl sm:text-6xl">{copy.title}</h1>
      </div>
      {notice ? <FlashMessage message={notice} /> : null}
      <div className="mt-6">
        <SignInForm locale={params.locale} callbackUrl={callbackUrl} />
      </div>
    </div>
  );
}
