import { Schema, model } from "mongoose";
import { IMilestone } from "../interfaces/milestone.interface";

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

export const Milestone = model<IMilestone>("Milestone", milestoneSchema);
