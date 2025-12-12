import { Payment } from "../models/payment.model";
import { Project } from "../models/project.model";
import { Review } from "../models/review.model";
import { User } from "../models/user.model";
import ApiError from "../utils/ApiError";

const getAllUsers = async (limit: number = 10, page: number = 1, role?: string) => {
  const skip = (page - 1) * limit;

  // Build query based on role filter
  const query: any = {};
  if (role) {
    query.role = role;
  }

  const users = await User.find(query)
    .select("-password")
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip)
    .lean();

  const total = await User.countDocuments(query);

  return {
    users: users.map((user) => ({
      id: user._id || user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      avatar: user.avatar,
      freelancerProfile: user.freelancerProfile,
      clientProfile: user.clientProfile,
      isEmailVerified: user.isEmailVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    })),
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalUsers: total,
      hasNextPage: page < Math.ceil(total / limit),
      hasPrevPage: page > 1,
    },
  };
};

const getUserById = async (userId: string) => {
  const user = await User.findById(userId).select("-password");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const userObj = user.toObject();
  return userObj;
};

const updateUserRole = async (userId: string, role: string) => {
  const user = await User.findByIdAndUpdate(
    userId,
    { $set: { role } },
    { new: true, runValidators: true },
  ).select("-password");

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const userObj = user.toObject();
  return userObj;
};

const deleteUser = async (userId: string) => {
  const user = await User.findByIdAndDelete(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return { message: "User deleted successfully" };
};

const getDashboardAnalytics = async () => {
  // Get counts
  const totalUsers = await User.countDocuments();
  const totalProjects = await Project.countDocuments();
  const totalPayments = await Payment.countDocuments();
  const totalReviews = await Review.countDocuments();

  // Get counts by role
  const clientsCount = await User.countDocuments({ role: "client" });
  const freelancersCount = await User.countDocuments({ role: "freelancer" });
  const adminsCount = await User.countDocuments({ role: "admin" });

  // Get counts by project status
  const pendingProjects = await Project.countDocuments({ status: "pending" });
  const inProgressProjects = await Project.countDocuments({ status: "in_progress" });
  const completedProjects = await Project.countDocuments({ status: "completed" });
  const cancelledProjects = await Project.countDocuments({ status: "cancelled" });

  // Get counts by payment status
  const pendingPayments = await Payment.countDocuments({ status: "pending" });
  const completedPayments = await Payment.countDocuments({ status: "completed" });
  const failedPayments = await Payment.countDocuments({ status: "failed" });
  const refundedPayments = await Payment.countDocuments({ status: "refunded" });

  // Calculate total revenue
  const completedPaymentsData = await Payment.find({ status: "completed" }).select("amount");
  const totalRevenue = completedPaymentsData.reduce((sum, payment) => sum + payment.amount, 0);

  // Get recent reviews
  const recentReviews = await Review.find()
    .populate("projectId", "title")
    .populate("reviewerId", "name email")
    .populate("revieweeId", "name email")
    .sort({ createdAt: -1 })
    .limit(5)
    .lean();

  return {
    counts: {
      totalUsers,
      totalProjects,
      totalPayments,
      totalReviews,
      totalRevenue,
    },
    userRoles: {
      clients: clientsCount,
      freelancers: freelancersCount,
      admins: adminsCount,
    },
    projectStatus: {
      pending: pendingProjects,
      inProgress: inProgressProjects,
      completed: completedProjects,
      cancelled: cancelledProjects,
    },
    paymentStatus: {
      pending: pendingPayments,
      completed: completedPayments,
      failed: failedPayments,
      refunded: refundedPayments,
    },
    recentReviews: recentReviews.map((review) => ({
      id: review._id || review.id,
      projectId: review.projectId,
      reviewerId: review.reviewerId,
      revieweeId: review.revieweeId,
      rating: review.rating,
      comment: review.comment,
      createdAt: review.createdAt,
    })),
  };
};

const getDisputes = async (limit: number = 10, page: number = 1) => {
  const skip = (page - 1) * limit;

  // For now, we'll simulate disputes by finding payments with "failed" status
  // In a real application, you would have a separate disputes collection
  const disputes = await Payment.find({ status: "failed" })
    .populate("projectId", "title")
    .populate("clientId", "name email")
    .populate("freelancerId", "name email")
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip)
    .lean();

  const total = await Payment.countDocuments({ status: "failed" });

  return {
    disputes: disputes.map((dispute) => ({
      id: dispute._id || dispute.id,
      projectId: dispute.projectId,
      clientId: dispute.clientId,
      freelancerId: dispute.freelancerId,
      amount: dispute.amount,
      currency: dispute.currency,
      status: dispute.status,
      method: dispute.method,
      description: dispute.description,
      createdAt: dispute.createdAt,
      updatedAt: dispute.updatedAt,
    })),
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalDisputes: total,
      hasNextPage: page < Math.ceil(total / limit),
      hasPrevPage: page > 1,
    },
  };
};

const resolveDispute = async (paymentId: string, resolution: string) => {
  // In a real application, you would have a separate disputes collection
  // For now, we'll just update the payment status and add a note

  const payment = await Payment.findByIdAndUpdate(
    paymentId,
    {
      $set: {
        status: resolution === "refund" ? "refunded" : "completed",
        refundedAt: resolution === "refund" ? new Date() : undefined,
      },
    },
    { new: true, runValidators: true },
  )
    .populate("projectId", "title")
    .populate("clientId", "name email")
    .populate("freelancerId", "name email");

  if (!payment) {
    throw new ApiError(404, "Payment not found");
  }

  const paymentObj = payment.toObject();
  return {
    message: `Dispute resolved with ${resolution}`,
    payment: paymentObj,
  };
};

export const AdminServices = {
  getAllUsers,
  getUserById,
  updateUserRole,
  deleteUser,
  getDashboardAnalytics,
  getDisputes,
  resolveDispute,
};
