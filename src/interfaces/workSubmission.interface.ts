import { Types } from "mongoose";

export interface IWorkSubmission {
  _id?: Types.ObjectId;
  projectId: Types.ObjectId;
  sprintId: Types.ObjectId;
  freelancerId: Types.ObjectId;
  completedFeatures: string[];
  remainingFeatures: string[];
  githubLink: string;
  liveLink?: string;
  notes?: string;
  status: "pending" | "review" | "approved" | "rejected";
  createdAt?: Date;
  updatedAt?: Date;
}
