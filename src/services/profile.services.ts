import { IClientProfile, IFreelancerProfile } from "../interfaces/user.interface";
import { User } from "../models/user.model";
import ApiError from "../utils/ApiError";
import { findUserById } from "../utils/userHelpers";

type TUpdateProfile = {
  name?: string;
  phone?: string;
  avatar?: string;
};

type TUpdateFreelancerProfile = {
  hourlyRate?: number;
  skills?: string[];
  portfolio?: string[];
  bio?: string;
  experience?: string;
  availability?: "available" | "busy" | "unavailable";
};

type TUpdateClientProfile = {
  companyName?: string;
  companyWebsite?: string;
  industry?: string;
};

const getProfile = async (userId: string) => {
  const user = await findUserById(userId);
  const userObj = user.toObject();
  const { password: _, ...userWithoutPassword } = userObj;
  return userWithoutPassword;
};

const updateProfile = async (userId: string, payload: TUpdateProfile) => {
  const user = await User.findByIdAndUpdate(
    userId,
    {
      $set: payload,
    },
    {
      new: true,
      runValidators: true,
    },
  );

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const userObj = user.toObject();
  const { password: _, ...userWithoutPassword } = userObj;
  return userWithoutPassword;
};

const updateFreelancerProfile = async (userId: string, payload: TUpdateFreelancerProfile) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (user.role !== "freelancer") {
    throw new ApiError(403, "Only freelancers can update freelancer profile");
  }

  // Merge with existing profile
  const updatedProfile: IFreelancerProfile = {
    ...user.freelancerProfile,
    ...payload,
  };

  user.freelancerProfile = updatedProfile;
  await user.save();

  const userObj = user.toObject();
  const { password: _, ...userWithoutPassword } = userObj;
  return userWithoutPassword;
};

const updateClientProfile = async (userId: string, payload: TUpdateClientProfile) => {
  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (user.role !== "client") {
    throw new ApiError(403, "Only clients can update client profile");
  }
  const updatedProfile: IClientProfile = {
    ...user.clientProfile,
    ...payload,
  };

  user.clientProfile = updatedProfile;
  await user.save();

  const userObj = user.toObject();
  const { password: _, ...userWithoutPassword } = userObj;
  return userWithoutPassword;
};

const deleteProfile = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  const deletedUser = await User.findByIdAndDelete(userId);
  if (!deletedUser) {
    throw new ApiError(500, "Failed to delete user profile");
  }
  return { message: "Profile deleted successfully" };
};

const listFreelancers = async (filters: {
  search?: string;
  skill?: string;
  limit?: number;
  page?: number;
}) => {
  const limit = filters.limit || 12;
  const page = filters.page || 1;
  const skip = (page - 1) * limit;
  const query: Record<string, unknown> = { role: "freelancer" };

  if (filters.search) {
    query.$or = [
      { name: { $regex: filters.search, $options: "i" } },
      { "freelancerProfile.bio": { $regex: filters.search, $options: "i" } },
    ];
  }

  if (filters.skill) {
    query["freelancerProfile.skills"] = { $in: [filters.skill] };
  }

  const [users, total] = await Promise.all([
    User.find(query)
      .select("name email avatar role freelancerProfile createdAt")
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .lean(),
    User.countDocuments(query),
  ]);

  return {
    freelancers: users.map((u) => ({ id: u._id, ...u })),
    totalCount: total,
    pagination: { page, limit, totalPages: Math.ceil(total / limit) },
  };
};

const getPublicFreelancerProfile = async (userId: string) => {
  const user = await User.findOne({ _id: userId, role: "freelancer" })
    .select("name email avatar role freelancerProfile createdAt")
    .lean();

  if (!user) throw new ApiError(404, "Freelancer not found");

  const { Review } = await import("../models/review.model");
  const reviews = await Review.find({ revieweeId: userId })
    .populate("reviewerId", "name avatar")
    .sort({ createdAt: -1 })
    .limit(10)
    .lean();

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  return {
    ...user,
    id: user._id,
    reviews,
    averageRating: Math.round(avgRating * 10) / 10,
    reviewCount: reviews.length,
  };
};

export const ProfileService = {
  getProfile,
  updateProfile,
  updateFreelancerProfile,
  updateClientProfile,
  deleteProfile,
  listFreelancers,
  getPublicFreelancerProfile,
};
