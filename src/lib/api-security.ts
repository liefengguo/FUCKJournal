import { NextResponse } from "next/server";

type JsonBody = Record<string, unknown>;

export function jsonNoStore(body: JsonBody, init?: ResponseInit) {
  const headers = new Headers(init?.headers);
  headers.set("Cache-Control", "no-store");

  return NextResponse.json(body, {
    ...init,
    headers,
  });
}

export function isJsonRequest(request: Request) {
  const contentType = request.headers.get("content-type");

  return Boolean(contentType && contentType.includes("application/json"));
}

export function isMultipartRequest(request: Request) {
  const contentType = request.headers.get("content-type");

  return Boolean(contentType && contentType.includes("multipart/form-data"));
}

export function hasTrustedOrigin(request: Request) {
  const origin = request.headers.get("origin");
  const host =
    request.headers.get("x-forwarded-host") ?? request.headers.get("host");

  if (!host) {
    return false;
  }

  if (!origin) {
    return process.env.NODE_ENV !== "production";
  }

  try {
    const originUrl = new URL(origin);
    return originUrl.host === host;
  } catch {
    return false;
  }
}

export function getContentLength(request: Request) {
  const raw = request.headers.get("content-length");

  if (!raw) {
    return null;
  }

  const parsed = Number(raw);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
}

export function isRequestTooLarge(request: Request, maxBytes: number) {
  const contentLength = getContentLength(request);

  return typeof contentLength === "number" && contentLength > maxBytes;
}

export function buildRateLimitHeaders(rateLimit: {
  limit: number;
  remaining: number;
  resetAt: number;
  retryAfterSeconds: number;
}, options?: { includeRetryAfter?: boolean }) {
  const headers = new Headers();
  headers.set("X-RateLimit-Limit", String(rateLimit.limit));
  headers.set("X-RateLimit-Remaining", String(rateLimit.remaining));
  headers.set("X-RateLimit-Reset", String(Math.floor(rateLimit.resetAt / 1000)));

  if (options?.includeRetryAfter) {
    headers.set("Retry-After", String(rateLimit.retryAfterSeconds));
  }

  return headers;
}
