import { z } from "zod";

export const createProjectSchema = z.object({
  body: z.object({
    title: z.string().min(1, "Title is required").trim(),
    description: z.string().min(1, "Description is required"),
    minimumBid: z.coerce.number().positive("Minimum bid must be positive"),
    budget: z.coerce.number().positive("Budget must be positive"),
    technology: z
      .array(z.string().min(1, "Technology cannot be empty"))
      .min(1, "At least one technology is required"),
    picture: z.string().optional(),
    ownerId: z.string().optional(), 
  }),
});

export const updateProjectSchema = z.object({
  body: z.object({
    title: z.string().min(1, "Title is required").trim().optional(),
    description: z.string().min(1, "Description is required").optional(),
    minimumBid: z.number().positive("Minimum bid must be positive").optional(),
    budget: z.number().positive("Budget must be positive").optional(),
    technology: z
      .array(z.string().min(1, "Technology cannot be empty"))
      .min(1, "At least one technology is required")
      .optional(),
    picture: z.string().optional(),
    status: z.enum(["pending", "approved", "rejected"]).optional(),
    ownerId: z.string().min(1, "Owner ID is required").optional(),
  }),
});

// Helper function to validate MongoDB ObjectId format
const isValidObjectId = (id: string) => {
  return /^[0-9a-fA-F]{24}$/.test(id);
};

export const projectIdSchema = z.object({
  params: z.object({
    id: z.string().refine((id) => isValidObjectId(id), {
      message: "Invalid project ID format",
    }),
  }),
});

export const approveProjectSchema = z.object({
  body: z.object({
    status: z.enum(["approved", "rejected"]),
  }),
});
