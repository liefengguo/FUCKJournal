import { spawnSync } from "node:child_process";

function run(command, args) {
  const result = spawnSync(command, args, {
    stdio: "inherit",
    env: process.env,
  });

  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

run("npx", ["prisma", "generate"]);

if (process.env.VERCEL === "1" && process.env.DATABASE_URL) {
  console.log("Vercel build detected; applying Prisma migrations before build.");
  run("npx", ["prisma", "migrate", "deploy"]);
} else {
  console.log("Skipping Prisma migrate deploy outside Vercel builds.");
}
