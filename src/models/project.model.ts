import { Schema, model } from "mongoose";
import { IProject, ProjectStatus } from "../interfaces/project.interface";

const projectSchema = new Schema<IProject>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "in_progress", "completed", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true },
);

// Index for efficient queries
projectSchema.index({ ownerId: 1 });
projectSchema.index({ status: 1 });

export const Project = model<IProject>("Project", projectSchema);

