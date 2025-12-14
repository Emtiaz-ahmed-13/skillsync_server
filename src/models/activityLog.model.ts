import { Schema, model } from "mongoose";
import { IActivityLog } from "../interfaces/project.interface";

const activityLogSchema = new Schema<IActivityLog>(
  {
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    actorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: [
        "milestone_created",
        "milestone_completed",
        "project_created",
        "project_updated",
        "project_status_changed",
        "bid_placed",
        "bid_accepted",
        "freelancer_assigned",
      ],
      required: true,
    },
    payload: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

export const ActivityLog = model<IActivityLog>("ActivityLog", activityLogSchema);
