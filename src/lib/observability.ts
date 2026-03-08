type LogLevel = "info" | "warn" | "error";

type LogPayload = Record<string, unknown>;

function sanitizePayload(payload: LogPayload) {
  return JSON.parse(
    JSON.stringify(payload, (_key, value) => {
      if (value instanceof Error) {
        return {
          name: value.name,
          message: value.message,
          stack: value.stack,
        };
      }

      if (typeof value === "string" && value.length > 2000) {
        return `${value.slice(0, 2000)}…`;
      }

      return value;
    }),
  ) as LogPayload;
}

function writeLog(level: LogLevel, event: string, payload: LogPayload) {
  const logger =
    level === "error" ? console.error : level === "warn" ? console.warn : console.info;

  logger(
    `[ops:${event}]`,
    JSON.stringify(
      {
        level,
        event,
        timestamp: new Date().toISOString(),
        ...sanitizePayload(payload),
      },
      null,
      2,
    ),
  );
}

export function maskEmail(email: string | null | undefined) {
  if (!email) {
    return null;
  }

  const [local, domain] = email.split("@");

  if (!local || !domain) {
    return email;
  }

  if (local.length <= 2) {
    return `${local[0] ?? "*"}*@${domain}`;
  }

  return `${local.slice(0, 2)}***@${domain}`;
}

export function getRequestIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");

  if (forwarded) {
    return forwarded.split(",")[0]?.trim() ?? "unknown";
  }

  return request.headers.get("x-real-ip") ?? "unknown";
}

export function getRequestMeta(request: Request) {
  return {
    method: request.method,
    path: new URL(request.url).pathname,
    ip: getRequestIp(request),
    userAgent: request.headers.get("user-agent") ?? "unknown",
    forwardedHost:
      request.headers.get("x-forwarded-host") ?? request.headers.get("host"),
  };
}

export function logOperationalEvent(event: string, payload: LogPayload = {}) {
  writeLog("info", event, payload);
}

export function logOperationalWarning(event: string, payload: LogPayload = {}) {
  writeLog("warn", event, payload);
}

export function logOperationalFailure(
  event: string,
  error: unknown,
  payload: LogPayload = {},
) {
  writeLog("error", event, {
    ...payload,
    error:
      error instanceof Error
        ? error
        : new Error(typeof error === "string" ? error : "Unknown error"),
  });
}
