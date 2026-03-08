-- CreateEnum
CREATE TYPE "PublicationAuditAction" AS ENUM ('METADATA_UPDATED', 'MARKED_READY', 'MARKED_UNREADY', 'MARKED_PUBLISHED', 'MARKED_UNPUBLISHED');

-- CreateTable
CREATE TABLE "PublicationAuditEvent" (
    "id" TEXT NOT NULL,
    "submissionId" TEXT NOT NULL,
    "actorId" TEXT NOT NULL,
    "action" "PublicationAuditAction" NOT NULL,
    "changedFields" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PublicationAuditEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PublicationAuditEvent_submissionId_createdAt_idx" ON "PublicationAuditEvent"("submissionId", "createdAt");

-- CreateIndex
CREATE INDEX "PublicationAuditEvent_actorId_createdAt_idx" ON "PublicationAuditEvent"("actorId", "createdAt");

-- CreateIndex
CREATE INDEX "Submission_status_isPublicationReady_publishedAt_idx" ON "Submission"("status", "isPublicationReady", "publishedAt");

-- CreateIndex
CREATE INDEX "Submission_publicationYear_publicationVolume_publicationIss_idx" ON "Submission"("publicationYear", "publicationVolume", "publicationIssue");

-- AddForeignKey
ALTER TABLE "PublicationAuditEvent" ADD CONSTRAINT "PublicationAuditEvent_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "Submission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PublicationAuditEvent" ADD CONSTRAINT "PublicationAuditEvent_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
