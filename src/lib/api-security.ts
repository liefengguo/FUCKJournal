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
