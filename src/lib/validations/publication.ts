import { z } from "zod";

export const publicationLocaleValues = ["en", "zh"] as const;
export const publicationPipelineStateValues = [
  "ACCEPTED_PENDING",
  "READY",
  "PUBLISHED",
] as const;

const optionalText = (maxLength: number) =>
  z
    .string()
    .trim()
    .max(maxLength)
    .transform((value) => value || null)
    .nullable()
    .optional();

export const publicationSettingsSchema = z
  .object({
    isPublicationReady: z.boolean(),
    publicationSlug: z
      .string()
      .trim()
      .max(120)
      .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
      .transform((value) => value || null)
      .nullable()
      .optional(),
    publicationTitle: optionalText(220),
    publicationExcerpt: optionalText(2000),
    publicationTags: z
      .array(z.string().trim().min(1).max(50))
      .max(12)
      .default([]),
    publicationLocale: z
      .enum(publicationLocaleValues)
      .nullable()
      .optional(),
    publicationVolume: optionalText(40),
    publicationIssue: optionalText(40),
    publicationYear: z
      .number()
      .int()
      .gte(1900)
      .lte(2100)
      .nullable()
      .optional(),
    seoTitle: optionalText(160),
    seoDescription: optionalText(320),
    publishedAt: z
      .string()
      .trim()
      .transform((value) => value || null)
      .nullable()
      .optional(),
  })
  .superRefine((value, context) => {
    const requiresSlug = value.isPublicationReady || Boolean(value.publishedAt);

    if (requiresSlug && !value.publicationSlug) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["publicationSlug"],
        message: "publicationSlug is required when publication is ready or published",
      });
    }

    if (value.publishedAt && !value.isPublicationReady) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["publishedAt"],
        message: "publishedAt requires isPublicationReady",
      });
    }
  });

export type PublicationSettingsInput = z.infer<typeof publicationSettingsSchema>;
