import bcrypt from "bcryptjs";

import { authOptions } from "@/auth";
import {
  buildRateLimitHeaders,
  hasTrustedOrigin,
  isJsonRequest,
  isRequestTooLarge,
  jsonNoStore,
} from "@/lib/api-security";
import { db } from "@/lib/db";
import {
  getRequestMeta,
  logOperationalFailure,
  logOperationalWarning,
  maskEmail,
} from "@/lib/observability";
import { checkRateLimit, getEnvNumber } from "@/lib/rate-limit";
import { signUpSchema } from "@/lib/validations/auth";
import { getServerSession } from "next-auth";

export async function POST(request: Request) {
  const requestMeta = getRequestMeta(request);
  const registerRateLimit = checkRateLimit({
    scope: "auth-register",
    identifier: requestMeta.ip,
    limit: getEnvNumber("AUTH_REGISTER_RATE_LIMIT_MAX", 5),
    windowMs: getEnvNumber("AUTH_RATE_LIMIT_WINDOW_MS", 15 * 60 * 1000),
  });
  const rateLimitHeaders = buildRateLimitHeaders(registerRateLimit);
  const rateLimitedHeaders = buildRateLimitHeaders(registerRateLimit, {
    includeRetryAfter: true,
  });

  try {
    if (!isJsonRequest(request)) {
      logOperationalWarning("auth.register.invalid_content_type", requestMeta);
      return jsonNoStore(
        { errorCode: "unsupported-media-type" },
        { status: 415, headers: rateLimitHeaders },
      );
    }

    if (isRequestTooLarge(request, getEnvNumber("MAX_AUTH_JSON_BYTES", 16 * 1024))) {
      logOperationalWarning("auth.register.request_too_large", requestMeta);
      return jsonNoStore(
        { errorCode: "request-too-large" },
        { status: 413, headers: rateLimitHeaders },
      );
    }

    if (!hasTrustedOrigin(request)) {
      logOperationalWarning("auth.register.forbidden_origin", requestMeta);
      return jsonNoStore(
        { errorCode: "forbidden-origin" },
        { status: 403, headers: rateLimitHeaders },
      );
    }

    if (!registerRateLimit.ok) {
      logOperationalWarning("auth.register.rate_limited", {
        ...requestMeta,
        retryAfterSeconds: registerRateLimit.retryAfterSeconds,
      });
      return jsonNoStore(
        { errorCode: "rate-limit-exceeded" },
        { status: 429, headers: rateLimitedHeaders },
      );
    }

    const session = await getServerSession(authOptions);

    if (session?.user) {
      logOperationalWarning("auth.register.already_authenticated", {
        ...requestMeta,
        userId: session.user.id,
        email: maskEmail(session.user.email),
      });
      return jsonNoStore(
        { errorCode: "already-authenticated" },
        { status: 403, headers: rateLimitHeaders },
      );
    }

    const payload = await request.json().catch(() => null);
    const parsed = signUpSchema.safeParse(payload);

    if (!parsed.success) {
      logOperationalWarning("auth.register.invalid_payload", {
        ...requestMeta,
        email:
          payload && typeof payload === "object" && "email" in payload
            ? maskEmail(String(payload.email))
            : null,
      });
      return jsonNoStore(
        { errorCode: "invalid-sign-up-input" },
        { status: 400, headers: rateLimitHeaders },
      );
    }

    const existingUser = await db.user.findUnique({
      where: { email: parsed.data.email },
      select: { id: true },
    });

    if (existingUser) {
      logOperationalWarning("auth.register.email_taken", {
        ...requestMeta,
        email: maskEmail(parsed.data.email),
      });
      return jsonNoStore(
        { errorCode: "email-taken" },
        { status: 409, headers: rateLimitHeaders },
      );
    }

    const passwordHash = await bcrypt.hash(parsed.data.password, 12);

    await db.user.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        passwordHash,
      },
      select: { id: true },
    });

    return jsonNoStore({ ok: true }, { status: 201, headers: rateLimitHeaders });
  } catch (error) {
    logOperationalFailure("auth.register.failure", error, requestMeta);
    return jsonNoStore(
      { errorCode: "registration-unavailable" },
      { status: 500, headers: rateLimitHeaders },
    );
  }
}
