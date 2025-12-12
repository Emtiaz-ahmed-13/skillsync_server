import { Schema, model } from "mongoose";
import { ITimeTracking } from "../interfaces/timeTracking.interface";

const timeTrackingSchema = new Schema<ITimeTracking>(
  {
    taskId: {
      type: Schema.Types.ObjectId,
      ref: "Task",
    },
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    milestoneId: {
      type: Schema.Types.ObjectId,
      ref: "Milestone",
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    startTime: {
      type: Date,
      required: true,
    },
    endTime: {
      type: Date,
    },
    duration: {
      type: Number, // in minutes
    },
    description: {
      type: String,
      trim: true,
    },
    isManual: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

// Index for efficient queries
timeTrackingSchema.index({ projectId: 1 });
timeTrackingSchema.index({ milestoneId: 1 });
timeTrackingSchema.index({ taskId: 1 });
timeTrackingSchema.index({ userId: 1 });
timeTrackingSchema.index({ startTime: -1 });

export const TimeTracking = model<ITimeTracking>("TimeTracking", timeTrackingSchema);
