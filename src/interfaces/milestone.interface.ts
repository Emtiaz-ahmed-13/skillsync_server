import { Types } from "mongoose";

export interface IMilestone {
  _id?: Types.ObjectId;
  id?: string;
  projectId: Types.ObjectId;
  title: string;
  description?: string;
  dueDate?: Date;
  completed: boolean;
  order: number;
  createdAt?: Date;
  updatedAt?: Date;
}
