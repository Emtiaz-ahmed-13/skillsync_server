import { Types } from "mongoose";

export interface IActivityLog {
  _id?: Types.ObjectId;
  id?: string;
  projectId: Types.ObjectId;
  actorId: Types.ObjectId;
  type: string;
  payload?: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
}
