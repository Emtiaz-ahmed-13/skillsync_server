import { Types } from "mongoose";

export interface IFile {
  _id?: Types.ObjectId;
  id?: string;
  name: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  projectId?: Types.ObjectId;
  milestoneId?: Types.ObjectId;
  uploadedBy: Types.ObjectId;
  folder?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
