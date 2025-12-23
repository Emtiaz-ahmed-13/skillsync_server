import { Schema, model } from "mongoose";
import { ISprint } from "../interfaces/sprint.interface";

const sprintSchema = new Schema<ISprint>(
  {
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
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
      enum: ["planned", "in-progress", "completed"],
      default: "planned",
    },
  },
  { timestamps: true },
);

export const Sprint = model<ISprint>("Sprint", sprintSchema);