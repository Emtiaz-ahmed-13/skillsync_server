import { z } from "zod";

export const createTaskSchema = z.object({
  body: z.object({
    projectId: z.string().min(1, "Project ID is required"),
    sprintId: z.string().optional(),
    title: z.string().min(1, "Task title is required"),
    description: z.string().optional(),
    assignedTo: z.string().optional(),
    status: z.enum(["todo", "in-progress", "review", "completed"]).optional(),
    priority: z.enum(["low", "medium", "high"]).optional(),
    estimatedHours: z.number().optional(),
    actualHours: z.number().optional(),
    dueDate: z.string().datetime().or(z.date()).optional(),
  }),
});

export const updateTaskSchema = z.object({
  body: z.object({
    sprintId: z.string().optional(),
    title: z.string().min(1, "Task title is required").optional(),
    description: z.string().optional(),
    assignedTo: z.string().optional(),
    status: z.enum(["todo", "in-progress", "review", "completed"]).optional(),
    priority: z.enum(["low", "medium", "high"]).optional(),
    estimatedHours: z.number().optional(),
    actualHours: z.number().optional(),
    dueDate: z.string().datetime().or(z.date()).optional(),
  }),
});