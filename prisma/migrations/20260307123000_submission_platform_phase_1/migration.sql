-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'EDITOR', 'ADMIN');

-- CreateEnum
CREATE TYPE "SubmissionStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'REVISION_REQUESTED', 'ACCEPTED', 'REJECTED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Submission" (
    "id" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "title" TEXT NOT NULL DEFAULT '',
    "abstract" TEXT,
    "coverLetter" TEXT,
    "manuscriptLanguage" TEXT,
    "manuscriptFileName" TEXT,
    "manuscriptStorageKey" TEXT,
    "manuscriptMimeType" TEXT,
    "manuscriptSizeBytes" INTEGER,
    "status" "SubmissionStatus" NOT NULL DEFAULT 'DRAFT',
    "submittedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Submission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubmissionVersion" (
    "id" TEXT NOT NULL,
    "submissionId" TEXT NOT NULL,
    "versionNumber" INTEGER NOT NULL,
    "createdById" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "abstract" TEXT,
    "coverLetter" TEXT,
    "manuscriptLanguage" TEXT,
    "manuscriptFileName" TEXT,
    "manuscriptStorageKey" TEXT,
    "manuscriptMimeType" TEXT,
    "manuscriptSizeBytes" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SubmissionVersion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubmissionStatusEvent" (
    "id" TEXT NOT NULL,
    "submissionId" TEXT NOT NULL,
    "actorId" TEXT NOT NULL,
    "fromStatus" "SubmissionStatus",
    "toStatus" "SubmissionStatus" NOT NULL,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SubmissionStatusEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Submission_publicId_key" ON "Submission"("publicId");

-- CreateIndex
CREATE INDEX "Submission_authorId_status_idx" ON "Submission"("authorId", "status");

-- CreateIndex
CREATE INDEX "Submission_status_updatedAt_idx" ON "Submission"("status", "updatedAt");

-- CreateIndex
CREATE INDEX "SubmissionVersion_submissionId_createdAt_idx" ON "SubmissionVersion"("submissionId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "SubmissionVersion_submissionId_versionNumber_key" ON "SubmissionVersion"("submissionId", "versionNumber");

-- CreateIndex
CREATE INDEX "SubmissionStatusEvent_submissionId_createdAt_idx" ON "SubmissionStatusEvent"("submissionId", "createdAt");

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubmissionVersion" ADD CONSTRAINT "SubmissionVersion_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "Submission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubmissionVersion" ADD CONSTRAINT "SubmissionVersion_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubmissionStatusEvent" ADD CONSTRAINT "SubmissionStatusEvent_submissionId_fkey" FOREIGN KEY ("submissionId") REFERENCES "Submission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubmissionStatusEvent" ADD CONSTRAINT "SubmissionStatusEvent_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

