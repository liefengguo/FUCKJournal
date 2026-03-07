import { z } from "zod";

export const manuscriptLanguages = ["en", "zh", "bilingual", "other"] as const;

const nullableTrimmedString = z
  .string()
  .trim()
  .max(10000)
  .transform((value) => value || null)
  .nullable()
  .optional();

export const submissionDraftSchema = z.object({
  title: z.string().trim().max(200).default(""),
  abstract: nullableTrimmedString,
  coverLetter: nullableTrimmedString,
  manuscriptLanguage: z
    .enum(manuscriptLanguages)
    .nullable()
    .optional(),
  manuscriptFileName: z.string().trim().max(255).transform((value) => value || null).nullable().optional(),
  manuscriptMimeType: z.string().trim().max(120).transform((value) => value || null).nullable().optional(),
  manuscriptSizeBytes: z
    .union([z.number().int().nonnegative(), z.nan()])
    .optional()
    .transform((value) => (typeof value === "number" && !Number.isNaN(value) ? value : null)),
});

export const submitManuscriptSchema = submissionDraftSchema.extend({
  title: z.string().trim().min(3).max(200),
  abstract: z.string().trim().min(50).max(10000),
});

export type SubmissionDraftInput = z.infer<typeof submissionDraftSchema>;
