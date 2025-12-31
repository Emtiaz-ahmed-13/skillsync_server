import { Secret } from "jsonwebtoken";
import config from "../config";
import { UserRole } from "../interfaces/user.interface";
import { User } from "../models/user.model";
import ApiError from "../utils/ApiError";
import { jwtHelpers } from "../utils/jwtHelpers";
import { findUserByEmail } from "../utils/userHelpers";

import bcrypt from "bcrypt";

type TSignup = {
  name: string;
  email: string;
  password: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
};

type TLogin = {
  email: string;
  password: string;
};

const signup = async (payload: TSignup) => {
  const { name, email, password, role, phone, avatar } = payload;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(409, "User already exists with this email");
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    role,
    phone,
    avatar,
  });

  // Convert Mongoose document to plain object and remove password
  const userObj = user.toObject();
  const { password: _, ...userWithoutPassword } = userObj;

  // Create a clean user object for token generation
  const cleanUser = {
    id: userWithoutPassword._id,
    name: userWithoutPassword.name,
    email: userWithoutPassword.email,
    role: userWithoutPassword.role,
    isEmailVerified: userWithoutPassword.isEmailVerified,
    createdAt: userWithoutPassword.createdAt,
    updatedAt: userWithoutPassword.updatedAt,
  };

  // Generate tokens
  const accessToken = jwtHelpers.generateToken(
    cleanUser,
    config.jwt.jwt_secret as Secret,
    config.jwt.expires_in as string,
  );

  const refreshToken = jwtHelpers.generateToken(
    cleanUser,
    config.jwt.refresh_token_secret as Secret,
    config.jwt.refresh_token_expires_in as string,
  );

  return {
    accessToken,
    refreshToken,
    user: cleanUser,
  };
};

const login = async (payload: TLogin) => {

  const { email, password } = payload;

  const user = await findUserByEmail(email);

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) throw new ApiError(401, "Invalid Credentials.");

  const userObj = user.toObject();
  const { password: _, ...userWithoutPassword } = userObj;
  const cleanUser = {
    id: userWithoutPassword._id,
    name: userWithoutPassword.name,
    email: userWithoutPassword.email,
    role: userWithoutPassword.role,
    isEmailVerified: userWithoutPassword.isEmailVerified,
    createdAt: userWithoutPassword.createdAt,
    updatedAt: userWithoutPassword.updatedAt,
  };

  const accessToken = jwtHelpers.generateToken(
    cleanUser,
    config.jwt.jwt_secret as Secret,
    config.jwt.expires_in as string,
  );

  const refreshToken = jwtHelpers.generateToken(
    cleanUser,
    config.jwt.refresh_token_secret as Secret,
    config.jwt.refresh_token_expires_in as string,
  );

  return {
    accessToken,
    refreshToken,
    userWithoutPassword: cleanUser,
  };
};

const getUserById = async (id: string) => {
  const user = await User.findById(id).select("name email role avatar");
  if (!user) {
    throw new ApiError(404, "User not found");
  }
  return user;
};

const loginWithGoogle = async (user: any) => {
  const userObj = user.toObject ? user.toObject() : user;
  const { password: _, ...userWithoutPassword } = userObj;

  const cleanUser = {
    id: userWithoutPassword._id,
    name: userWithoutPassword.name,
    email: userWithoutPassword.email,
    role: userWithoutPassword.role,
    isEmailVerified: userWithoutPassword.isEmailVerified,
    createdAt: userWithoutPassword.createdAt,
    updatedAt: userWithoutPassword.updatedAt,
  };

  const accessToken = jwtHelpers.generateToken(
    cleanUser,
    config.jwt.jwt_secret as Secret,
    config.jwt.expires_in as string
  );

  const refreshToken = jwtHelpers.generateToken(
    cleanUser,
    config.jwt.refresh_token_secret as Secret,
    config.jwt.refresh_token_expires_in as string
  );

  return {
    accessToken,
    refreshToken,
    user: cleanUser,
  };
};

export const AuthServices = {
  signup,
  login,
  getUserById,
  loginWithGoogle,
};
