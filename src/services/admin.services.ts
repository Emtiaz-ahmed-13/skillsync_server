import { Payment } from "../models/payment.model";
import { Project } from "../models/project.model";
import { Review } from "../models/review.model";
import { User } from "../models/user.model";
import ApiError from "../utils/ApiError";

const getAllUsers = async (limit: number = 10, page: number = 1, role?: string) => {
  const skip = (page - 1) * limit;
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
  const totalUsers = await User.countDocuments();
  const totalProjects = await Project.countDocuments();
  const totalPayments = await Payment.countDocuments();
  const totalReviews = await Review.countDocuments();
  const clientsCount = await User.countDocuments({ role: "client" });
  const freelancersCount = await User.countDocuments({ role: "freelancer" });
  const adminsCount = await User.countDocuments({ role: "admin" });
  const pendingProjects = await Project.countDocuments({ status: "pending" });
  const inProgressProjects = await Project.countDocuments({ status: "in-progress" });
  const completedProjects = await Project.countDocuments({ status: "completed" });
  const pendingPayments = await Payment.countDocuments({ status: "pending" });
  const completedPayments = await Payment.countDocuments({ status: "completed" });
  const failedPayments = await Payment.countDocuments({ status: "failed" });
  const refundedPayments = await Payment.countDocuments({ status: "refunded" });
  const completedPaymentsData = await Payment.find({ status: "completed" }).select("amount");
  const totalRevenue = completedPaymentsData.reduce((sum, payment) => sum + payment.amount, 0);
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
  const { DisputeServices } = await import("./dispute.services");
  return DisputeServices.getDisputes(limit, page, "open");
};

const resolveDispute = async (disputeId: string, resolution: string, adminId: string, note?: string) => {
  const { DisputeServices } = await import("./dispute.services");
  const status = resolution === "dismiss" ? "dismissed" : "resolved";
  return DisputeServices.resolveDispute(disputeId, adminId, status as "resolved" | "dismissed", note);
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
