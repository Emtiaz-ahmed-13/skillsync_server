import { z } from "zod";

const createArticle = z.object({
  body: z.object({
    title: z.string().min(1, "Title is required").max(200, "Title cannot exceed 200 characters"),
    content: z.string().min(1, "Content is required"),
    excerpt: z.string().optional().or(z.literal("")),
    featuredImage: z.string().optional().or(z.literal("")),
    tags: z.union([z.array(z.string()), z.string()]).optional(),
    category: z.string().optional().or(z.literal("")),
    status: z.enum(["draft", "pending", "published", "rejected"]).optional(),
    slug: z.string().optional(),
  }),
});

const updateArticle = z.object({
  body: z.object({
    title: z
      .string()
      .min(1, "Title cannot be empty")
      .max(200, "Title cannot exceed 200 characters")
      .optional(),
    content: z.string().min(1, "Content cannot be empty").optional(),
    excerpt: z.string().optional(),
    featuredImage: z.string().optional(),
    tags: z.array(z.string()).optional(),
    status: z.enum(["draft", "pending", "published", "rejected"]).optional(),
  }),
});

const approveArticle = z.object({
  body: z.object({
    status: z.literal("published"),
  }),
});

const rejectArticle = z.object({
  body: z.object({
    status: z.literal("rejected"),
    rejectionReason: z.string().optional(),
  }),
});

export const ArticleValidations = {
  createArticle,
  updateArticle,
  approveArticle,
  rejectArticle,
};
