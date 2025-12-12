import { z } from "zod";

export const createTimeTrackingSchema = z.object({
  body: z.object({
    taskId: z.string().optional(),
    projectId: z.string().min(1, "Project ID is required"),
    milestoneId: z.string().optional(),
    startTime: z.union([z.string(), z.date()]).transform((val) => {
      if (val instanceof Date) return val;
      const date = new Date(val);
      return isNaN(date.getTime()) ? new Date() : date;
    }),
    endTime: z
      .union([z.string(), z.date()])
      .optional()
      .transform((val) => {
        if (!val) return undefined;
        if (val instanceof Date) return val;
        const date = new Date(val);
        return isNaN(date.getTime()) ? undefined : date;
      }),
    duration: z.number().int().min(0).optional(),
    description: z.string().optional(),
    isManual: z.boolean().default(false),
  }),
});

export const updateTimeTrackingSchema = z.object({
  body: z.object({
    endTime: z
      .union([z.string(), z.date()])
      .optional()
      .transform((val) => {
        if (!val) return undefined;
        if (val instanceof Date) return val;
        const date = new Date(val);
        return isNaN(date.getTime()) ? undefined : date;
      }),
    duration: z.number().int().min(0).optional(),
    description: z.string().optional(),
  }),
});
