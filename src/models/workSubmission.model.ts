import { Schema, model } from "mongoose";
import { IWorkSubmission } from "../interfaces/workSubmission.interface";

const workSubmissionSchema = new Schema<IWorkSubmission>(
  {
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    sprintId: {
      type: Schema.Types.ObjectId,
      ref: "Sprint",
      required: true,
    },
    freelancerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    completedFeatures: [
      {
        type: String,
      },
    ],
    remainingFeatures: [
      {
        type: String,
      },
    ],
    githubLink: {
      type: String,
      required: true,
    },
    liveLink: {
      type: String,
    },
    notes: {
      type: String,
    },
    status: {
      type: String,
      enum: ["pending", "review", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true },
);

export const WorkSubmission = model<IWorkSubmission>("WorkSubmission", workSubmissionSchema);
