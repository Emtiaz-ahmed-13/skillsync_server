import { z } from "zod";

export const createSprintSchema = z.object({
  body: z.object({
    projectId: z.string().min(1, "Project ID is required"),
    title: z.string().min(1, "Sprint title is required"),
    description: z.string().min(1, "Sprint description is required"),
    features: z
      .array(
        z.object({
          id: z.string().min(1, "Feature ID is required"),
          title: z.string().min(1, "Feature title is required"),
          description: z.string().min(1, "Feature description is required"),
          status: z.enum(["pending", "in-progress", "completed"]).optional(),
        }),
      )
      .optional(),
    startDate: z.string().datetime().or(z.date()),
    endDate: z.string().datetime().or(z.date()),
    status: z.enum(["planning", "in-progress", "completed"]).optional(),
  }),
});

export const updateSprintSchema = z.object({
  body: z.object({
    title: z.string().min(1, "Sprint title is required").optional(),
    description: z.string().min(1, "Sprint description is required").optional(),
    features: z
      .array(
        z.object({
          id: z.string().min(1, "Feature ID is required"),
          title: z.string().min(1, "Feature title is required"),
          description: z.string().min(1, "Feature description is required"),
          status: z.enum(["pending", "in-progress", "completed"]).optional(),
        }),
      )
      .optional(),
    startDate: z.string().datetime().or(z.date()).optional(),
    endDate: z.string().datetime().or(z.date()).optional(),
    status: z.enum(["planning", "in-progress", "completed"]).optional(),
  }),
});
