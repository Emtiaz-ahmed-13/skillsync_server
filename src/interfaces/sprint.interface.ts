import { Types } from "mongoose";

export interface IFeature {
  id: string;
  title: string;
  description: string;
  status: "pending" | "in-progress" | "completed";
}

export interface ISprint {
  _id?: Types.ObjectId;
  id?: string;
  projectId: Types.ObjectId;
  title: string;
  description: string;
  features: IFeature[];
  startDate: Date;
  endDate: Date;
  status: "planning" | "in-progress" | "completed";
  createdAt?: Date;
  updatedAt?: Date;
}
