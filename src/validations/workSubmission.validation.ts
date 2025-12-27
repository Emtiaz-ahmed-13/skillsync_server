import { z } from "zod";

export const createWorkSubmissionSchema = z.object({
  body: z.object({
    projectId: z.string().min(1, "Project ID is required"),
    sprintId: z.string().min(1, "Sprint ID is required"),
    freelancerId: z.string().min(1, "Freelancer ID is required"),
    completedFeatures: z.array(z.string()).optional(),
    remainingFeatures: z.array(z.string()).optional(),
    githubLink: z.string().url("GitHub link must be a valid URL"),
    liveLink: z.string().url("Live link must be a valid URL").optional(),
    notes: z.string().optional(),
    status: z.enum(["pending", "review", "approved", "rejected"]).optional(),
  }),
});

export const updateWorkSubmissionSchema = z.object({
  body: z.object({
    completedFeatures: z.array(z.string()).optional(),
    remainingFeatures: z.array(z.string()).optional(),
    githubLink: z.string().url("GitHub link must be a valid URL").optional(),
    liveLink: z.string().url("Live link must be a valid URL").optional(),
    notes: z.string().optional(),
    status: z.enum(["pending", "review", "approved", "rejected"]).optional(),
  }),
});

export const updateWorkSubmissionStatusSchema = z.object({
  body: z.object({
    status: z.enum(["pending", "review", "approved", "rejected"]),
  }),
});
