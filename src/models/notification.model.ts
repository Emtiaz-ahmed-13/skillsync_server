import { Schema, model } from "mongoose";
import { INotification } from "../interfaces/notification.interface";

const notificationSchema = new Schema<INotification>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    senderId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    type: {
      type: String,
      enum: [
        "project_created",
        "project_updated",
        "milestone_created",
        "milestone_completed",
        "task_assigned",
        "task_updated",
        "file_uploaded",
        "payment_received",
        "review_received",
        "message_sent",
      ],
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
    },
    taskId: {
      type: Schema.Types.ObjectId,
      ref: "Task",
    },
    milestoneId: {
      type: Schema.Types.ObjectId,
      ref: "Milestone",
    },
    fileId: {
      type: Schema.Types.ObjectId,
      ref: "File",
    },
    reviewId: {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    readAt: {
      type: Date,
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true },
);

export const Notification = model<INotification>("Notification", notificationSchema);
