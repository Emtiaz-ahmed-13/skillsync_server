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
    amount: {
      type: Number,
      min: 0,
    },
    dueDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["pending", "in_progress", "completed", "paid"],
      default: "pending",
    },
    completed: {
      type: Boolean,
      default: false,
    },
    completedAt: {
      type: Date,
    },
    approvedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    approvedAt: {
      type: Date,
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
