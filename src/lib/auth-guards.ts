import { redirect } from "next/navigation";

import { getServerAuthSession } from "@/auth";
import type { Locale } from "@/i18n/routing";
import { getRoleHomePath } from "@/lib/auth-routing";
import { isStaffRole } from "@/lib/submission-status";

function buildSignInUrl(locale: Locale, callbackUrl: string) {
  const searchParams = new URLSearchParams({
    notice: "auth-required",
    callbackUrl,
  });

  return `/${locale}/sign-in?${searchParams.toString()}`;
}

export async function requireAuthenticatedUser(
  locale: Locale,
  callbackUrl: string,
) {
  const session = await getServerAuthSession();

  if (!session?.user) {
    redirect(buildSignInUrl(locale, callbackUrl));
  }

  return session.user;
}

export async function requireContributorUser(
  locale: Locale,
  callbackUrl = `/${locale}/dashboard`,
) {
  const user = await requireAuthenticatedUser(locale, callbackUrl);

  if (isStaffRole(user.role)) {
    redirect(getRoleHomePath(locale, user.role));
  }

  return user;
}

export async function requireEditorUser(
  locale: Locale,
  callbackUrl = `/${locale}/editor`,
) {
  const user = await requireAuthenticatedUser(locale, callbackUrl);

  if (!isStaffRole(user.role)) {
    redirect(`/${locale}/dashboard?notice=editor-only`);
  }

  return user;
}

export async function redirectAuthenticatedUser(locale: Locale) {
  const session = await getServerAuthSession();

  if (session?.user) {
    redirect(getRoleHomePath(locale, session.user.role));
  }
}
