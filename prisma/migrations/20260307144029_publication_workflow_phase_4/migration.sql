-- AlterTable
ALTER TABLE "Submission" ADD COLUMN     "publicationExcerpt" TEXT,
ADD COLUMN     "publicationIssue" TEXT,
ADD COLUMN     "publicationLocale" TEXT,
ADD COLUMN     "publicationTags" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "publicationTitle" TEXT,
ADD COLUMN     "publicationVolume" TEXT,
ADD COLUMN     "publicationYear" INTEGER,
ADD COLUMN     "seoDescription" TEXT,
ADD COLUMN     "seoTitle" TEXT;

-- CreateIndex
CREATE INDEX "Submission_status_isPublicationReady_publishedAt_idx" ON "Submission"("status", "isPublicationReady", "publishedAt");

-- CreateIndex
CREATE INDEX "Submission_publicationLocale_idx" ON "Submission"("publicationLocale");
