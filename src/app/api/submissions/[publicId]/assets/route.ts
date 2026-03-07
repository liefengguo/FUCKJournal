import { getServerSession } from "next-auth";

import { authOptions } from "@/auth";
import { jsonNoStore, hasTrustedOrigin } from "@/lib/api-security";
import { replaceSubmissionAsset, SubmissionError } from "@/lib/submissions";
import { uploadKinds } from "@/lib/validations/submission";

type RouteContext = {
  params: {
    publicId: string;
  };
};

export async function POST(request: Request, { params }: RouteContext) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return jsonNoStore({ errorCode: "auth-required" }, { status: 401 });
  }

  if (!hasTrustedOrigin(request)) {
    return jsonNoStore({ errorCode: "forbidden-origin" }, { status: 403 });
  }

  try {
    const formData = await request.formData();
    const kind = formData.get("kind");
    const file = formData.get("file");

    if (
      typeof kind !== "string" ||
      !uploadKinds.includes(kind as (typeof uploadKinds)[number])
    ) {
      return jsonNoStore({ errorCode: "invalid-draft-input" }, { status: 400 });
    }

    if (!(file instanceof File) || file.size === 0) {
      return jsonNoStore({ errorCode: "invalid-draft-input" }, { status: 400 });
    }

    const uploadKind = kind as (typeof uploadKinds)[number];
    const submission = await replaceSubmissionAsset(
      session.user,
      params.publicId,
      uploadKind,
      file,
    );

    return jsonNoStore(
      {
        ok: true,
        noticeCode: "asset-uploaded",
        submission: {
          publicId: submission.publicId,
          manuscriptFileName: submission.manuscriptFileName,
          manuscriptMimeType: submission.manuscriptMimeType,
          manuscriptSizeBytes: submission.manuscriptSizeBytes,
          sourceArchiveFileName: submission.sourceArchiveFileName,
          sourceArchiveMimeType: submission.sourceArchiveMimeType,
          sourceArchiveSizeBytes: submission.sourceArchiveSizeBytes,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    const errorCode =
      error instanceof SubmissionError ? error.code : "upload-failed";

    return jsonNoStore({ errorCode }, { status: 400 });
  }
}
