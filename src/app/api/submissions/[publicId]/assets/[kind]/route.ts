import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/auth";
import { jsonNoStore } from "@/lib/api-security";
import {
  getRequestMeta,
  logOperationalFailure,
  logOperationalWarning,
} from "@/lib/observability";
import { readStoredFile } from "@/lib/storage";
import {
  getSubmissionAssetForViewer,
  SubmissionError,
} from "@/lib/submissions";
import { publicIdSchema, uploadKinds } from "@/lib/validations/submission";

type RouteContext = {
  params: {
    publicId: string;
    kind: string;
  };
};

export async function GET(request: Request, { params }: RouteContext) {
  const requestMeta = getRequestMeta(request);
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return jsonNoStore({ errorCode: "auth-required" }, { status: 401 });
  }

  const parsedPublicId = publicIdSchema.safeParse(params.publicId);

  if (!parsedPublicId.success) {
    logOperationalWarning("submission.asset.invalid_public_id", {
      ...requestMeta,
      userId: session.user.id,
      publicId: params.publicId,
      kind: params.kind,
    });
    return jsonNoStore({ errorCode: "invalid-public-id" }, { status: 400 });
  }

  if (!uploadKinds.includes(params.kind as (typeof uploadKinds)[number])) {
    logOperationalWarning("submission.asset.invalid_kind", {
      ...requestMeta,
      userId: session.user.id,
      publicId: parsedPublicId.data,
      kind: params.kind,
    });
    return jsonNoStore({ errorCode: "asset-not-found" }, { status: 404 });
  }

  try {
    const asset = await getSubmissionAssetForViewer(session.user, parsedPublicId.data);

    const file = await readStoredFile(asset.storageProvider, asset.storageKey);
    const url = new URL(request.url);
    const inlineRequested = url.searchParams.get("inline") === "1";
    const headers = new Headers();
    headers.set("Cache-Control", "no-store");
    headers.set(
      "Content-Disposition",
      `${inlineRequested ? "inline" : "attachment"}; filename="${encodeURIComponent(asset.fileName)}"`,
    );
    headers.set("Content-Type", file.contentType ?? asset.mimeType);

    return new NextResponse(file.buffer, {
      status: 200,
      headers,
    });
  } catch (error) {
    const errorCode =
      error instanceof SubmissionError ? error.code : "download-failed";

    logOperationalFailure("submission.asset.download_failure", error, {
      ...requestMeta,
      userId: session.user.id,
      publicId: parsedPublicId.data,
      kind: params.kind,
    });

    return jsonNoStore({ errorCode }, { status: 400 });
  }
}
