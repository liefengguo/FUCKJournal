import type { Locale } from "@/i18n/routing";
import type { ManuscriptPreview } from "@/lib/manuscript-preview";
import { DocxManuscriptViewer } from "@/components/submissions/docx-manuscript-viewer";

type ManuscriptDocumentViewProps = {
  locale: Locale;
  preview: ManuscriptPreview;
  showDownloadLink?: boolean;
  printMode?: boolean;
};

export function ManuscriptDocumentView({
  locale,
  preview,
  showDownloadLink = true,
  printMode = false,
}: ManuscriptDocumentViewProps) {
  if (preview.kind === "pdf") {
    return (
      <section className="manuscript-document-view">
        <div className="manuscript-document-pdf-shell">
          <iframe
            title={preview.fileName}
            src={preview.src}
            className="manuscript-document-pdf-frame"
          />
        </div>
        {showDownloadLink && preview.downloadUrl ? (
          <p className="manuscript-document-meta">
            <a href={preview.downloadUrl} className="article-reading-link">
              {locale === "zh" ? "打开提交 PDF" : "Open submitted PDF"}
            </a>
          </p>
        ) : null}
      </section>
    );
  }

  return (
    <section className="manuscript-document-view">
      <DocxManuscriptViewer locale={locale} src={preview.src} printMode={printMode} />
      {showDownloadLink && preview.downloadUrl ? (
        <p className="manuscript-document-meta">
          <a href={preview.downloadUrl} className="article-reading-link">
            {locale === "zh" ? "下载提交的 DOCX" : "Download submitted DOCX"}
          </a>
        </p>
      ) : null}
    </section>
  );
}
