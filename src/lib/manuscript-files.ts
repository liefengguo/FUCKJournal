const DOCX_MIME_TYPES = new Set([
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/msword",
]);

const PDF_MIME_TYPES = new Set(["application/pdf"]);

export type ManuscriptFileKind = "pdf" | "docx" | null;

export function getManuscriptFileKind(
  fileName: string | null | undefined,
  mimeType: string | null | undefined,
): ManuscriptFileKind {
  const normalizedName = fileName?.trim().toLowerCase() ?? "";
  const normalizedType = mimeType?.trim().toLowerCase() ?? "";

  if (normalizedName.endsWith(".pdf") || PDF_MIME_TYPES.has(normalizedType)) {
    return "pdf";
  }

  if (normalizedName.endsWith(".docx") || DOCX_MIME_TYPES.has(normalizedType)) {
    return "docx";
  }

  return null;
}

export function isAcceptedManuscriptUpload(
  fileName: string | null | undefined,
  mimeType: string | null | undefined,
) {
  return getManuscriptFileKind(fileName, mimeType) === "pdf";
}
