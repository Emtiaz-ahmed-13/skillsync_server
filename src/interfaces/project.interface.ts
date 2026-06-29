import { Types } from "mongoose";
import { IFeature } from "./sprint.interface";

export interface IProject {
  id?: string;
  _id?: Types.ObjectId;
  title: string;
  description: string;
  minimumBid: number;
  budget: number;
  technology: string[];
  picture?: string;
  features?: IFeature[];
  status: "pending" | "approved" | "rejected" | "in-progress" | "completed";
  ownerId: string | any;
  freelancerId?: string | any;
  createdAt?: Date;
  updatedAt?: Date;
  __v?: number;
}
