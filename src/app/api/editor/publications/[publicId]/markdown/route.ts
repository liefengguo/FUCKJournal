import { getServerSession } from "next-auth";

import { authOptions } from "@/auth";
import { jsonNoStore } from "@/lib/api-security";
import {
  getRequestMeta,
  logOperationalFailure,
  logOperationalWarning,
} from "@/lib/observability";
import { buildPublicationMarkdownRecord } from "@/lib/publication-export";
import { isStaffRole } from "@/lib/submission-status";
import { getPublicationExportSource } from "@/lib/submissions";
import { publicIdSchema } from "@/lib/validations/submission";

type RouteContext = {
  params: {
    publicId: string;
  };
};

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request, { params }: RouteContext) {
  const requestMeta = getRequestMeta(request);
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return jsonNoStore({ errorCode: "auth-required" }, { status: 401 });
  }

  if (!isStaffRole(session.user.role)) {
    return jsonNoStore({ errorCode: "editor-only" }, { status: 403 });
  }

  const parsedPublicId = publicIdSchema.safeParse(params.publicId);

  if (!parsedPublicId.success) {
    logOperationalWarning("publication.export.markdown.invalid_public_id", {
      ...requestMeta,
      userId: session.user.id,
      publicId: params.publicId,
    });
    return jsonNoStore({ errorCode: "invalid-public-id" }, { status: 400 });
  }

  try {
    const submission = await getPublicationExportSource(parsedPublicId.data);

    if (!submission) {
      return jsonNoStore({ errorCode: "submission-not-found" }, { status: 404 });
    }

    const markdown = buildPublicationMarkdownRecord(submission);
    const fileName = `${submission.publicationSlug ?? submission.publicId.toLowerCase()}-record.md`;

    return new Response(markdown, {
      status: 200,
      headers: {
        "Cache-Control": "no-store",
        "Content-Type": "text/markdown; charset=utf-8",
        "Content-Disposition": `attachment; filename="${encodeURIComponent(fileName)}"`,
      },
    });
  } catch (error) {
    logOperationalFailure("publication.export.markdown.failure", error, {
      ...requestMeta,
      userId: session.user.id,
      publicId: parsedPublicId.data,
    });
    return jsonNoStore({ errorCode: "export-failed" }, { status: 500 });
  }
}
