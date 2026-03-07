"use client";

import { useState, useTransition } from "react";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

import type { Locale } from "@/i18n/routing";
import { LocaleLink } from "@/components/locale-link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  getAuthFeedback,
  getCredentialValidationMessages,
} from "@/lib/feedback";
import { getSafeCallbackUrl, getRoleHomePath } from "@/lib/auth-routing";
import { getPlatformCopy } from "@/lib/platform-copy";
import { getSession } from "next-auth/react";

type SignInFormProps = {
  locale: Locale;
  callbackUrl?: string | null;
};

export function SignInForm({ locale, callbackUrl }: SignInFormProps) {
  const copy = getPlatformCopy(locale).signIn;
  const router = useRouter();
  const [messages, setMessages] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(formData: FormData) {
    const email = String(formData.get("email") ?? "");
    const password = String(formData.get("password") ?? "");
    const validationMessages = getCredentialValidationMessages(locale, {
      email,
      password,
    });

    if (validationMessages.length) {
      setMessages(validationMessages);
      return;
    }

    setMessages([]);

    startTransition(async () => {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (!result || result.error) {
        setMessages([
          getAuthFeedback(locale, "invalid-credentials") ?? `${copy.errorPrefix}.`,
        ]);
        return;
      }

      const session = await getSession();
      const fallbackPath = getRoleHomePath(locale, session?.user.role ?? "USER");
      const nextPath = getSafeCallbackUrl(callbackUrl, locale, fallbackPath);
      const nextUrl = new URL(nextPath, window.location.origin);
      nextUrl.searchParams.set("notice", "signed-in");

      router.push(`${nextUrl.pathname}${nextUrl.search}`);
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
          {messages.length ? (
            <div className="rounded-[24px] border border-journal-red/30 bg-journal-red/10 px-4 py-4">
              {messages.map((message) => (
                <p
                  key={message}
                  className="font-serif text-base leading-relaxed text-journal-red"
                >
                  {message}
                </p>
              ))}
            </div>
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
