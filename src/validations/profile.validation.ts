import { z } from "zod";

export const updateProfileSchema = z.object({
  body: z.object({
    name: z.string().min(2).optional(),
    phone: z.string().optional(),
    avatar: z.string().url().optional().or(z.literal("")),
  }),
});

export const updateFreelancerProfileSchema = z.object({
  body: z.object({
    hourlyRate: z.number().min(0).optional(),
    skills: z.array(z.string()).optional(),
    portfolio: z.array(z.string().url()).optional(),
    bio: z.string().max(1000).optional(),
    experience: z.string().max(2000).optional(),
    availability: z.enum(["available", "busy", "unavailable"]).optional(),
  }),
});

export const updateClientProfileSchema = z.object({
  body: z.object({
    companyName: z.string().optional(),
    companyWebsite: z.string().url().optional().or(z.literal("")),
    industry: z.string().optional(),
  }),
});
