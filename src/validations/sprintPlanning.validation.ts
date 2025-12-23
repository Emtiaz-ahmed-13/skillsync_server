import { z } from "zod";

export const generateSprintPlanSchema = z.object({
  body: z.object({
    method: z.enum(["auto", "manual"]).optional(),
    customData: z.any().optional(),
  }),
});

export const createSprintPlanSchema = z.object({
  body: z.object({
    method: z.enum(["auto", "manual"]).optional(),
    customData: z.any().optional(),
  }),
});