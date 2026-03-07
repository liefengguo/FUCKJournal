-- AlterTable
ALTER TABLE "Submission" ADD COLUMN     "conclusion" TEXT,
ADD COLUMN     "introduction" TEXT,
ADD COLUMN     "keywords" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "mainContent" TEXT,
ADD COLUMN     "manuscriptStorageProvider" TEXT,
ADD COLUMN     "references" TEXT,
ADD COLUMN     "sourceArchiveFileName" TEXT,
ADD COLUMN     "sourceArchiveMimeType" TEXT,
ADD COLUMN     "sourceArchiveSizeBytes" INTEGER,
ADD COLUMN     "sourceArchiveStorageKey" TEXT,
ADD COLUMN     "sourceArchiveStorageProvider" TEXT;

-- AlterTable
ALTER TABLE "SubmissionVersion" ADD COLUMN     "conclusion" TEXT,
ADD COLUMN     "introduction" TEXT,
ADD COLUMN     "keywords" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "label" TEXT NOT NULL,
ADD COLUMN     "mainContent" TEXT,
ADD COLUMN     "manuscriptStorageProvider" TEXT,
ADD COLUMN     "references" TEXT,
ADD COLUMN     "sourceArchiveFileName" TEXT,
ADD COLUMN     "sourceArchiveMimeType" TEXT,
ADD COLUMN     "sourceArchiveSizeBytes" INTEGER,
ADD COLUMN     "sourceArchiveStorageKey" TEXT,
ADD COLUMN     "sourceArchiveStorageProvider" TEXT,
ADD COLUMN     "statusContext" "SubmissionStatus" NOT NULL;

-- CreateTable
CREATE TABLE "InternalEditorNote" (
    "id" TEXT NOT NULL,
    "submissionId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InternalEditorNote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "InternalEditorNote_submissionId_createdAt_idx" ON "InternalEditorNote"("submissionId", "createdAt");

-- CreateIndex
CREATE INDEX "Submission_manuscriptLanguage_idx" ON "Submission"("manuscriptLanguage");

-- AddForeignKey
ALTER TABLE "InternalEditorNote" ADD CONSTRAINT "InternalEditorNote_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "Submission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InternalEditorNote" ADD CONSTRAINT "InternalEditorNote_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

