import { Types } from "mongoose";

export type TaskStatus = "todo" | "in_progress" | "review" | "completed" | "cancelled";

export interface ITask {
  _id?: Types.ObjectId;
  id?: string;
  title: string;
  description?: string;
  projectId: Types.ObjectId;
  milestoneId?: Types.ObjectId;
  assignedTo?: Types.ObjectId;
  createdBy: Types.ObjectId;
  status: TaskStatus;
  priority?: "low" | "medium" | "high";
  dueDate?: Date;
  estimatedHours?: number;
  loggedHours?: number;
  tags?: string[];
  attachments?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}
