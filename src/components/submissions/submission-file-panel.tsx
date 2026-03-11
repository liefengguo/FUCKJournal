"use client";

import { useState, useTransition } from "react";

import { useRouter } from "next/navigation";

import type { Locale } from "@/i18n/routing";
import { getSubmissionError, getSubmissionNotice } from "@/lib/feedback";
import { getSubmissionUiCopy } from "@/lib/submission-ui-copy";
import { Button } from "@/components/ui/button";

type SubmissionFileAsset = {
  kind: "manuscript";
  fileName: string | null;
  mimeType: string | null;
  sizeBytes: number | null;
  href: string;
};

type SubmissionFilePanelProps = {
  locale: Locale;
  publicId: string;
  editable: boolean;
  assets: SubmissionFileAsset[];
};

function formatBytes(sizeBytes: number | null) {
  if (!sizeBytes) {
    return null;
  }

  if (sizeBytes < 1024) {
    return `${sizeBytes} B`;
  }

  if (sizeBytes < 1024 * 1024) {
    return `${Math.round(sizeBytes / 1024)} KB`;
  }

  return `${(sizeBytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function SubmissionFilePanel({
  locale,
  publicId,
  editable,
  assets,
}: SubmissionFilePanelProps) {
  const copy = getSubmissionUiCopy(locale).uploads;
  const router = useRouter();
  const [messages, setMessages] = useState<Record<string, { type: "success" | "error"; text: string } | null>>({});
  const [pendingKind, setPendingKind] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function uploadFile(kind: "manuscript", formData: FormData) {
    if (!editable) {
      return;
    }

    setPendingKind(kind);
    setMessages((current) => ({ ...current, [kind]: null }));

    startTransition(async () => {
      try {
        const response = await fetch(`/api/submissions/${publicId}/assets`, {
          method: "POST",
          body: formData,
        });

        const body = (await response.json().catch(() => null)) as
          | { errorCode?: string; noticeCode?: string }
          | null;

        if (!response.ok) {
          setMessages((current) => ({
            ...current,
            [kind]: {
              type: "error",
              text:
                getSubmissionError(locale, body?.errorCode) ??
                (locale === "zh" ? "上传失败。" : "Upload failed."),
            },
          }));
          setPendingKind(null);
          return;
        }

        setMessages((current) => ({
          ...current,
          [kind]: {
            type: "success",
            text:
              getSubmissionNotice(locale, body?.noticeCode) ??
              (locale === "zh" ? "上传成功。" : "Upload successful."),
          },
        }));
        setPendingKind(null);
        router.refresh();
      } catch {
        setMessages((current) => ({
          ...current,
          [kind]: {
            type: "error",
            text: locale === "zh" ? "上传失败。" : "Upload failed.",
          },
        }));
        setPendingKind(null);
      }
    });
  }

  return (
    <div className="space-y-5">
      {assets.map((asset) => {
        const isAssetPending = isPending && pendingKind === asset.kind;
        const message = messages[asset.kind];
        const label = copy.manuscriptLabel;
        const hint = copy.manuscriptHint;

        return (
          <div
            key={asset.kind}
            className="rounded-[24px] border border-border/60 px-5 py-5"
            data-testid={`submission-file-panel-${asset.kind}`}
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-2">
                <p className="font-display text-2xl">{label}</p>
                <p className="font-serif text-base text-muted-foreground">{hint}</p>
              </div>
              {asset.fileName ? (
                <a
                  href={asset.href}
                  data-testid={`submission-file-download-${asset.kind}`}
                  className="font-sans text-xs uppercase tracking-[0.2em] text-foreground underline-offset-4 hover:underline"
                >
                  {copy.downloadButton}
                </a>
              ) : null}
            </div>

            <div className="mt-4 rounded-[20px] border border-border/60 bg-background/60 px-4 py-4">
              <p className="font-serif text-lg" data-testid={`submission-file-current-${asset.kind}`}>
                {asset.fileName || copy.noFile}
              </p>
              {asset.fileName ? (
                <p className="mt-2 font-sans text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  {[asset.mimeType, formatBytes(asset.sizeBytes)].filter(Boolean).join(" · ")}
                </p>
              ) : null}
            </div>

            {editable ? (
              <form
                className="mt-4 space-y-3"
                data-testid={`submission-file-upload-form-${asset.kind}`}
                onSubmit={(event) => {
                  event.preventDefault();
                  const formData = new FormData(event.currentTarget);
                  void uploadFile(asset.kind, formData);
                }}
              >
                <input type="hidden" name="kind" value={asset.kind} />
                <input
                  name="file"
                  type="file"
                  accept=".pdf,application/pdf"
                  required
                  data-testid={`submission-file-input-${asset.kind}`}
                  className="block w-full font-sans text-sm text-muted-foreground file:mr-4 file:rounded-full file:border-0 file:bg-secondary file:px-4 file:py-2 file:text-sm file:font-medium file:text-secondary-foreground"
                />
                <p className="font-serif text-base text-muted-foreground">
                  {copy.replaceHint}
                </p>
                {message ? (
                  <p
                    className={`font-serif text-base ${message.type === "error" ? "text-journal-red" : "text-muted-foreground"}`}
                  >
                    {message.text}
                  </p>
                ) : null}
                <Button
                  type="submit"
                  size="sm"
                  disabled={isAssetPending}
                  data-testid={`submission-file-upload-button-${asset.kind}`}
                >
                  {isAssetPending ? copy.uploadingButton : copy.uploadButton}
                </Button>
              </form>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
