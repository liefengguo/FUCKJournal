import { getServerSession } from "next-auth";

import { authOptions } from "@/auth";
import {
  buildRateLimitHeaders,
  hasTrustedOrigin,
  isMultipartRequest,
  isRequestTooLarge,
  jsonNoStore,
} from "@/lib/api-security";
import {
  getRequestMeta,
  logOperationalFailure,
  logOperationalWarning,
} from "@/lib/observability";
import { checkRateLimit, getEnvNumber } from "@/lib/rate-limit";
import { replaceSubmissionAsset, SubmissionError } from "@/lib/submissions";
import { publicIdSchema, uploadKinds } from "@/lib/validations/submission";

type RouteContext = {
  params: {
    publicId: string;
  };
};

export async function POST(request: Request, { params }: RouteContext) {
  const requestMeta = getRequestMeta(request);
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return jsonNoStore({ errorCode: "auth-required" }, { status: 401 });
  }

  const parsedPublicId = publicIdSchema.safeParse(params.publicId);

  if (!parsedPublicId.success) {
    logOperationalWarning("submission.upload.invalid_public_id", {
      ...requestMeta,
      userId: session.user.id,
      publicId: params.publicId,
    });
    return jsonNoStore({ errorCode: "invalid-public-id" }, { status: 400 });
  }

  if (!hasTrustedOrigin(request)) {
    logOperationalWarning("submission.upload.forbidden_origin", {
      ...requestMeta,
      userId: session.user.id,
      publicId: parsedPublicId.data,
    });
    return jsonNoStore({ errorCode: "forbidden-origin" }, { status: 403 });
  }

  if (!isMultipartRequest(request)) {
    logOperationalWarning("submission.upload.invalid_content_type", {
      ...requestMeta,
      userId: session.user.id,
      publicId: parsedPublicId.data,
    });
    return jsonNoStore({ errorCode: "unsupported-media-type" }, { status: 415 });
  }

  const uploadRequestLimit =
    getEnvNumber("MAX_MANUSCRIPT_PDF_BYTES", 25 * 1024 * 1024) + 1024 * 1024;

  if (isRequestTooLarge(request, uploadRequestLimit)) {
    logOperationalWarning("submission.upload.request_too_large", {
      ...requestMeta,
      userId: session.user.id,
      publicId: parsedPublicId.data,
    });
    return jsonNoStore({ errorCode: "request-too-large" }, { status: 413 });
  }

  const uploadRateLimit = checkRateLimit({
    scope: "submission-upload",
    identifier: `${requestMeta.ip}:${session.user.id}`,
    limit: getEnvNumber("UPLOAD_RATE_LIMIT_MAX", 20),
    windowMs: getEnvNumber("UPLOAD_RATE_LIMIT_WINDOW_MS", 15 * 60 * 1000),
  });
  const rateLimitHeaders = buildRateLimitHeaders(uploadRateLimit);
  const rateLimitedHeaders = buildRateLimitHeaders(uploadRateLimit, {
    includeRetryAfter: true,
  });

  if (!uploadRateLimit.ok) {
    logOperationalWarning("submission.upload.rate_limited", {
      ...requestMeta,
      userId: session.user.id,
      publicId: parsedPublicId.data,
      retryAfterSeconds: uploadRateLimit.retryAfterSeconds,
    });
    return jsonNoStore(
      { errorCode: "rate-limit-exceeded" },
      { status: 429, headers: rateLimitedHeaders },
    );
  }

  try {
    const formData = await request.formData();
    const kind = formData.get("kind");
    const file = formData.get("file");

    if (
      typeof kind !== "string" ||
      !uploadKinds.includes(kind as (typeof uploadKinds)[number])
    ) {
      logOperationalWarning("submission.upload.invalid_kind", {
        ...requestMeta,
        userId: session.user.id,
        publicId: parsedPublicId.data,
        kind,
      });
      return jsonNoStore(
        { errorCode: "invalid-draft-input" },
        { status: 400, headers: rateLimitHeaders },
      );
    }

    if (!(file instanceof File) || file.size === 0) {
      logOperationalWarning("submission.upload.invalid_file", {
        ...requestMeta,
        userId: session.user.id,
        publicId: parsedPublicId.data,
        kind,
      });
      return jsonNoStore(
        { errorCode: "invalid-draft-input" },
        { status: 400, headers: rateLimitHeaders },
      );
    }

    const uploadKind = kind as (typeof uploadKinds)[number];
    const maxBytes = getEnvNumber("MAX_MANUSCRIPT_PDF_BYTES", 25 * 1024 * 1024);

    if (file.size > maxBytes) {
      logOperationalWarning("submission.upload.file_too_large", {
        ...requestMeta,
        userId: session.user.id,
        publicId: parsedPublicId.data,
        kind: uploadKind,
        fileSize: file.size,
        maxBytes,
      });
      return jsonNoStore(
        { errorCode: "upload-too-large" },
        { status: 413, headers: rateLimitHeaders },
      );
    }

    const submission = await replaceSubmissionAsset(
      session.user,
      parsedPublicId.data,
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
        },
      },
      { status: 200, headers: rateLimitHeaders },
    );
  } catch (error) {
    const errorCode =
      error instanceof SubmissionError ? error.code : "upload-failed";

    logOperationalFailure("submission.upload.failure", error, {
      ...requestMeta,
      userId: session.user.id,
      publicId: parsedPublicId.data,
    });

    return jsonNoStore({ errorCode }, { status: 400, headers: rateLimitHeaders });
  }
}
