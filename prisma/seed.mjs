import bcrypt from "bcryptjs";
import { PrismaClient, UserRole } from "@prisma/client";

const prisma = new PrismaClient();

const defaults = {
  userEmail: process.env.SEED_TEST_USER_EMAIL ?? "contributor@fuckjournal.local",
  userPassword: process.env.SEED_TEST_USER_PASSWORD ?? "Phase1User123!",
  editorEmail: process.env.SEED_TEST_EDITOR_EMAIL ?? "editor@fuckjournal.local",
  editorPassword: process.env.SEED_TEST_EDITOR_PASSWORD ?? "Phase1Editor123!",
};

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
    UserRole.USER,
    defaults.userEmail,
    defaults.userPassword,
    "Test Contributor",
  );

  await maybeSeedUser(
    UserRole.EDITOR,
    defaults.editorEmail,
    defaults.editorPassword,
    "Test Editor",
  );

  await maybeSeedUser(
    UserRole.ADMIN,
    process.env.SEED_ADMIN_EMAIL,
    process.env.SEED_ADMIN_PASSWORD,
    "Managing Editor",
  );

  console.log("Seed accounts ready:");
  console.log(`- USER: ${defaults.userEmail} / ${defaults.userPassword}`);
  console.log(`- EDITOR: ${defaults.editorEmail} / ${defaults.editorPassword}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
