-- CreateEnum
CREATE TYPE "ReviewerAssignmentStatus" AS ENUM ('ACTIVE', 'COMPLETED', 'REMOVED');

-- CreateEnum
CREATE TYPE "ReviewDecision" AS ENUM ('ACCEPT', 'MINOR_REVISION', 'MAJOR_REVISION', 'REJECT');

-- AlterEnum
ALTER TYPE "UserRole" ADD VALUE 'REVIEWER';

-- AlterTable
ALTER TABLE "Submission" ADD COLUMN     "isPublicationReady" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "publicationSlug" TEXT,
ADD COLUMN     "publishedAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "ReviewerAssignment" (
    "id" TEXT NOT NULL,
    "submissionId" TEXT NOT NULL,
    "reviewerId" TEXT NOT NULL,
    "assignedById" TEXT NOT NULL,
    "status" "ReviewerAssignmentStatus" NOT NULL DEFAULT 'ACTIVE',
    "invitedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "respondedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReviewerAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "submissionId" TEXT NOT NULL,
    "reviewerId" TEXT NOT NULL,
    "reviewerAssignmentId" TEXT NOT NULL,
    "decision" "ReviewDecision" NOT NULL,
    "commentsToAuthor" TEXT,
    "commentsToEditor" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ReviewerAssignment_reviewerId_status_updatedAt_idx" ON "ReviewerAssignment"("reviewerId", "status", "updatedAt");

-- CreateIndex
CREATE INDEX "ReviewerAssignment_submissionId_status_idx" ON "ReviewerAssignment"("submissionId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "ReviewerAssignment_submissionId_reviewerId_key" ON "ReviewerAssignment"("submissionId", "reviewerId");

-- CreateIndex
CREATE UNIQUE INDEX "Review_reviewerAssignmentId_key" ON "Review"("reviewerAssignmentId");

-- CreateIndex
CREATE INDEX "Review_submissionId_updatedAt_idx" ON "Review"("submissionId", "updatedAt");

-- CreateIndex
CREATE INDEX "Review_reviewerId_updatedAt_idx" ON "Review"("reviewerId", "updatedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Review_submissionId_reviewerId_key" ON "Review"("submissionId", "reviewerId");

-- CreateIndex
CREATE UNIQUE INDEX "Submission_publicationSlug_key" ON "Submission"("publicationSlug");

-- AddForeignKey
ALTER TABLE "ReviewerAssignment" ADD CONSTRAINT "ReviewerAssignment_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "Submission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReviewerAssignment" ADD CONSTRAINT "ReviewerAssignment_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReviewerAssignment" ADD CONSTRAINT "ReviewerAssignment_assignedById_fkey" FOREIGN KEY ("assignedById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "Submission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_reviewerId_fkey" FOREIGN KEY ("reviewerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_reviewerAssignmentId_fkey" FOREIGN KEY ("reviewerAssignmentId") REFERENCES "ReviewerAssignment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

