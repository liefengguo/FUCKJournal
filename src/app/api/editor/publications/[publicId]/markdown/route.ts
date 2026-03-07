import { getServerSession } from "next-auth";

import { authOptions } from "@/auth";
import { jsonNoStore } from "@/lib/api-security";
import { buildMarkdownDraft } from "@/lib/publication-export";
import { isStaffRole } from "@/lib/submission-status";
import { getPublicationExportSource } from "@/lib/submissions";

type RouteContext = {
  params: {
    publicId: string;
  };
};

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_: Request, { params }: RouteContext) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return jsonNoStore({ errorCode: "auth-required" }, { status: 401 });
  }

  if (!isStaffRole(session.user.role)) {
    return jsonNoStore({ errorCode: "editor-only" }, { status: 403 });
  }

  const submission = await getPublicationExportSource(params.publicId);

  if (!submission) {
    return jsonNoStore({ errorCode: "submission-not-found" }, { status: 404 });
  }

  const markdown = buildMarkdownDraft(submission);
  const fileName = `${submission.publicationSlug ?? submission.publicId.toLowerCase()}-draft.md`;

  return new Response(markdown, {
    status: 200,
    headers: {
      "Cache-Control": "no-store",
      "Content-Type": "text/markdown; charset=utf-8",
      "Content-Disposition": `attachment; filename="${encodeURIComponent(fileName)}"`,
    },
  });
}
