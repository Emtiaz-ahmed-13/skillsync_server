import { Schema, model } from "mongoose";
import { IPayment } from "../interfaces/payment.interface";

const paymentSchema = new Schema<IPayment>(
  {
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    milestoneId: {
      type: Schema.Types.ObjectId,
      ref: "Milestone",
    },
    clientId: {
      type: Schema.Types.ObjectId,
      ref: "User",
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
    currency: {
      type: String,
      required: true,
      default: "USD",
    },
    status: {
      type: String,
      enum: ["pending", "processing", "completed", "failed", "refunded"],
      default: "pending",
    },
    method: {
      type: String,
      enum: ["stripe", "paypal", "bank_transfer"],
      default: "stripe",
    },
    stripePaymentIntentId: {
      type: String,
    },
    stripeCustomerId: {
      type: String,
    },
    transactionId: {
      type: String,
    },
    description: {
      type: String,
      trim: true,
    },
    paidAt: {
      type: Date,
    },
    refundedAt: {
      type: Date,
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true },
);

export const Payment = model<IPayment>("Payment", paymentSchema);
