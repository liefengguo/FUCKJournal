import { NextResponse } from "next/server";

import { jsonNoStore } from "@/lib/api-security";
import {
  getRequestMeta,
  logOperationalFailure,
  logOperationalWarning,
} from "@/lib/observability";
import { readStoredFile } from "@/lib/storage";
import { getPublishedSubmissionBySlug } from "@/lib/submissions";

type RouteContext = {
  params: {
    slug: string;
  };
};

export async function GET(request: Request, { params }: RouteContext) {
  const requestMeta = getRequestMeta(request);
  const submission = await getPublishedSubmissionBySlug(params.slug);

  if (!submission?.manuscriptStorageKey || !submission.manuscriptFileName) {
    logOperationalWarning("publication.preview_asset.not_found", {
      ...requestMeta,
      slug: params.slug,
    });
    return jsonNoStore({ errorCode: "asset-not-found" }, { status: 404 });
  }

  try {
    const file = await readStoredFile(
      submission.manuscriptStorageProvider,
      submission.manuscriptStorageKey,
    );
    const headers = new Headers();
    headers.set("Cache-Control", "public, max-age=60");
    headers.set(
      "Content-Disposition",
      `inline; filename="${encodeURIComponent(submission.manuscriptFileName)}"`,
    );
    headers.set(
      "Content-Type",
      file.contentType ??
        submission.manuscriptMimeType ??
        "application/octet-stream",
    );

    return new NextResponse(new Uint8Array(file.buffer), {
      status: 200,
      headers,
    });
  } catch (error) {
    logOperationalFailure("publication.preview_asset.download_failure", error, {
      ...requestMeta,
      slug: params.slug,
    });
    return jsonNoStore({ errorCode: "download-failed" }, { status: 400 });
  }
}
