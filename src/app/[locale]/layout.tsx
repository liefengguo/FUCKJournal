import type { ReactNode } from "react";

import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Providers } from "@/components/providers";
import { routing, type Locale } from "@/i18n/routing";

type LocaleLayoutProps = {
  children: ReactNode;
  params: {
    locale: string;
  };
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <Providers>
        <div className="page-shell flex min-h-screen flex-col">
          <Header locale={locale as Locale} />
          <main className="flex-1">{children}</main>
          <Footer locale={locale as Locale} />
        </div>
      </Providers>
    </NextIntlClientProvider>
  );
}
