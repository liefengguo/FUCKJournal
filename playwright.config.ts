import { defineConfig, devices } from "@playwright/test";

const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3000";
const serverUrl = new URL(baseURL);
const serverPort =
  serverUrl.port || (serverUrl.protocol === "https:" ? "443" : "80");

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  retries: process.env.CI ? 2 : 0,
  workers: 1,
  timeout: 120_000,
  expect: {
    timeout: 15_000,
  },
  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
      },
    },
  ],
  webServer: {
    command: `zsh -lc 'set -a; [ -f .env.local ] && source .env.local; set +a; npm run db:seed && npm run build && npm run start -- --hostname 127.0.0.1 --port ${serverPort}'`,
    url: `${baseURL}/zh`,
    reuseExistingServer: !process.env.CI,
    timeout: 240_000,
  },
});
