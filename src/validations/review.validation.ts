import { z } from "zod";

export const createReviewSchema = z.object({
  body: z.object({
    projectId: z.string().min(1, "Project ID is required"),
    revieweeId: z.string().min(1, "Reviewee ID is required"),
    rating: z.number().int().min(1).max(5),
    comment: z.string().optional(),
    professionalism: z.number().int().min(1).max(5).optional(),
    communication: z.number().int().min(1).max(5).optional(),
    expertise: z.number().int().min(1).max(5).optional(),
    quality: z.number().int().min(1).max(5).optional(),
    punctuality: z.number().int().min(1).max(5).optional(),
  }),
});
