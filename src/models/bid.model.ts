import { Schema, model } from "mongoose";
import { IBid } from "../interfaces/project.interface";

const bidSchema = new Schema<IBid>(
  {
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    freelancerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    proposal: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true },
);

// Index for efficient querying
bidSchema.index({ projectId: 1, freelancerId: 1 });
bidSchema.index({ projectId: 1, amount: 1 });

export const Bid = model<IBid>("Bid", bidSchema);
