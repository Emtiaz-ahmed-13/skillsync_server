import { z } from "zod";

export const createProjectSchema = z.object({
  body: z.object({
    title: z.string().min(1, "Title is required").trim(),
    description: z.string().optional(),
    ownerId: z.string().min(1, "Owner ID is required"),
    status: z.enum(["pending", "in_progress", "completed", "cancelled"]).default("pending"),
    budget: z.number().positive().optional(),
    minBidAmount: z.number().nonnegative().optional(),
  }),
});

export const addMilestoneSchema = z.object({
  body: z.object({
    title: z.string().min(1, "Title is required").trim(),
    description: z.string().optional(),
    dueDate: z
      .union([z.string(), z.date()])
      .optional()
      .transform((val) => {
        if (!val) return undefined;
        if (val instanceof Date) return val;
        const date = new Date(val);
        return isNaN(date.getTime()) ? undefined : date;
      }),
    order: z.number().int().min(0).optional(),
  }),
});

export const updateProjectSchema = z.object({
  body: z.object({
    title: z.string().min(1, "Title is required").trim().optional(),
    description: z.string().optional(),
    status: z.enum(["pending", "in_progress", "completed", "cancelled"]).optional(),
    budget: z.number().positive().optional(),
    minBidAmount: z.number().nonnegative().optional(),
  }),
});

export const updateMilestoneSchema = z.object({
  body: z.object({
    title: z.string().min(1, "Title is required").trim().optional(),
    description: z.string().optional(),
    dueDate: z
      .union([z.string(), z.date()])
      .optional()
      .transform((val) => {
        if (!val) return undefined;
        if (val instanceof Date) return val;
        const date = new Date(val);
        return isNaN(date.getTime()) ? undefined : date;
      }),
    order: z.number().int().min(0).optional(),
    completed: z.boolean().optional(),
  }),
});

export const bulkUpdateMilestonesSchema = z.object({
  body: z.object({
    updates: z
      .array(
        z.object({
          id: z.string().min(1, "Milestone ID is required"),
          updates: z
            .object({
              title: z.string().min(1, "Title is required").trim().optional(),
              description: z.string().optional(),
              dueDate: z
                .union([z.string(), z.date()])
                .optional()
                .transform((val) => {
                  if (!val) return undefined;
                  if (val instanceof Date) return val;
                  const date = new Date(val);
                  return isNaN(date.getTime()) ? undefined : date;
                }),
              order: z.number().int().min(0).optional(),
              completed: z.boolean().optional(),
            })
            .strict(),
        }),
      )
      .min(1, "At least one milestone update is required"),
  }),
});

// New validation schemas for bidding functionality
export const placeBidSchema = z.object({
  body: z.object({
    amount: z.number().positive("Bid amount must be positive"),
    proposal: z.string().min(10, "Proposal must be at least 10 characters"),
  }),
});

export const updateBidSchema = z.object({
  body: z.object({
    status: z.enum(["accepted", "rejected"]),
  }),
});
