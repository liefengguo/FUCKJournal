import createMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import type { UserRole } from "@prisma/client";
import { getToken } from "next-auth/jwt";

import { routing } from "@/i18n/routing";
import {
  getRoleHomePath,
  isAuthPath,
  isDashboardPath,
  isEditorPath,
  isReviewerPath,
  parseLocalizedPath,
} from "@/lib/auth-routing";
import { isReviewerRole, isStaffRole } from "@/lib/submission-status";

const intlMiddleware = createMiddleware(routing);

export default async function middleware(request: NextRequest) {
  const intlResponse = intlMiddleware(request);
  const url = new URL(request.url);
  const { locale, pathname } = parseLocalizedPath(url.pathname);

  if (!locale) {
    return intlResponse;
  }

  const needsAuth =
    isDashboardPath(pathname) || isEditorPath(pathname) || isReviewerPath(pathname);

  if (!needsAuth && !isAuthPath(pathname)) {
    return intlResponse;
  }

  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token && needsAuth) {
    const signInUrl = new URL(`/${locale}/sign-in`, url);
    signInUrl.searchParams.set("notice", "auth-required");
    signInUrl.searchParams.set("callbackUrl", `${url.pathname}${url.search}`);
    return NextResponse.redirect(signInUrl);
  }

  if (!token) {
    return intlResponse;
  }

  const role = (typeof token.role === "string" ? token.role : "USER") as UserRole;
  const destination = getRoleHomePath(locale, role);

  if (isAuthPath(pathname)) {
    const redirectUrl = new URL(destination, url);
    redirectUrl.searchParams.set("notice", "already-authenticated");
    return NextResponse.redirect(redirectUrl);
  }

  if (isDashboardPath(pathname) && isStaffRole(role)) {
    const redirectUrl = new URL(destination, url);
    url.searchParams.forEach((value, key) => redirectUrl.searchParams.set(key, value));
    return NextResponse.redirect(redirectUrl);
  }

  if (isDashboardPath(pathname) && isReviewerRole(role)) {
    const redirectUrl = new URL(destination, url);
    redirectUrl.searchParams.set("notice", "reviewer-only");
    return NextResponse.redirect(redirectUrl);
  }

  if (isEditorPath(pathname) && !isStaffRole(role)) {
    const redirectUrl = new URL(destination, url);
    redirectUrl.searchParams.set("notice", "editor-only");
    return NextResponse.redirect(redirectUrl);
  }

  if (isReviewerPath(pathname) && !isReviewerRole(role)) {
    const redirectUrl = new URL(destination, url);
    redirectUrl.searchParams.set("notice", "reviewer-only");
    return NextResponse.redirect(redirectUrl);
  }

  return intlResponse;
}

export const config = {
  matcher: ["/((?!api|trpc|_next|_vercel|.*\\..*).*)"],
};
