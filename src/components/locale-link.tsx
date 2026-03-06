import Link from "next/link";
import type { ComponentProps } from "react";

import type { Locale } from "@/i18n/routing";
import { getLocalizedHref } from "@/lib/site";

type LocaleLinkProps = Omit<ComponentProps<typeof Link>, "href"> & {
  locale: Locale;
  href: string;
};

export function LocaleLink({ locale, href, ...props }: LocaleLinkProps) {
  return <Link href={getLocalizedHref(locale, href)} {...props} />;
}
