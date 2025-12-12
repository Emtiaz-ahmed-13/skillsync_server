import { z } from "zod";

export const createFileSchema = z.object({
  body: z.object({
    name: z.string().min(1, "File name is required").trim(),
    originalName: z.string().min(1, "Original file name is required"),
    mimeType: z.string().min(1, "MIME type is required"),
    size: z.number().int().min(0, "File size must be positive"),
    url: z.string().url("Invalid URL format"),
    projectId: z.string().min(1, "Project ID is required"),
    milestoneId: z.string().optional(),
    folder: z.string().optional(),
  }),
});
