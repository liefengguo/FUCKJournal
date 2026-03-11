import { constants } from "node:fs";
import { access, readdir } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import type { PublicationExportSource } from "@/lib/publication-export";
import { getManuscriptFileKind } from "@/lib/manuscript-files";
import { readStoredFile } from "@/lib/storage";

type StoredPdfAsset = {
  buffer: Buffer;
  fileName: string;
};

let cachedChromiumExecutablePath: string | null | undefined;

function getChromiumExecutableSuffix() {
  switch (process.platform) {
    case "darwin":
      return path.join(
        "chrome-mac",
        "Chromium.app",
        "Contents",
        "MacOS",
        "Chromium",
      );
    case "win32":
      return path.join("chrome-win", "chrome.exe");
    default:
      return path.join("chrome-linux", "chrome");
  }
}

function getChromiumSearchRoots() {
  return [
    process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH ?? null,
    path.join(os.homedir(), "Library", "Caches", "ms-playwright"),
    path.join(os.homedir(), ".cache", "ms-playwright"),
    path.join(os.homedir(), "AppData", "Local", "ms-playwright"),
  ].filter(Boolean) as string[];
}

async function canExecute(filePath: string) {
  try {
    await access(filePath, constants.X_OK);
    return true;
  } catch {
    return false;
  }
}

async function resolveChromiumExecutablePath() {
  if (cachedChromiumExecutablePath !== undefined) {
    return cachedChromiumExecutablePath;
  }

  const configuredPath = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH;

  if (configuredPath && (await canExecute(configuredPath))) {
    cachedChromiumExecutablePath = configuredPath;
    return configuredPath;
  }

  const executableSuffix = getChromiumExecutableSuffix();

  for (const root of getChromiumSearchRoots()) {
    let entries;

    try {
      entries = await readdir(root, {
        withFileTypes: true,
        encoding: "utf8",
      });
    } catch {
      continue;
    }

    const chromiumDirs = entries
      .filter((entry) => entry.isDirectory() && /^chromium-\d+$/.test(entry.name))
      .sort((left, right) => {
        const leftVersion = Number(left.name.split("-")[1] ?? "0");
        const rightVersion = Number(right.name.split("-")[1] ?? "0");
        return rightVersion - leftVersion;
      });

    for (const directory of chromiumDirs) {
      const candidate = path.join(root, directory.name, executableSuffix);

      if (await canExecute(candidate)) {
        cachedChromiumExecutablePath = candidate;
        return candidate;
      }
    }
  }

  cachedChromiumExecutablePath = null;
  return null;
}

export function getPublicationPdfFileName(source: PublicationExportSource) {
  const manuscriptName = source.manuscriptFileName?.trim();

  if (manuscriptName) {
    const parsed = path.parse(manuscriptName);
    return `${parsed.name || "manuscript"}.pdf`;
  }

  const fallback = source.publicationSlug?.trim() || source.publicId.toLowerCase();
  return `${fallback}.pdf`;
}

export async function loadPublicationPdfAsset(
  source: PublicationExportSource,
): Promise<StoredPdfAsset | null> {
  const kind = getManuscriptFileKind(
    source.manuscriptFileName,
    source.manuscriptMimeType,
  );

  if (
    kind !== "pdf" ||
    !source.manuscriptStorageKey ||
    !source.manuscriptStorageProvider
  ) {
    return null;
  }

  const file = await readStoredFile(
    source.manuscriptStorageProvider,
    source.manuscriptStorageKey,
  );

  return {
    buffer: file.buffer,
    fileName: getPublicationPdfFileName(source),
  };
}

export async function renderPublicationPdfSnapshot({
  slug,
  locale,
  origin,
}: {
  slug: string;
  locale: string;
  origin: string;
}) {
  const executablePath = await resolveChromiumExecutablePath();

  if (!executablePath) {
    throw new Error("chromium-executable-not-found");
  }

  const importPlaywright = new Function(
    "specifier",
    "return import(specifier)",
  ) as (specifier: string) => Promise<{
    chromium: {
      launch: (options: {
        executablePath: string;
        headless: boolean;
      }) => Promise<{
        newPage: (options: { colorScheme: "light" }) => Promise<{
          goto: (
            url: string,
            options: { waitUntil: "networkidle"; timeout: number },
          ) => Promise<unknown>;
          waitForSelector: (
            selector: string,
            options: { timeout: number },
          ) => Promise<unknown>;
          waitForTimeout: (timeout: number) => Promise<unknown>;
          pdf: (options: {
            printBackground: boolean;
            preferCSSPageSize: boolean;
            margin: {
              top: string;
              right: string;
              bottom: string;
              left: string;
            };
          }) => Promise<Buffer>;
        }>;
        close: () => Promise<void>;
      }>;
    };
  }>;
  const { chromium } = await importPlaywright("playwright-core");
  const browser = await chromium.launch({
    executablePath,
    headless: true,
  });

  try {
    const page = await browser.newPage({
      colorScheme: "light",
    });

    await page.goto(`${origin}/${locale}/articles/${slug}?export=pdf`, {
      waitUntil: "networkidle",
      timeout: 30000,
    });
    await page.waitForSelector("section.manuscript-docx", {
      timeout: 30000,
    });
    await page.waitForTimeout(500);

    const pdf = await page.pdf({
      printBackground: true,
      preferCSSPageSize: true,
      margin: {
        top: "0",
        right: "0",
        bottom: "0",
        left: "0",
      },
    });

    return Buffer.from(pdf);
  } finally {
    await browser.close();
  }
}
