import { Types } from "mongoose";

export interface IBid {
  _id?: Types.ObjectId;
  id?: string;
  projectId: Types.ObjectId;
  freelancerId: Types.ObjectId;
  amount: number;
  proposal: string;
  resumeUrl?: string;
  status: "pending" | "accepted" | "rejected";
  createdAt?: Date;
  updatedAt?: Date;
}
