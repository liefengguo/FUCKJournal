import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/auth";
import { jsonNoStore } from "@/lib/api-security";
import { readStoredFile } from "@/lib/storage";
import {
  getSubmissionAssetForViewer,
  SubmissionError,
} from "@/lib/submissions";
import { uploadKinds } from "@/lib/validations/submission";

type RouteContext = {
  params: {
    publicId: string;
    kind: string;
  };
};

export async function GET(_: Request, { params }: RouteContext) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return jsonNoStore({ errorCode: "auth-required" }, { status: 401 });
  }

  if (!uploadKinds.includes(params.kind as (typeof uploadKinds)[number])) {
    return jsonNoStore({ errorCode: "asset-not-found" }, { status: 404 });
  }

  try {
    const asset = await getSubmissionAssetForViewer(
      session.user,
      params.publicId,
      params.kind as (typeof uploadKinds)[number],
    );

    const file = await readStoredFile(asset.storageProvider, asset.storageKey);
    const headers = new Headers();
    headers.set("Cache-Control", "no-store");
    headers.set(
      "Content-Disposition",
      `attachment; filename="${encodeURIComponent(asset.fileName)}"`,
    );
    headers.set("Content-Type", file.contentType ?? asset.mimeType);

    return new NextResponse(file.buffer, {
      status: 200,
      headers,
    });
  } catch (error) {
    const errorCode =
      error instanceof SubmissionError ? error.code : "download-failed";

    return jsonNoStore({ errorCode }, { status: 400 });
  }
}
