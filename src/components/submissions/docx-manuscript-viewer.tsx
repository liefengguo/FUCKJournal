"use client";

import { useEffect, useRef, useState } from "react";

import type { Locale } from "@/i18n/routing";

type DocxManuscriptViewerProps = {
  locale: Locale;
  src: string;
  printMode?: boolean;
};

type ViewerState = "loading" | "ready" | "error";

export function DocxManuscriptViewer({
  locale,
  src,
  printMode = false,
}: DocxManuscriptViewerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [state, setState] = useState<ViewerState>("loading");

  useEffect(() => {
    let cancelled = false;
    const mountNode = containerRef.current;

    if (!(mountNode instanceof HTMLDivElement)) {
      return;
    }

    const container = mountNode;

    async function renderDocument() {
      setState("loading");

      try {
        const [{ renderAsync }, response] = await Promise.all([
          import("docx-preview"),
          fetch(src, {
            cache: "no-store",
            credentials: "same-origin",
          }),
        ]);

        if (!response.ok) {
          throw new Error(`Failed to load DOCX manuscript: ${response.status}`);
        }

        const buffer = await response.arrayBuffer();

        if (cancelled) {
          return;
        }

        await renderAsync(buffer, container, undefined, {
          className: "manuscript-docx",
          inWrapper: !printMode,
          hideWrapperOnPrint: false,
          breakPages: true,
          ignoreWidth: false,
          ignoreHeight: false,
          ignoreLastRenderedPageBreak: false,
          renderHeaders: true,
          renderFooters: true,
          renderFootnotes: true,
          renderEndnotes: true,
          renderComments: false,
          renderChanges: false,
          renderAltChunks: true,
          useBase64URL: true,
        });

        if (!cancelled) {
          setState("ready");
        }
      } catch {
        if (!cancelled) {
          container.replaceChildren();
          setState("error");
        }
      }
    }

    void renderDocument();

    return () => {
      cancelled = true;
      container.replaceChildren();
    };
  }, [printMode, src]);

  return (
    <div
      className={`manuscript-document-docx-shell${printMode ? " manuscript-document-docx-shell--print" : ""}`}
    >
      {!printMode && state === "loading" ? (
        <p className="manuscript-document-status">
          {locale === "zh"
            ? "正在按原稿版式渲染 DOCX 文稿……"
            : "Rendering the submitted DOCX manuscript…"}
        </p>
      ) : null}

      {state === "error" ? (
        <div className="manuscript-document-fallback">
          <h2>{locale === "zh" ? "DOCX 预览失败" : "DOCX preview failed"}</h2>
          <p>
            {locale === "zh"
              ? "当前浏览器预览没有成功完成，请先使用下面的原始文件链接查看稿件。"
              : "The browser preview could not be rendered. Use the original file link below to inspect the manuscript."}
          </p>
        </div>
      ) : null}

      <div
        ref={containerRef}
        className="manuscript-document-docx-canvas"
        aria-live="polite"
      />
    </div>
  );
}
