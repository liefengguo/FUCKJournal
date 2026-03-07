import bcrypt from "bcryptjs";

import { authOptions } from "@/auth";
import { jsonNoStore, hasTrustedOrigin, isJsonRequest } from "@/lib/api-security";
import { db } from "@/lib/db";
import { signUpSchema } from "@/lib/validations/auth";
import { getServerSession } from "next-auth";

export async function POST(request: Request) {
  try {
    if (!isJsonRequest(request)) {
      return jsonNoStore({ errorCode: "unsupported-media-type" }, { status: 415 });
    }

    if (!hasTrustedOrigin(request)) {
      return jsonNoStore({ errorCode: "forbidden-origin" }, { status: 403 });
    }

    const session = await getServerSession(authOptions);

    if (session?.user) {
      return jsonNoStore({ errorCode: "already-authenticated" }, { status: 403 });
    }

    const payload = await request.json();
    const parsed = signUpSchema.safeParse(payload);

    if (!parsed.success) {
      return jsonNoStore({ errorCode: "invalid-sign-up-input" }, { status: 400 });
    }

    const existingUser = await db.user.findUnique({
      where: { email: parsed.data.email },
      select: { id: true },
    });

    if (existingUser) {
      return jsonNoStore({ errorCode: "email-taken" }, { status: 409 });
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

    return jsonNoStore({ ok: true }, { status: 201 });
  } catch {
    return jsonNoStore({ errorCode: "registration-unavailable" }, { status: 500 });
  }
}
