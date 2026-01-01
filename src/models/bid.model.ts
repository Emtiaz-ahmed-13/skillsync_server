import { Schema, model } from "mongoose";
import { IBid } from "../interfaces/bid.interface";

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
    resumeUrl: {
      type: String,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true },
);

export const Bid = model<IBid>("Bid", bidSchema);
