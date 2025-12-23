import { z } from "zod";

export const createBidSchema = z.object({
  body: z.object({
    projectId: z.string().min(1, "Project ID is required"),
    amount: z.number().positive("Bid amount must be positive"),
    proposal: z.string().min(10, "Proposal must be at least 10 characters long"),
  }),
});

export const updateBidStatusSchema = z.object({
  body: z.object({
    status: z.enum(["accepted", "rejected"]),
  }),
});
