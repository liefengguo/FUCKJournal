import { z } from "zod";

export const reviewDecisionValues = [
  "ACCEPT",
  "MINOR_REVISION",
  "MAJOR_REVISION",
  "REJECT",
] as const;

const optionalLongText = z
  .string()
  .trim()
  .max(12000)
  .transform((value) => value || null)
  .nullable()
  .optional();

export const reviewInputSchema = z.object({
  decision: z.enum(reviewDecisionValues),
  commentsToAuthor: optionalLongText,
  commentsToEditor: optionalLongText,
});

export const reviewerAssignmentSchema = z.object({
  reviewerId: z.string().cuid(),
});

export type ReviewInput = z.infer<typeof reviewInputSchema>;
