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

export const ProfileService = {
  getProfile,
  updateProfile,
  updateFreelancerProfile,
  updateClientProfile,
  deleteProfile,
};
