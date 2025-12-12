import { Types } from "mongoose";

export type ProjectStatus = "pending" | "in_progress" | "completed" | "cancelled";

export type ActivityType =
  | "milestone_created"
  | "milestone_completed"
  | "project_created"
  | "project_updated"
  | "project_status_changed";

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

export interface IActivityLog {
  _id?: Types.ObjectId;
  id?: string;
  projectId: Types.ObjectId;
  actorId: Types.ObjectId;
  type: ActivityType;
  payload?: Record<string, any>;
  createdAt?: Date;
}

export interface IProject {
  _id?: Types.ObjectId;
  id?: string;
  title: string;
  description?: string;
  ownerId: Types.ObjectId;
  status: ProjectStatus;
  milestones?: IMilestone[];
  recentActivity?: IActivityLog[];
  createdAt?: Date;
  updatedAt?: Date;
}
