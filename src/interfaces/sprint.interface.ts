import { Types } from "mongoose";

export interface ISprint {
  _id?: Types.ObjectId;
  id?: string;
  projectId: Types.ObjectId;
  name: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  status: "planned" | "in-progress" | "completed";
  createdAt?: Date;
  updatedAt?: Date;
}