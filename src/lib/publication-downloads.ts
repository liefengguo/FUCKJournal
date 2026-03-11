export function isPublicPublicationDownloadEnabled() {
  return process.env.ENABLE_PUBLICATION_DOWNLOADS === "1";
}
