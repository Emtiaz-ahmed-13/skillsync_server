import { Types } from "mongoose";

export interface IMilestone {
  _id?: Types.ObjectId;
  id?: string;
  projectId: Types.ObjectId;
  title: string;
  description?: string;
  amount?: number;
  dueDate?: Date;
  status: "pending" | "in_progress" | "completed" | "paid";
  completed: boolean;
  completedAt?: Date;
  approvedBy?: Types.ObjectId;
  approvedAt?: Date;
  order: number;
  createdAt?: Date;
  updatedAt?: Date;
}
