import { Types } from "mongoose";

export type NotificationType =
  | "project_created"
  | "project_updated"
  | "milestone_created"
  | "milestone_completed"
  | "task_assigned"
  | "task_updated"
  | "file_uploaded"
  | "payment_received"
  | "review_received"
  | "message_sent"
  | "bid_submitted"
  | "bid_accepted"
  | "bid_rejected"
  | "work_submitted"
  | "work_accepted"
  | "work_rejected";

export interface INotification {
  _id?: Types.ObjectId;
  id?: string;
  userId: Types.ObjectId; // Recipient
  senderId?: Types.ObjectId; // Sender (optional)
  type: NotificationType;
  title: string;
  message: string;
  projectId?: Types.ObjectId;
  taskId?: Types.ObjectId;
  milestoneId?: Types.ObjectId;
  fileId?: Types.ObjectId;
  reviewId?: Types.ObjectId;
  isRead: boolean;
  readAt?: Date;
  metadata?: Record<string, any>; // Additional data
  createdAt?: Date;
  updatedAt?: Date;
}
