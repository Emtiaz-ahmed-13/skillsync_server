import { Types } from "mongoose";

export type PaymentStatus = "pending" | "processing" | "completed" | "failed" | "refunded";
export type PaymentMethod = "stripe" | "paypal" | "bank_transfer";

export interface IPayment {
  _id?: Types.ObjectId;
  id?: string;
  projectId: Types.ObjectId;
  milestoneId?: Types.ObjectId;
  clientId: Types.ObjectId; // Payer
  freelancerId: Types.ObjectId; // Payee
  amount: number; // in cents
  currency: string; // e.g., "USD"
  status: PaymentStatus;
  method: PaymentMethod;
  stripePaymentIntentId?: string;
  stripeCustomerId?: string;
  transactionId?: string;
  description?: string;
  paidAt?: Date;
  refundedAt?: Date;
  metadata?: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
}
