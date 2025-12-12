import { Types } from "mongoose";

export interface ITimeTracking {
  _id?: Types.ObjectId;
  id?: string;
  taskId?: Types.ObjectId;
  projectId: Types.ObjectId;
  milestoneId?: Types.ObjectId;
  userId: Types.ObjectId;
  startTime: Date;
  endTime?: Date;
  duration?: number; // in minutes
  description?: string;
  isManual: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
