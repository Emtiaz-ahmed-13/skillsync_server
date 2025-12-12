import { Schema, model } from "mongoose";
import { IMilestone } from "../interfaces/project.interface";

const milestoneSchema = new Schema<IMilestone>(
  {
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    dueDate: {
      type: Date,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    order: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true },
);

// Index for efficient queries
milestoneSchema.index({ projectId: 1, order: 1 });

export const Milestone = model<IMilestone>("Milestone", milestoneSchema);

