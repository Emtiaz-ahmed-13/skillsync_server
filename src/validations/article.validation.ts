import { z } from "zod";

const createArticle = z.object({
  body: z.object({
    title: z.string().min(1, "Title is required").max(200, "Title cannot exceed 200 characters"),
    content: z.string().min(1, "Content is required"),
    excerpt: z.string().optional(),
    featuredImage: z.string().optional(),
    tags: z.array(z.string()).optional(),
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
    status: z.enum(["published", "rejected"]),
  }),
});

export const ArticleValidations = {
  createArticle,
  updateArticle,
  approveArticle,
};
