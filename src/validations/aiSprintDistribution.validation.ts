import { z } from "zod";

export const generateSprintPlanSchema = z.object({
  body: z.object({
    projectTitle: z.string().min(1, "Project title is required"),
    projectDescription: z.string().min(1, "Project description is required"),
    timeline: z.number().min(1, "Timeline in days is required"),
    featuresCount: z.number().min(1, "Number of features is required").optional(),
  }),
});

export const editFeatureSchema = z.object({
  body: z.object({
    title: z.string().min(1, "Feature title is required").optional(),
    description: z.string().min(1, "Feature description is required").optional(),
    status: z.enum(["pending", "in-progress", "completed"]).optional(),
  }),
});
