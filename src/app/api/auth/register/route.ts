import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { db } from "@/lib/db";
import { signUpSchema } from "@/lib/validations/auth";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const parsed = signUpSchema.safeParse(payload);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Please provide a valid name, email and password." },
        { status: 400 },
      );
    }

    const existingUser = await db.user.findUnique({
      where: { email: parsed.data.email },
      select: { id: true },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 },
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

    return NextResponse.json({ ok: true }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Unable to create an account right now." },
      { status: 500 },
    );
  }
}
