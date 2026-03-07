import matter from "gray-matter";

type ExportAuthor = {
  name: string | null;
  email: string;
};

export type PublicationExportSource = {
  publicId: string;
  title: string;
  abstract: string | null;
  keywords: string[];
  coverLetter: string | null;
  introduction: string | null;
  mainContent: string | null;
  conclusion: string | null;
  references: string | null;
  manuscriptLanguage: string | null;
  manuscriptFileName: string | null;
  manuscriptMimeType: string | null;
  manuscriptSizeBytes: number | null;
  sourceArchiveFileName: string | null;
  sourceArchiveMimeType: string | null;
  sourceArchiveSizeBytes: number | null;
  publicationSlug: string | null;
  publicationTitle: string | null;
  publicationExcerpt: string | null;
  publicationTags: string[];
  publicationLocale: string | null;
  publicationVolume: string | null;
  publicationIssue: string | null;
  publicationYear: number | null;
  seoTitle: string | null;
  seoDescription: string | null;
  publishedAt: Date | null;
  submittedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  author: ExportAuthor;
};

function compactSections(
  sections: Array<{ heading: string; body: string | null | undefined }>,
) {
  return sections
    .filter((section) => section.body?.trim())
    .map((section) => `## ${section.heading}\n\n${section.body?.trim()}`)
    .join("\n\n");
}

export function getPublicationLocale(source: PublicationExportSource) {
  return source.publicationLocale ?? source.manuscriptLanguage ?? "en";
}

export function getPublicationTitle(source: PublicationExportSource) {
  return source.publicationTitle?.trim() || source.title.trim();
}

export function getPublicationExcerpt(source: PublicationExportSource) {
  return source.publicationExcerpt?.trim() || source.abstract?.trim() || "";
}

export function getPublicationTags(source: PublicationExportSource) {
  return source.publicationTags.length ? source.publicationTags : source.keywords;
}

function buildMarkdownBody(source: PublicationExportSource) {
  const sections = compactSections([
    { heading: "Abstract", body: source.abstract },
    { heading: "Introduction", body: source.introduction },
    { heading: "Main Content", body: source.mainContent },
    { heading: "Conclusion", body: source.conclusion },
    { heading: "References", body: source.references },
  ]);

  if (sections) {
    return sections;
  }

  return source.mainContent?.trim() || source.abstract?.trim() || "";
}

export function buildMarkdownDraft(source: PublicationExportSource) {
  const frontmatter = {
    title: getPublicationTitle(source),
    author: source.author.name || source.author.email,
    date: source.publishedAt?.toISOString() ?? source.updatedAt.toISOString(),
    tags: getPublicationTags(source),
    language: getPublicationLocale(source),
    summary: getPublicationExcerpt(source),
    submissionPublicId: source.publicId,
    ...(source.publicationSlug ? { publicationSlug: source.publicationSlug } : {}),
    ...(source.publicationVolume ? { volume: source.publicationVolume } : {}),
    ...(source.publicationIssue ? { issue: source.publicationIssue } : {}),
    ...(source.publicationYear ? { year: source.publicationYear } : {}),
    ...(source.seoTitle ? { seoTitle: source.seoTitle } : {}),
    ...(source.seoDescription
      ? { seoDescription: source.seoDescription }
      : {}),
  };

  return matter.stringify(buildMarkdownBody(source), frontmatter);
}

export function buildPublicationJson(source: PublicationExportSource) {
  return {
    exportType: "fuck-journal-publication-draft",
    exportedAt: new Date().toISOString(),
    submission: {
      publicId: source.publicId,
      title: source.title,
      abstract: source.abstract,
      keywords: source.keywords,
      coverLetter: source.coverLetter,
      introduction: source.introduction,
      mainContent: source.mainContent,
      conclusion: source.conclusion,
      references: source.references,
      manuscriptLanguage: source.manuscriptLanguage,
      submittedAt: source.submittedAt?.toISOString() ?? null,
      createdAt: source.createdAt.toISOString(),
      updatedAt: source.updatedAt.toISOString(),
    },
    publication: {
      slug: source.publicationSlug,
      title: getPublicationTitle(source),
      excerpt: getPublicationExcerpt(source),
      tags: getPublicationTags(source),
      locale: getPublicationLocale(source),
      volume: source.publicationVolume,
      issue: source.publicationIssue,
      year: source.publicationYear,
      seoTitle: source.seoTitle,
      seoDescription: source.seoDescription,
      isPublished: Boolean(source.publishedAt),
      publishedAt: source.publishedAt?.toISOString() ?? null,
    },
    author: {
      name: source.author.name,
      email: source.author.email,
    },
    assets: {
      manuscript: source.manuscriptFileName
        ? {
            fileName: source.manuscriptFileName,
            mimeType: source.manuscriptMimeType,
            sizeBytes: source.manuscriptSizeBytes,
          }
        : null,
      sourceArchive: source.sourceArchiveFileName
        ? {
            fileName: source.sourceArchiveFileName,
            mimeType: source.sourceArchiveMimeType,
            sizeBytes: source.sourceArchiveSizeBytes,
          }
        : null,
    },
  };
}
