import { Schema, model } from "mongoose";
import { IFile } from "../interfaces/file.interface";

const fileSchema = new Schema<IFile>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    originalName: {
      type: String,
      required: true,
    },
    mimeType: {
      type: String,
      required: true,
    },
    size: {
      type: Number,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    milestoneId: {
      type: Schema.Types.ObjectId,
      ref: "Milestone",
    },
    uploadedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    folder: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true },
);

export const File = model<IFile>("File", fileSchema);
