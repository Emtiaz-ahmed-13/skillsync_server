import { User } from "../models/user.model";
import ApiError from "./ApiError";

export const findUserById = async (id: string) => {
  const user = await User.findById(id);

  if (!user) throw new ApiError(404, "User Not Found");
  return user;
};

export const findUserByEmail = async (email: string) => {
  const user = await User.findOne({ email }).select("+password");

  if (!user) throw new ApiError(404, "User Not Found");
  return user;
};
