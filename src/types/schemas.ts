import { z } from "zod";

export const createSecretSchema = z.object({
  inputType: z.enum(["text", "file", "link"]),
  text: z.string().max(10000, "Message too long").optional(),
  link: z.string().url("Invalid URL").optional(),
  file: z.instanceof(File).optional(),
  password: z.string().max(100, "Password too long").optional(),
}).refine(
  (data) => {
    if (data.inputType === "text") return !!data.text?.trim();
    if (data.inputType === "link") return !!data.link?.trim();
    if (data.inputType === "file") return !!data.file;
    return false;
  },
  {
    message: "Value is required",
    path: ["text"],
  }
);

export const fetchSecretSchema = z.object({
  password: z.string().optional(),
});

export type CreateSecretFormData = z.infer<typeof createSecretSchema>;
export type FetchSecretFormData = z.infer<typeof fetchSecretSchema>;
