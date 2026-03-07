import bcrypt from "bcryptjs";
import { PrismaClient, UserRole } from "@prisma/client";

const prisma = new PrismaClient();

async function maybeSeedUser(role, email, password, name) {
  if (!email || !password) {
    return;
  }

  const existing = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });

  if (existing) {
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.user.create({
    data: {
      email,
      name,
      passwordHash,
      role,
    },
  });
}

async function main() {
  await maybeSeedUser(
    UserRole.EDITOR,
    process.env.SEED_EDITOR_EMAIL,
    process.env.SEED_EDITOR_PASSWORD,
    "Editorial Desk",
  );

  await maybeSeedUser(
    UserRole.ADMIN,
    process.env.SEED_ADMIN_EMAIL,
    process.env.SEED_ADMIN_PASSWORD,
    "Managing Editor",
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
