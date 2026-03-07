import { z } from "zod";

export const fetchSecretSchema = z.object({
  password: z.string().optional(),
});

export type FetchSecretFormData = z.infer<typeof fetchSecretSchema>;

export const textSecretSchema = z.object({
  text: z.string().min(1, "Message is required").max(10000, "Message too long"),
  password: z.string().max(100, "Password too long").optional(),
});

export const linkSecretSchema = z.object({
  link: z.string().min(1, "Link is required").url("Invalid URL"),
  password: z.string().max(100, "Password too long").optional(),
});

export const fileSecretSchema = z.object({
  file: z.instanceof(File, { message: "File is required" }),
  password: z.string().max(100, "Password too long").optional(),
});

export type TextSecretFormData = z.infer<typeof textSecretSchema>;
export type LinkSecretFormData = z.infer<typeof linkSecretSchema>;
export type FileSecretFormData = z.infer<typeof fileSecretSchema>;
