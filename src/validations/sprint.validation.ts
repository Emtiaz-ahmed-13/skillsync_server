import { z } from "zod";

export const createSprintSchema = z.object({
  body: z.object({
    projectId: z.string().min(1, "Project ID is required"),
    name: z.string().min(1, "Sprint name is required"),
    description: z.string().optional(),
    startDate: z.string().datetime().or(z.date()),
    endDate: z.string().datetime().or(z.date()),
    status: z.enum(["planned", "in-progress", "completed"]).optional(),
  }),
});

export const updateSprintSchema = z.object({
  body: z.object({
    name: z.string().min(1, "Sprint name is required").optional(),
    description: z.string().optional(),
    startDate: z.string().datetime().or(z.date()).optional(),
    endDate: z.string().datetime().or(z.date()).optional(),
    status: z.enum(["planned", "in-progress", "completed"]).optional(),
  }),
});