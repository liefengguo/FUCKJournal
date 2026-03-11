import path from "node:path";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";

import { del, put } from "@vercel/blob";

import { isAcceptedManuscriptUpload } from "@/lib/manuscript-files";
import type { UploadKind } from "@/lib/validations/submission";

export type StorageProvider = "local" | "vercel-blob";

export type StoredFile = {
  storageKey: string;
  storageProvider: StorageProvider;
};

export class StorageError extends Error {
  constructor(
    public code:
      | "storage-misconfigured"
      | "upload-failed"
      | "download-failed"
      | "invalid-manuscript-file"
      | "invalid-source-file"
      | "upload-too-large",
  ) {
    super(code);
    this.name = "StorageError";
  }
}

function sanitizeFileName(fileName: string) {
  return fileName.replace(/[^a-zA-Z0-9._-]+/g, "-").replace(/-+/g, "-");
}

function getStorageProvider(): StorageProvider {
  return process.env.STORAGE_PROVIDER === "vercel-blob"
    ? "vercel-blob"
    : "local";
}

function getLocalStorageRoot() {
  return path.resolve(process.cwd(), process.env.LOCAL_STORAGE_DIR ?? ".uploads");
}

function getUploadLimit() {
  const raw = process.env.MAX_MANUSCRIPT_PDF_BYTES;

  if (!raw) {
    return 25 * 1024 * 1024;
  }

  const parsed = Number(raw);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 25 * 1024 * 1024;
}

function validateFileKind(kind: UploadKind, file: File) {
  const lowerName = file.name.toLowerCase();

  if (file.size > getUploadLimit()) {
    throw new StorageError("upload-too-large");
  }

  if (!isAcceptedManuscriptUpload(lowerName, file.type)) {
    throw new StorageError("invalid-manuscript-file");
  }
}

async function uploadToLocalStorage(
  publicId: string,
  kind: UploadKind,
  file: File,
) {
  const root = getLocalStorageRoot();
  const folder = path.join(root, "submissions", publicId);
  const fileName = `${kind}-${Date.now()}-${sanitizeFileName(file.name)}`;
  const absolutePath = path.join(folder, fileName);

  await mkdir(folder, { recursive: true });
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(absolutePath, buffer);

  return {
    storageKey: path.relative(root, absolutePath),
    storageProvider: "local" as const,
  };
}

async function uploadToVercelBlob(
  publicId: string,
  kind: UploadKind,
  file: File,
) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    throw new StorageError("storage-misconfigured");
  }

  try {
    const result = await put(
      `submissions/${publicId}/${kind}-${sanitizeFileName(file.name)}`,
      file,
      {
        access: "public",
        addRandomSuffix: true,
      },
    );

    return {
      storageKey: result.url,
      storageProvider: "vercel-blob" as const,
    };
  } catch {
    throw new StorageError("upload-failed");
  }
}

export async function storeSubmissionFile(
  publicId: string,
  kind: UploadKind,
  file: File,
): Promise<StoredFile> {
  validateFileKind(kind, file);

  const provider = getStorageProvider();

  if (provider === "vercel-blob") {
    return uploadToVercelBlob(publicId, kind, file);
  }

  try {
    return await uploadToLocalStorage(publicId, kind, file);
  } catch {
    throw new StorageError("upload-failed");
  }
}

export async function deleteStoredFile(
  storageProvider: string | null | undefined,
  storageKey: string | null | undefined,
) {
  if (!storageProvider || !storageKey) {
    return;
  }

  if (storageProvider === "vercel-blob") {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return;
    }

    await del(storageKey).catch(() => undefined);
    return;
  }

  const absolutePath = path.join(getLocalStorageRoot(), storageKey);
  await rm(absolutePath, { force: true }).catch(() => undefined);
}

export async function readStoredFile(
  storageProvider: string | null | undefined,
  storageKey: string | null | undefined,
) {
  if (!storageProvider || !storageKey) {
    throw new StorageError("download-failed");
  }

  if (storageProvider === "vercel-blob") {
    try {
      const response = await fetch(storageKey, {
        cache: "no-store",
      });

      if (!response.ok) {
        throw new StorageError("download-failed");
      }

      return {
        buffer: Buffer.from(await response.arrayBuffer()),
        contentType: response.headers.get("content-type"),
      };
    } catch {
      throw new StorageError("download-failed");
    }
  }

  try {
    const absolutePath = path.join(getLocalStorageRoot(), storageKey);
    const buffer = await readFile(absolutePath);
    return {
      buffer,
      contentType: null,
    };
  } catch {
    throw new StorageError("download-failed");
  }
}
