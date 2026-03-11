"use client";

import { useState } from "react";

import type { Locale } from "@/i18n/routing";
import { getSubmissionError } from "@/lib/feedback";
import { getLocalizedHref } from "@/lib/site";
import { getSubmissionUiCopy } from "@/lib/submission-ui-copy";
import { Button } from "@/components/ui/button";

type ExportFormat = "markdown" | "json";

type ExportMessage = {
  type: "success" | "error";
  text: string;
};

type PublicationExportPanelProps = {
  locale: Locale;
  publicId: string;
};

function getDownloadName(response: Response, fallback: string) {
  const disposition = response.headers.get("content-disposition");

  if (!disposition) {
    return fallback;
  }

  const encodedMatch = disposition.match(/filename\*=UTF-8''([^;]+)/i);

  if (encodedMatch?.[1]) {
    return decodeURIComponent(encodedMatch[1]);
  }

  const match = disposition.match(/filename="?([^"]+)"?/i);
  return match?.[1] ? decodeURIComponent(match[1]) : fallback;
}

function triggerDownload(blob: Blob, fileName: string) {
  const objectUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = objectUrl;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();

  window.setTimeout(() => {
    URL.revokeObjectURL(objectUrl);
  }, 1000);
}

export function PublicationExportPanel({
  locale,
  publicId,
}: PublicationExportPanelProps) {
  const copy = getSubmissionUiCopy(locale).publication;
  const previewHref = getLocalizedHref(
    locale,
    `/editor/publications/${publicId}/preview`,
  );
  const printHref = `${previewHref}?print=1`;
  const [activeFormat, setActiveFormat] = useState<ExportFormat | null>(null);
  const [messages, setMessages] = useState<
    Record<ExportFormat, ExportMessage | null>
  >({
    markdown: null,
    json: null,
  });

  async function exportRecord(format: ExportFormat) {
    setActiveFormat(format);
    setMessages((current) => ({ ...current, [format]: null }));

    try {
      const response = await fetch(`/api/editor/publications/${publicId}/${format}`, {
        method: "GET",
        cache: "no-store",
      });

      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as
          | { errorCode?: string }
          | null;
        setMessages((current) => ({
          ...current,
          [format]: {
            type: "error",
            text:
              getSubmissionError(locale, body?.errorCode ?? "export-failed") ??
              (locale === "zh" ? "导出失败。" : "Export failed."),
          },
        }));
        return;
      }

      const blob = await response.blob();
      const fallbackName =
        format === "markdown"
          ? `${publicId.toLowerCase()}-record.md`
          : `${publicId.toLowerCase()}-record.json`;
      const fileName = getDownloadName(response, fallbackName);
      triggerDownload(blob, fileName);

      setMessages((current) => ({
        ...current,
        [format]: {
          type: "success",
          text:
            locale === "zh"
              ? "导出已开始，请检查浏览器下载列表。"
              : "Export started. Check your browser downloads.",
        },
      }));
    } catch {
      setMessages((current) => ({
        ...current,
        [format]: {
          type: "error",
          text:
            getSubmissionError(locale, "export-failed") ??
            (locale === "zh" ? "导出失败。" : "Export failed."),
        },
      }));
    } finally {
      setActiveFormat(null);
    }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-[24px] border border-border/60 px-5 py-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <p className="font-serif text-lg">{copy.previewLabel}</p>
            <p className="font-serif text-base text-muted-foreground">
              {copy.previewHint}
            </p>
          </div>
          <Button asChild size="sm">
            <a href={previewHref} target="_blank" rel="noreferrer">
              {copy.previewLabel}
            </a>
          </Button>
        </div>
      </div>

      <div className="rounded-[24px] border border-border/60 px-5 py-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <p className="font-serif text-lg">{copy.printPdfLabel}</p>
            <p className="font-serif text-base text-muted-foreground">
              {copy.printPdfHint}
            </p>
          </div>
          <Button asChild variant="outline" size="sm">
            <a href={printHref} target="_blank" rel="noreferrer">
              {copy.printPdfLabel}
            </a>
          </Button>
        </div>
      </div>

      <div className="rounded-[24px] border border-border/60 px-5 py-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <p className="font-serif text-lg">{copy.exportMarkdownLabel}</p>
            <p className="font-serif text-base text-muted-foreground">
              {copy.exportMarkdownHint}
            </p>
          </div>
          <Button
            size="sm"
            disabled={activeFormat !== null}
            data-testid="publication-export-markdown"
            onClick={() => void exportRecord("markdown")}
          >
            {activeFormat === "markdown"
              ? `${copy.exportMarkdownLabel}...`
              : copy.exportMarkdownLabel}
          </Button>
        </div>
        {messages.markdown ? (
          <p
            className={`mt-4 font-serif text-base ${
              messages.markdown.type === "error"
                ? "text-journal-red"
                : "text-muted-foreground"
            }`}
          >
            {messages.markdown.text}
          </p>
        ) : null}
      </div>

      <div className="rounded-[24px] border border-border/60 px-5 py-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <p className="font-serif text-lg">{copy.exportJsonLabel}</p>
            <p className="font-serif text-base text-muted-foreground">
              {copy.exportJsonHint}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            disabled={activeFormat !== null}
            data-testid="publication-export-json"
            onClick={() => void exportRecord("json")}
          >
            {activeFormat === "json"
              ? `${copy.exportJsonLabel}...`
              : copy.exportJsonLabel}
          </Button>
        </div>
        {messages.json ? (
          <p
            className={`mt-4 font-serif text-base ${
              messages.json.type === "error"
                ? "text-journal-red"
                : "text-muted-foreground"
            }`}
          >
            {messages.json.text}
          </p>
        ) : null}
      </div>
    </div>
  );
}
