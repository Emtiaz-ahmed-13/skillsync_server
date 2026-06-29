import { Schema, model } from "mongoose";

export interface IDispute {
  projectId: Schema.Types.ObjectId;
  reportedBy: Schema.Types.ObjectId;
  againstUser?: Schema.Types.ObjectId;
  reason: string;
  status: "open" | "resolved" | "dismissed";
  resolution?: string;
  resolvedBy?: Schema.Types.ObjectId;
  resolvedAt?: Date;
}

const disputeSchema = new Schema<IDispute>(
  {
    projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true },
    reportedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    againstUser: { type: Schema.Types.ObjectId, ref: "User" },
    reason: { type: String, required: true },
    status: {
      type: String,
      enum: ["open", "resolved", "dismissed"],
      default: "open",
    },
    resolution: String,
    resolvedBy: { type: Schema.Types.ObjectId, ref: "User" },
    resolvedAt: Date,
  },
  { timestamps: true },
);

export const Dispute = model<IDispute>("Dispute", disputeSchema);
