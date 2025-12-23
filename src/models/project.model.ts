import { Schema, model } from "mongoose";
import { IProject } from "../interfaces/project.interface";

const projectSchema = new Schema<IProject>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    minimumBid: {
      type: Number,
      required: true,
    },
    budget: {
      type: Number,
      required: true,
    },
    technology: [
      {
        type: String,
        required: true,
      },
    ],
    picture: {
      type: String,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    ownerId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Add virtual field for id
projectSchema.virtual("id").get(function () {
  return this._id.toHexString();
});

export const Project = model<IProject>("Project", projectSchema);
