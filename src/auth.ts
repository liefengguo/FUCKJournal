import type { NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

import { db } from "@/lib/db";
import {
  logOperationalWarning,
  maskEmail,
} from "@/lib/observability";
import { checkRateLimit, getEnvNumber } from "@/lib/rate-limit";
import { credentialsSchema } from "@/lib/validations/auth";

function getHeaderValue(
  headers: Record<string, string | string[] | undefined> | undefined,
  name: string,
) {
  const value = headers?.[name] ?? headers?.[name.toLowerCase()];

  if (Array.isArray(value)) {
    return value[0] ?? null;
  }

  return typeof value === "string" ? value : null;
}

function getInternalRequestIp(
  headers: Record<string, string | string[] | undefined> | undefined,
) {
  const forwarded = getHeaderValue(headers, "x-forwarded-for");

  if (forwarded) {
    return forwarded.split(",")[0]?.trim() ?? "unknown";
  }

  return getHeaderValue(headers, "x-real-ip") ?? "unknown";
}

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, request) {
        const email =
          typeof credentials?.email === "string"
            ? credentials.email.trim().toLowerCase()
            : null;
        const requestMeta = {
          method: request.method,
          path: "/api/auth/callback/credentials",
          ip: getInternalRequestIp(request.headers),
          userAgent: getHeaderValue(request.headers, "user-agent") ?? "unknown",
          forwardedHost:
            getHeaderValue(request.headers, "x-forwarded-host") ??
            getHeaderValue(request.headers, "host"),
        };
        const loginRateLimit = checkRateLimit({
          scope: "auth-login",
          identifier: `${requestMeta.ip}:${email ?? "unknown"}`,
          limit: getEnvNumber("AUTH_LOGIN_RATE_LIMIT_MAX", 10),
          windowMs: getEnvNumber("AUTH_RATE_LIMIT_WINDOW_MS", 15 * 60 * 1000),
        });

        if (!loginRateLimit.ok) {
          logOperationalWarning("auth.login.rate_limited", {
            ...requestMeta,
            email: maskEmail(email),
            retryAfterSeconds: loginRateLimit.retryAfterSeconds,
          });
          throw new Error("rate-limit-exceeded");
        }

        const parsed = credentialsSchema.safeParse(credentials);

        if (!parsed.success) {
          logOperationalWarning("auth.login.invalid_payload", {
            ...requestMeta,
            email: maskEmail(email),
          });
          throw new Error("invalid-auth-request");
        }

        const user = await db.user.findUnique({
          where: { email: parsed.data.email },
        });

        if (!user) {
          logOperationalWarning("auth.login.user_not_found", {
            ...requestMeta,
            email: maskEmail(parsed.data.email),
          });
          return null;
        }

        const isValid = await bcrypt.compare(parsed.data.password, user.passwordHash);

        if (!isValid) {
          logOperationalWarning("auth.login.invalid_password", {
            ...requestMeta,
            userId: user.id,
            email: maskEmail(user.email),
          });
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }

      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }

      return session;
    },
  },
};

export function getServerAuthSession() {
  return getServerSession(authOptions);
}
