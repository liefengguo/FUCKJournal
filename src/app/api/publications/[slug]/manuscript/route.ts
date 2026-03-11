import { NextResponse } from "next/server";

import { jsonNoStore } from "@/lib/api-security";
import {
  getRequestMeta,
  logOperationalFailure,
  logOperationalWarning,
} from "@/lib/observability";
import { isPublicPublicationDownloadEnabled } from "@/lib/publication-downloads";
import {
  getPublicationPdfFileName,
  loadPublicationPdfAsset,
  renderPublicationPdfSnapshot,
} from "@/lib/publication-pdf";
import { getPublishedSubmissionBySlug } from "@/lib/submissions";

type RouteContext = {
  params: {
    slug: string;
  };
};

export async function GET(request: Request, { params }: RouteContext) {
  const requestMeta = getRequestMeta(request);

  if (!isPublicPublicationDownloadEnabled()) {
    logOperationalWarning("publication.asset.disabled", {
      ...requestMeta,
      slug: params.slug,
    });
    return jsonNoStore({ errorCode: "asset-not-available" }, { status: 404 });
  }

  const submission = await getPublishedSubmissionBySlug(params.slug);

  if (!submission?.manuscriptFileName) {
    logOperationalWarning("publication.asset.not_found", {
      ...requestMeta,
      slug: params.slug,
    });
    return jsonNoStore({ errorCode: "asset-not-found" }, { status: 404 });
  }

  try {
    const url = new URL(request.url);
    const inlineRequested = url.searchParams.get("inline") === "1";
    const renderLocale =
      submission.publicationLocale === "zh" || submission.manuscriptLanguage === "zh"
        ? "zh"
        : "en";
    const directPdfAsset = await loadPublicationPdfAsset(submission);
    const pdfBuffer =
      directPdfAsset?.buffer ??
      (await renderPublicationPdfSnapshot({
        slug: params.slug,
        locale: renderLocale,
        origin: url.origin,
      }));
    const fileName =
      directPdfAsset?.fileName ?? getPublicationPdfFileName(submission);
    const headers = new Headers();
    headers.set("Cache-Control", "public, max-age=60");
    headers.set(
      "Content-Disposition",
      `${inlineRequested ? "inline" : "attachment"}; filename="${encodeURIComponent(fileName)}"`,
    );
    headers.set("Content-Type", "application/pdf");

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers,
    });
  } catch (error) {
    logOperationalFailure("publication.asset.download_failure", error, {
      ...requestMeta,
      slug: params.slug,
    });
    return jsonNoStore({ errorCode: "download-failed" }, { status: 400 });
  }
}
