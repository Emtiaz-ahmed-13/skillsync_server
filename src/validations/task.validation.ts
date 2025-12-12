import { z } from "zod";

export const createTaskSchema = z.object({
  body: z.object({
    title: z.string().min(1, "Title is required").trim(),
    description: z.string().optional(),
    projectId: z.string().min(1, "Project ID is required"),
    milestoneId: z.string().optional(),
    assignedTo: z.string().optional(),
    priority: z.enum(["low", "medium", "high"]).optional(),
    dueDate: z
      .union([z.string(), z.date()])
      .optional()
      .transform((val) => {
        if (!val) return undefined;
        if (val instanceof Date) return val;
        const date = new Date(val);
        return isNaN(date.getTime()) ? undefined : date;
      }),
    estimatedHours: z.number().int().min(0).optional(),
    tags: z.array(z.string()).optional(),
  }),
});

export const updateTaskSchema = z.object({
  body: z.object({
    title: z.string().min(1, "Title is required").trim().optional(),
    description: z.string().optional(),
    status: z.enum(["todo", "in_progress", "review", "completed", "cancelled"]).optional(),
    priority: z.enum(["low", "medium", "high"]).optional(),
    dueDate: z
      .union([z.string(), z.date()])
      .optional()
      .transform((val) => {
        if (!val) return undefined;
        if (val instanceof Date) return val;
        const date = new Date(val);
        return isNaN(date.getTime()) ? undefined : date;
      }),
    estimatedHours: z.number().int().min(0).optional(),
    loggedHours: z.number().int().min(0).optional(),
    tags: z.array(z.string()).optional(),
    assignedTo: z.string().optional(),
  }),
});
