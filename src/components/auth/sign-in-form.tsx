"use client";

import { useState, useTransition } from "react";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

import type { Locale } from "@/i18n/routing";
import { LocaleLink } from "@/components/locale-link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getPlatformCopy } from "@/lib/platform-copy";

type SignInFormProps = {
  locale: Locale;
};

export function SignInForm({ locale }: SignInFormProps) {
  const copy = getPlatformCopy(locale).signIn;
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(formData: FormData) {
    setError(null);

    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");

    startTransition(async () => {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (!result || result.error) {
        setError(`${copy.errorPrefix}.`);
        return;
      }

      router.push(`/${locale}/dashboard`);
      router.refresh();
    });
  }

  return (
    <Card className="mx-auto max-w-xl">
      <CardHeader className="space-y-4">
        <CardTitle>{copy.title}</CardTitle>
        <p className="font-serif text-lg leading-relaxed text-muted-foreground">
          {copy.intro}
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <form action={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="font-sans text-xs uppercase tracking-[0.22em] text-muted-foreground">
              {copy.emailLabel}
            </label>
            <Input name="email" type="email" autoComplete="email" required />
          </div>
          <div className="space-y-2">
            <label className="font-sans text-xs uppercase tracking-[0.22em] text-muted-foreground">
              {copy.passwordLabel}
            </label>
            <Input
              name="password"
              type="password"
              autoComplete="current-password"
              minLength={8}
              required
            />
          </div>
          {error ? (
            <p className="font-serif text-base leading-relaxed text-journal-red">
              {error}
            </p>
          ) : null}
          <Button type="submit" size="lg" className="w-full" disabled={isPending}>
            {isPending ? copy.submittingLabel : copy.submitLabel}
          </Button>
        </form>
        <p className="font-serif text-base text-muted-foreground">
          {copy.alternateText}{" "}
          <LocaleLink
            locale={locale}
            href={copy.alternateHref}
            className="font-sans text-sm uppercase tracking-[0.2em] text-foreground"
          >
            {copy.alternateLabel}
          </LocaleLink>
        </p>
      </CardContent>
    </Card>
  );
}
