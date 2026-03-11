import type { Metadata } from "next";

import { unstable_noStore as noStore } from "next/cache";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { LocaleLink } from "@/components/locale-link";
import { mdxComponents } from "@/components/mdx-components";
import { ReadingProgressBar } from "@/components/reading-progress-bar";
import { ManuscriptDocumentView } from "@/components/submissions/manuscript-document-view";
import type { Locale } from "@/i18n/routing";
import { routing } from "@/i18n/routing";
import {
  compileArticle,
  formatArticleIssue,
  getArticleBySlug,
  getArticleSlugs,
} from "@/lib/articles";
import { loadStoredManuscriptPreview } from "@/lib/manuscript-preview";
import { createPageMetadata } from "@/lib/metadata";
import { isPublicPublicationDownloadEnabled } from "@/lib/publication-downloads";
import { getPublicationPdfFileName } from "@/lib/publication-pdf";
import {
  getPublicationExcerpt,
  getPublicationTags,
  getPublicationTitle,
} from "@/lib/publication-export";
import { formatDate, siteConfig } from "@/lib/site";
import { getPublishedSubmissionBySlug } from "@/lib/submissions";
import { cn } from "@/lib/utils";

type ArticlePageProps = {
  params: {
    locale: Locale;
    slug: string;
  };
  searchParams?: {
    export?: string;
  };
};

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    getArticleSlugs()
      .filter((slug) => getArticleBySlug(slug, locale))
      .map((slug) => ({ locale, slug })),
  );
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const article = getArticleBySlug(params.slug, params.locale);

  if (article) {
    return createPageMetadata({
      locale: params.locale,
      title: article.title,
      description: article.summary,
      pathname: `/${params.locale}/articles/${params.slug}`,
      type: "article",
      tags: article.tags,
      publishedTime: article.date,
    });
  }

  const submission = await getPublishedSubmissionBySlug(
    params.slug,
    params.locale,
  );

  if (!submission) {
    return {};
  }

  return createPageMetadata({
    locale: params.locale,
    title: getPublicationTitle(submission),
    description: getPublicationExcerpt(submission),
    pathname: `/${params.locale}/articles/${params.slug}`,
    type: "article",
    tags: getPublicationTags(submission),
    publishedTime:
      submission.publishedAt?.toISOString() ?? submission.updatedAt.toISOString(),
  });
}

export default async function ArticlePage({
  params,
  searchParams,
}: ArticlePageProps) {
  const { locale, slug } = params;
  const exportMode = searchParams?.export === "pdf";

  noStore();
  setRequestLocale(locale);
  const article = getArticleBySlug(slug, locale);

  if (!article) {
    const submission = await getPublishedSubmissionBySlug(slug, locale);

    if (!submission) {
      notFound();
    }

    const publicDownloadEnabled = isPublicPublicationDownloadEnabled();
    const manuscriptPreview = await loadStoredManuscriptPreview({
      fileName: submission.manuscriptFileName,
      mimeType: submission.manuscriptMimeType,
      storageKey: submission.manuscriptStorageKey,
      storageProvider: submission.manuscriptStorageProvider,
      inlineUrl: `/api/publications/${slug}/manuscript-preview`,
      downloadUrl: publicDownloadEnabled
        ? `/api/publications/${slug}/manuscript`
        : null,
    });
    const tCommon = await getTranslations("Common");
    const publicPdfFileName = publicDownloadEnabled
      ? getPublicationPdfFileName(submission)
      : null;
    const issueLine = formatArticleIssue(
      submission.publicationYear &&
        submission.publicationVolume &&
        submission.publicationIssue
        ? {
            year: String(submission.publicationYear),
            volume: submission.publicationVolume,
            number: submission.publicationIssue,
          }
        : undefined,
      locale,
    );

    return (
      <>
        {exportMode ? null : <ReadingProgressBar />}
        <article
          className={`article-reading-surface article-reading-surface--manuscript${exportMode ? " article-reading-surface--pdf-export" : ""}`}
        >
          <div className="manuscript-viewer-shell">
            {exportMode ? null : (
              <>
                <div className="manuscript-viewer-toolbar">
                  <LocaleLink
                    className="manuscript-viewer-backlink"
                    locale={locale}
                    href="/articles"
                  >
                    {tCommon("backToArticles")}
                  </LocaleLink>
                  {publicDownloadEnabled && manuscriptPreview?.downloadUrl ? (
                    <a
                      href={manuscriptPreview.downloadUrl}
                      className="manuscript-viewer-filelink"
                    >
                      {locale === "zh"
                        ? `下载 PDF / ${publicPdfFileName}`
                        : `Download PDF / ${publicPdfFileName}`}
                    </a>
                  ) : null}
                </div>

                <div className="manuscript-viewer-meta">
                  <span>{submission.publicId}</span>
                  <span>{issueLine}</span>
                  {publicPdfFileName ? <span>{publicPdfFileName}</span> : null}
                  <span>
                    {submission.publishedAt
                      ? formatDate(submission.publishedAt.toISOString(), locale)
                      : formatDate(submission.updatedAt.toISOString(), locale)}
                  </span>
                </div>
              </>
            )}

            {manuscriptPreview ? (
              <div className="article-paper-stage article-paper-stage--manuscript">
                <ManuscriptDocumentView
                  locale={locale}
                  preview={manuscriptPreview}
                  showDownloadLink={false}
                  printMode={exportMode}
                />
              </div>
            ) : (
              <div className="article-paper-stage article-paper-stage--manuscript">
                <div className="manuscript-document-fallback">
                  <h2>{getPublicationTitle(submission)}</h2>
                  <p>{getPublicationExcerpt(submission)}</p>
                  <p>
                    {locale === "zh"
                      ? "当前没有可直接显示的原稿文件预览，公开页暂时回退到结构化出版信息。"
                      : "No directly renderable manuscript file is available yet, so this public page falls back to structured publication metadata."}
                  </p>
                </div>
              </div>
            )}
          </div>
        </article>
      </>
    );
  }

  const { content } = await compileArticle(article.content, mdxComponents);
  const tCommon = await getTranslations("Common");
  const alternateLocale = article.availableLocales.find((item) => item !== locale);
  const issueLine = formatArticleIssue(article.issue, locale);
  const keywords = article.indexTerms.length ? article.indexTerms : article.tags;
  const manuscriptLayout = article.layout ?? "double";
  const correspondingAuthor = article.authors.find((entry) => entry.email);
  const issuePageNumber =
    article.issue?.pages?.split("-")[0]?.trim() || article.issue?.number || "1";
  const watermarkText =
    locale === "zh" ? "F.U.C.K JOURNAL PREPRINT / 样稿预览" : "F.U.C.K JOURNAL PREPRINT";
  const viewerTitle =
    locale === "zh" ? "Manuscript / 全文" : "Manuscript / Full text";
  const headerRows = [
    {
      label: locale === "zh" ? "ABSTRACT / 摘要" : "ABSTRACT / Summary",
      value: article.summary,
    },
    {
      label: locale === "zh" ? "INDEX TERMS / 关键词" : "INDEX TERMS / Keywords",
      value: keywords.join(locale === "zh" ? "，" : ", "),
    },
    ...(article.impactStatement
      ? [
          {
            label:
              locale === "zh"
                ? "IMPACT STATEMENT / 影响声明"
                : "IMPACT STATEMENT / Editorial significance",
            value: article.impactStatement,
          },
        ]
      : []),
  ];
  const authorEntries = article.authors.length
    ? article.authors
    : [{ name: article.author }];

  return (
    <>
      <ReadingProgressBar />
      <article className="article-reading-surface">
        <div className="article-reading-toolbar">
          <div className="article-reading-links">
            <LocaleLink className="article-reading-link" locale={locale} href="/articles">
              {tCommon("backToArticles")}
            </LocaleLink>
          </div>
          {alternateLocale ? (
            <div className="article-reading-links">
              <LocaleLink
                className="article-reading-link"
                locale={alternateLocale}
                href={`/articles/${slug}`}
              >
                {tCommon("translationAvailable")}
              </LocaleLink>
            </div>
          ) : null}
        </div>

        <div className="article-viewer-header">
          <h1 className="article-viewer-title">{viewerTitle}</h1>
          <p className="article-viewer-note">
            {locale === "zh"
              ? "以下直接显示稿件全文，正文中的公式、图版与表格按论文阅读方式连续展开。"
              : "The manuscript is presented below as full text, with figures, tables, and equations kept inline."}
          </p>
        </div>

        <div className="article-paper-stage">
          <div className="article-paper">
          <div className="article-paper-watermark" aria-hidden="true">
            {Array.from({ length: 8 }).map((_, index) => (
              <span key={`${watermarkText}-${index}`}>{watermarkText}</span>
            ))}
          </div>

          <header className="article-paper-header">
            <div className="article-paper-brand">
              <div className="article-paper-brandmark">F.U.C.K</div>
              <div className="article-paper-brandtext">
                <span>Foundations</span>
                <span>Uncertainty</span>
                <span>Complexity</span>
                <span>Knowledge</span>
              </div>
            </div>
            <div className="article-paper-running">
              <p>{siteConfig.shortName}</p>
              <p>{issuePageNumber}</p>
            </div>
          </header>

          <section className="article-paper-titlepage">
            <p className="article-paper-kicker">
              {article.articleType || (locale === "zh" ? "研究论文" : "Research article")}
            </p>
            <h1 className="article-paper-title">{article.title}</h1>
            {article.subtitle ? (
              <p className="article-paper-subtitle">{article.subtitle}</p>
            ) : null}

            <div className="article-paper-authors">
              {authorEntries.map((entry, index) => (
                <span key={`${entry.name}-${index}`}>
                  {entry.name}
                  <sup>{index + 1}</sup>
                </span>
              ))}
            </div>

            <div className="article-paper-affiliations">
              {authorEntries.map((entry, index) => (
                <p key={`${entry.name}-${entry.affiliation ?? ""}-${index}`}>
                  <sup>{index + 1}</sup>
                  {[entry.affiliation, entry.location].filter(Boolean).join(", ")}
                </p>
              ))}
            </div>

            {correspondingAuthor?.email ? (
              <p className="article-paper-meta-line">
                {locale === "zh" ? "通讯作者" : "Correspondence"}: {correspondingAuthor.name}
                {" "}
                ({correspondingAuthor.email})
              </p>
            ) : null}

            <p className="article-paper-meta-line">
              DOI: {article.doi ?? "Pending"} | {issueLine}
            </p>
            <p className="article-paper-meta-line">
              {locale === "zh" ? "发表日期" : "Published"}: {formatDate(article.date, locale)}
            </p>
            {article.note ? (
              <p className="article-paper-note">{article.note}</p>
            ) : null}
          </section>

          <section className="article-paper-frontmatter">
            {headerRows.map((row) => (
              <div key={row.label} className="article-paper-frontmatter-row">
                <div className="article-paper-frontmatter-label">{row.label}</div>
                <div className="article-paper-frontmatter-value">{row.value}</div>
              </div>
            ))}
          </section>

          <section className="article-paper-body">
            <div
              className={cn(
                "article-manuscript",
                manuscriptLayout === "double" && "article-manuscript--double",
              )}
            >
              <div
                className={cn(
                  "article-prose [&_li]:ml-5 [&_ol]:list-decimal [&_ul]:list-disc",
                  manuscriptLayout === "double" && "article-prose--double",
                )}
              >
                {content}
              </div>
            </div>
          </section>
          </div>
        </div>
      </article>
    </>
  );
}
