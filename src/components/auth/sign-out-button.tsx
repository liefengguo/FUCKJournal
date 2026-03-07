"use client";

import { signOut } from "next-auth/react";

import type { Locale } from "@/i18n/routing";
import { Button } from "@/components/ui/button";

type SignOutButtonProps = {
  locale: Locale;
  label: string;
};

export function SignOutButton({ locale, label }: SignOutButtonProps) {
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={() =>
        signOut({
          callbackUrl: `/${locale}`,
        })
      }
    >
      {label}
    </Button>
  );
}
