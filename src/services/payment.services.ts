import { Milestone } from "../models/milestone.model";
import { Payment } from "../models/payment.model";
import { Project } from "../models/project.model";
import { User } from "../models/user.model";
import ApiError from "../utils/ApiError";

type CreatePaymentPayload = {
  projectId: string;
  milestoneId?: string;
  clientId: string;
  freelancerId: string;
  amount: number;
  currency?: string;
  description?: string;
  method?: string;
  stripePaymentIntentId?: string;
  stripeCustomerId?: string;
  metadata?: Record<string, any>;
};

type UpdatePaymentPayload = {
  status?: string;
  transactionId?: string;
  paidAt?: Date;
  refundedAt?: Date;
  metadata?: Record<string, any>;
};

const createPayment = async (payload: CreatePaymentPayload) => {
  // Verify project exists
  const project = await Project.findById(payload.projectId);
  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  // Verify client exists
  const client = await User.findById(payload.clientId);
  if (!client) {
    throw new ApiError(404, "Client not found");
  }

  // Verify freelancer exists
  const freelancer = await User.findById(payload.freelancerId);
  if (!freelancer) {
    throw new ApiError(404, "Freelancer not found");
  }

  // Verify milestone exists (if provided)
  if (payload.milestoneId) {
    const milestone = await Milestone.findById(payload.milestoneId);
    if (!milestone) {
      throw new ApiError(404, "Milestone not found");
    }
  }

  const payment = await Payment.create({
    ...payload,
    currency: payload.currency || "USD",
    method: payload.method || "stripe",
    status: "pending",
  });

  const paymentObj = payment.toObject();
  return paymentObj;
};

const getPaymentById = async (paymentId: string) => {
  const payment = await Payment.findById(paymentId)
    .populate("projectId", "title")
    .populate("milestoneId", "title")
    .populate("clientId", "name email avatar")
    .populate("freelancerId", "name email avatar");

  if (!payment) {
    throw new ApiError(404, "Payment not found");
  }

  const paymentObj = payment.toObject();
  return paymentObj;
};

const getUserPayments = async (
  userId: string,
  role: string,
  limit: number = 10,
  page: number = 1,
) => {
  const skip = (page - 1) * limit;

  // Build query based on user role
  let query: any = {};
  if (role === "client") {
    query.clientId = userId;
  } else if (role === "freelancer") {
    query.freelancerId = userId;
  } else {
    // Admin can see all payments
    query = {};
  }

  const payments = await Payment.find(query)
    .populate("projectId", "title")
    .populate("milestoneId", "title")
    .populate("clientId", "name email avatar")
    .populate("freelancerId", "name email avatar")
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip)
    .lean();

  const total = await Payment.countDocuments(query);

  // Calculate total amount
  const totalAmount = payments.reduce((sum, payment) => sum + payment.amount, 0);

  return {
    payments: payments.map((payment) => ({
      id: payment._id || payment.id,
      projectId: payment.projectId,
      milestoneId: payment.milestoneId,
      clientId: payment.clientId,
      freelancerId: payment.freelancerId,
      amount: payment.amount,
      currency: payment.currency,
      status: payment.status,
      method: payment.method,
      stripePaymentIntentId: payment.stripePaymentIntentId,
      stripeCustomerId: payment.stripeCustomerId,
      transactionId: payment.transactionId,
      description: payment.description,
      paidAt: payment.paidAt,
      refundedAt: payment.refundedAt,
      metadata: payment.metadata,
      createdAt: payment.createdAt,
      updatedAt: payment.updatedAt,
    })),
    totalAmount,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalPayments: total,
      hasNextPage: page < Math.ceil(total / limit),
      hasPrevPage: page > 1,
    },
  };
};

const updatePayment = async (paymentId: string, payload: UpdatePaymentPayload) => {
  const payment = await Payment.findByIdAndUpdate(
    paymentId,
    { $set: payload },
    { new: true, runValidators: true },
  )
    .populate("projectId", "title")
    .populate("milestoneId", "title")
    .populate("clientId", "name email avatar")
    .populate("freelancerId", "name email avatar");

  if (!payment) {
    throw new ApiError(404, "Payment not found");
  }

  const paymentObj = payment.toObject();
  return paymentObj;
};

const deletePayment = async (paymentId: string) => {
  const payment = await Payment.findByIdAndDelete(paymentId);

  if (!payment) {
    throw new ApiError(404, "Payment not found");
  }

  return { message: "Payment deleted successfully" };
};

const getProjectPayments = async (projectId: string) => {
  const payments = await Payment.find({ projectId })
    .populate("milestoneId", "title")
    .populate("clientId", "name email avatar")
    .populate("freelancerId", "name email avatar")
    .sort({ createdAt: -1 })
    .lean();

  // Calculate total amount
  const totalAmount = payments.reduce((sum, payment) => sum + payment.amount, 0);

  return {
    payments: payments.map((payment) => ({
      id: payment._id || payment.id,
      projectId: payment.projectId,
      milestoneId: payment.milestoneId,
      clientId: payment.clientId,
      freelancerId: payment.freelancerId,
      amount: payment.amount,
      currency: payment.currency,
      status: payment.status,
      method: payment.method,
      stripePaymentIntentId: payment.stripePaymentIntentId,
      stripeCustomerId: payment.stripeCustomerId,
      transactionId: payment.transactionId,
      description: payment.description,
      paidAt: payment.paidAt,
      refundedAt: payment.refundedAt,
      metadata: payment.metadata,
      createdAt: payment.createdAt,
      updatedAt: payment.updatedAt,
    })),
    totalAmount,
    totalPayments: payments.length,
  };
};

export const PaymentServices = {
  createPayment,
  getPaymentById,
  getUserPayments,
  updatePayment,
  deletePayment,
  getProjectPayments,
};
