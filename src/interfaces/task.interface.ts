import { Types } from "mongoose";

export interface ITask {
  _id?: Types.ObjectId;
  id?: string;
  projectId: Types.ObjectId;
  sprintId?: Types.ObjectId;
  title: string;
  description?: string;
  assignedTo?: Types.ObjectId;
  status: "todo" | "in-progress" | "review" | "completed";
  priority: "low" | "medium" | "high";
  order: number;
  tags?: string[];
  attachments?: Types.ObjectId[];
  estimatedHours?: number;
  actualHours?: number;
  dueDate?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}