import { z } from "zod";

export const credentialsSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(8).max(128),
});

export const signUpSchema = credentialsSchema.extend({
  name: z.string().trim().min(2).max(80),
});

export type CredentialsInput = z.infer<typeof credentialsSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;
