import { Schema, model } from "mongoose";
import { ISprint } from "../interfaces/sprint.interface";

const featureSchema = new Schema(
  {
    id: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "in-progress", "completed"],
      default: "pending",
    },
  },
  { _id: false },
);

const sprintSchema = new Schema<ISprint>(
  {
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    features: [featureSchema],
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["planning", "in-progress", "completed"],
      default: "planning",
    },
  },
  { timestamps: true },
);

export const Sprint = model<ISprint>("Sprint", sprintSchema);
