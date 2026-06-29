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
      enum: ["pending", "approved", "rejected", "in-progress", "completed"],
      default: "pending",
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    freelancerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    features: [
      {
        id: { type: String },
        title: { type: String },
        description: { type: String },
        status: {
          type: String,
          enum: ["pending", "in-progress", "completed"],
        },
      },
    ],
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
