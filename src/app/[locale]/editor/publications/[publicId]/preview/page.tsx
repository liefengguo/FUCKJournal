import { unstable_noStore as noStore } from "next/cache";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";

import { requireEditorUser } from "@/lib/auth-guards";
import type { Locale } from "@/i18n/routing";
import { LocaleLink } from "@/components/locale-link";
import { ManuscriptDocumentView } from "@/components/submissions/manuscript-document-view";
import { PrintOnLoad } from "@/components/submissions/print-on-load";
import { PublicationProof } from "@/components/submissions/publication-proof";
import { Button } from "@/components/ui/button";
import { getSubmissionUiCopy } from "@/lib/submission-ui-copy";
import { loadStoredManuscriptPreview } from "@/lib/manuscript-preview";
import { getPublicationExportSource } from "@/lib/submissions";

type PublicationPreviewPageProps = {
  params: {
    locale: Locale;
    publicId: string;
  };
  searchParams?: {
    print?: string;
  };
};

export default async function PublicationPreviewPage({
  params,
  searchParams,
}: PublicationPreviewPageProps) {
  const { locale, publicId } = params;
  noStore();
  setRequestLocale(locale);

  await requireEditorUser(
    locale,
    `/${locale}/editor/publications/${publicId}/preview`,
  );

  const submission = await getPublicationExportSource(publicId);

  if (!submission) {
    notFound();
  }

  const manuscriptPreview = await loadStoredManuscriptPreview({
    fileName: submission.manuscriptFileName,
    mimeType: submission.manuscriptMimeType,
    storageKey: submission.manuscriptStorageKey,
    storageProvider: submission.manuscriptStorageProvider,
    inlineUrl: `/api/submissions/${publicId}/assets/manuscript?inline=1`,
    downloadUrl: `/api/submissions/${publicId}/assets/manuscript`,
  });

  const copy = getSubmissionUiCopy(locale).publication;
  const printRequested = searchParams?.print === "1";

  return (
    <div className="publication-proof-page mx-auto max-w-[1100px] px-5 py-10 sm:px-8 lg:px-10 lg:py-14">
      <PrintOnLoad enabled={printRequested} />

      <section
        data-publication-proof-toolbar
        className="mb-8 flex flex-col gap-4 rounded-[28px] border border-border/70 bg-background/85 px-5 py-5 shadow-sm backdrop-blur-sm sm:px-6"
      >
        <div className="space-y-2">
          <p className="font-display text-3xl leading-tight">{copy.proofTitle}</p>
          <p className="max-w-3xl font-serif text-lg leading-relaxed text-muted-foreground">
            {copy.proofBody}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Button asChild variant="outline" size="sm">
            <LocaleLink
              locale={locale}
              href={`/editor/publications/${publicId}`}
            >
              {copy.proofReturnLabel}
            </LocaleLink>
          </Button>
          <Button asChild size="sm">
            <LocaleLink
              locale={locale}
              href={`/editor/publications/${publicId}/preview?print=1`}
              target="_blank"
            >
              {copy.proofPrintLabel}
            </LocaleLink>
          </Button>
          {printRequested ? (
            <p className="font-serif text-base text-muted-foreground">
              {locale === "zh"
                ? "打印对话框会自动打开；如果浏览器拦截，请使用上面的按钮重试。"
                : "The print dialog should open automatically. If your browser blocks it, use the button above."}
            </p>
          ) : null}
        </div>
      </section>

      {manuscriptPreview ? (
        <div className="mt-8 space-y-4">
          <div className="space-y-2">
            <p className="font-serif text-2xl leading-tight text-foreground">
              {locale === "zh" ? "Manuscript / 全文" : "Manuscript / Full text"}
            </p>
            <p className="font-serif text-base leading-relaxed text-muted-foreground">
              {locale === "zh"
                ? manuscriptPreview.kind === "pdf"
                  ? "当前预览直接读取作者上传的 PDF 稿件。"
                  : "当前预览直接读取作者历史上传的 DOCX 稿件。新投稿现在只接收 PDF 稿件。"
                : manuscriptPreview.kind === "pdf"
                  ? "This preview is rendered directly from the author's uploaded PDF manuscript."
                  : "This preview is rendered from a legacy DOCX manuscript. New submissions now accept PDF manuscripts only."}
            </p>
          </div>
          <ManuscriptDocumentView locale={locale} preview={manuscriptPreview} />
        </div>
      ) : (
        <PublicationProof locale={locale} source={submission} />
      )}
    </div>
  );
}
