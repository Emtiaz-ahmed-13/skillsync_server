import { Schema, model } from "mongoose";
import { ITask } from "../interfaces/task.interface";

const taskSchema = new Schema<ITask>(
  {
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    sprintId: {
      type: Schema.Types.ObjectId,
      ref: "Sprint",
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    assignedTo: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    status: {
      type: String,
      enum: ["todo", "in-progress", "review", "completed"],
      default: "todo",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    order: {
      type: Number,
      default: 0,
    },
    tags: {
      type: [String],
      default: [],
    },
    attachments: {
      type: [Schema.Types.ObjectId],
      ref: "File",
      default: [],
    },
    estimatedHours: {
      type: Number,
    },
    actualHours: {
      type: Number,
    },
    dueDate: {
      type: Date,
    },
  },
  { timestamps: true },
);

export const Task = model<ITask>("Task", taskSchema);