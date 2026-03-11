import { getManuscriptFileKind } from "@/lib/manuscript-files";

export type ManuscriptPreview =
  | {
      kind: "docx";
      fileName: string;
      src: string;
      downloadUrl: string | null;
    }
  | {
      kind: "pdf";
      fileName: string;
      src: string;
      downloadUrl: string | null;
    };

type StoredManuscriptPreviewSource = {
  fileName: string | null;
  mimeType: string | null;
  storageKey: string | null;
  storageProvider: string | null;
  inlineUrl?: string | null;
  downloadUrl?: string | null;
};

export async function loadStoredManuscriptPreview(
  source: StoredManuscriptPreviewSource,
): Promise<ManuscriptPreview | null> {
  const kind = getManuscriptFileKind(source.fileName, source.mimeType);

  if (!kind || !source.fileName) {
    return null;
  }

  if (kind === "pdf") {
    const src = source.inlineUrl ?? source.downloadUrl;

    if (!src) {
      return null;
    }

    return {
      kind: "pdf",
      fileName: source.fileName,
      src,
      downloadUrl: source.downloadUrl ?? src,
    };
  }

  const src = source.inlineUrl ?? source.downloadUrl;

  if (!src) {
    return null;
  }

  return {
    kind: "docx",
    fileName: source.fileName,
    src,
    downloadUrl: source.downloadUrl ?? null,
  };
}
