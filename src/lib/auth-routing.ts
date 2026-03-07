import type { UserRole } from "@prisma/client";

import type { Locale } from "@/i18n/routing";
import { routing } from "@/i18n/routing";
import { isStaffRole } from "@/lib/submission-status";

type ParsedPath = {
  locale: Locale | null;
  pathname: string;
};

function startsWithSegment(pathname: string, segment: string) {
  return pathname === segment || pathname.startsWith(`${segment}/`);
}

export function parseLocalizedPath(pathname: string): ParsedPath {
  const segments = pathname.split("/").filter(Boolean);
  const maybeLocale = segments[0];

  if (!maybeLocale || !routing.locales.includes(maybeLocale as Locale)) {
    return {
      locale: null,
      pathname,
    };
  }

  const rest = segments.slice(1);

  return {
    locale: maybeLocale as Locale,
    pathname: rest.length ? `/${rest.join("/")}` : "/",
  };
}

export function isDashboardPath(pathname: string) {
  return startsWithSegment(pathname, "/dashboard");
}

export function isEditorPath(pathname: string) {
  return startsWithSegment(pathname, "/editor");
}

export function isAuthPath(pathname: string) {
  return pathname === "/sign-in" || pathname === "/sign-up";
}

export function getRoleHomePath(locale: Locale, role: UserRole) {
  return isStaffRole(role) ? `/${locale}/editor` : `/${locale}/dashboard`;
}

export function getSafeCallbackUrl(
  candidate: string | null | undefined,
  locale: Locale,
  fallback?: string,
) {
  const defaultPath = fallback ?? `/${locale}/dashboard`;

  if (!candidate || typeof candidate !== "string") {
    return defaultPath;
  }

  if (!candidate.startsWith("/") || candidate.startsWith("//")) {
    return defaultPath;
  }

  if (!candidate.startsWith(`/${locale}`)) {
    return defaultPath;
  }

  return candidate;
}
