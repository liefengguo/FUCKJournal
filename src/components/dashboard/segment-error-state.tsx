"use client";

import { useEffect } from "react";

import { useParams } from "next/navigation";

import { LocaleLink } from "@/components/locale-link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Locale } from "@/i18n/routing";

type SegmentScope = "dashboard" | "editor" | "reviewer";

type SegmentErrorStateProps = {
  error: Error & { digest?: string };
  reset: () => void;
  scope: SegmentScope;
};

const copy = {
  en: {
    dashboard: {
      title: "Contributor workspace unavailable",
      body:
        "The submission workspace could not load correctly. Retry the request or return to the dashboard overview.",
      backLabel: "Back to dashboard",
    },
    editor: {
      title: "Editorial workspace unavailable",
      body:
        "The editorial interface hit an unexpected failure. Retry first; if it persists, return to the editorial overview and check operational diagnostics.",
      backLabel: "Back to editorial desk",
    },
    reviewer: {
      title: "Reviewer workspace unavailable",
      body:
        "The reviewer workspace could not finish this request. Retry or return to your assignment overview.",
      backLabel: "Back to reviewer desk",
    },
    retryLabel: "Try again",
    detailLabel: "Diagnostic digest",
  },
  zh: {
    dashboard: {
      title: "投稿工作区暂时不可用",
      body:
        "投稿工作区在加载时出现异常。请先重试，或返回概览页继续操作。",
      backLabel: "返回投稿概览",
    },
    editor: {
      title: "编辑工作区暂时不可用",
      body:
        "编辑台在处理当前请求时出现异常。请先重试；如果问题持续存在，请返回编辑概览并检查运行诊断信息。",
      backLabel: "返回编辑台",
    },
    reviewer: {
      title: "审稿工作区暂时不可用",
      body:
        "审稿工作区暂时无法完成当前请求。请先重试，或返回审稿概览页。",
      backLabel: "返回审稿后台",
    },
    retryLabel: "重试",
    detailLabel: "诊断摘要",
  },
} satisfies Record<
  Locale,
  Record<
    SegmentScope | "retryLabel" | "detailLabel",
    { title: string; body: string; backLabel: string } | string
  >
>;

export function SegmentErrorState({
  error,
  reset,
  scope,
}: SegmentErrorStateProps) {
  const params = useParams<{ locale?: string }>();
  const locale = params?.locale === "zh" ? "zh" : "en";
  const content = copy[locale][scope] as {
    title: string;
    body: string;
    backLabel: string;
  };
  const backHref =
    scope === "editor" ? "/editor" : scope === "reviewer" ? "/reviewer" : "/dashboard";

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <Card>
        <CardHeader className="space-y-4">
          <CardTitle className="text-3xl">{content.title}</CardTitle>
          <p className="font-serif text-lg leading-relaxed text-muted-foreground">
            {content.body}
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button type="button" size="lg" onClick={() => reset()}>
              {copy[locale].retryLabel as string}
            </Button>
            <Button asChild variant="outline" size="lg">
              <LocaleLink locale={locale} href={backHref}>
                {content.backLabel}
              </LocaleLink>
            </Button>
          </div>
          {process.env.NODE_ENV !== "production" && error.digest ? (
            <div className="rounded-[24px] border border-border/60 bg-background/70 px-4 py-4">
              <p className="font-sans text-xs uppercase tracking-[0.22em] text-muted-foreground">
                {copy[locale].detailLabel as string}
              </p>
              <p className="mt-2 break-all font-mono text-sm text-muted-foreground">
                {error.digest}
              </p>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
