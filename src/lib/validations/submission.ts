import { z } from "zod";

export const manuscriptLanguages = ["en", "zh", "bilingual", "other"] as const;
export const uploadKinds = ["manuscript"] as const;
export const publicIdSchema = z.string().trim().regex(/^FJ-[A-Z0-9-]{6,64}$/);

const keywordSchema = z.string().trim().min(1).max(60);

const nullableTrimmedString = z
  .string()
  .trim()
  .max(30000)
  .transform((value) => value || null)
  .nullable()
  .optional();

export const submissionDraftSchema = z.object({
  title: z.string().trim().max(200).default(""),
  abstract: nullableTrimmedString,
  keywords: z.array(keywordSchema).max(12).default([]),
  coverLetter: nullableTrimmedString,
  introduction: nullableTrimmedString,
  mainContent: nullableTrimmedString,
  conclusion: nullableTrimmedString,
  references: nullableTrimmedString,
  manuscriptLanguage: z
    .enum(manuscriptLanguages)
    .nullable()
    .optional(),
  manuscriptFileName: z
    .string()
    .trim()
    .max(255)
    .transform((value) => value || null)
    .nullable()
    .optional(),
  manuscriptStorageProvider: z
    .string()
    .trim()
    .max(60)
    .transform((value) => value || null)
    .nullable()
    .optional(),
  manuscriptMimeType: z
    .string()
    .trim()
    .max(120)
    .transform((value) => value || null)
    .nullable()
    .optional(),
  manuscriptSizeBytes: z
    .number()
    .int()
    .nonnegative()
    .nullable()
    .optional(),
  sourceArchiveFileName: z
    .string()
    .trim()
    .max(255)
    .transform((value) => value || null)
    .nullable()
    .optional(),
  sourceArchiveStorageProvider: z
    .string()
    .trim()
    .max(60)
    .transform((value) => value || null)
    .nullable()
    .optional(),
  sourceArchiveMimeType: z
    .string()
    .trim()
    .max(120)
    .transform((value) => value || null)
    .nullable()
    .optional(),
  sourceArchiveSizeBytes: z
    .number()
    .int()
    .nonnegative()
    .nullable()
    .optional(),
});

export const submitManuscriptSchema = submissionDraftSchema.extend({
  title: z.string().trim().min(3).max(200),
  abstract: z.string().trim().min(50).max(10000),
  keywords: z.array(keywordSchema).min(1).max(12),
  manuscriptLanguage: z.enum(manuscriptLanguages),
  manuscriptFileName: z.string().trim().min(1).max(255),
  manuscriptStorageProvider: z.string().trim().min(1).max(60),
  manuscriptMimeType: z.literal("application/pdf"),
  manuscriptSizeBytes: z.number().int().positive(),
});

export type SubmissionDraftInput = z.infer<typeof submissionDraftSchema>;
export type UploadKind = (typeof uploadKinds)[number];
