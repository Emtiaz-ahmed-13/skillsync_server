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
};

type TLogin = {
  email: string;
  password: string;
};

const signup = async (payload: TSignup) => {
  const { name, email, password, role, phone } = payload;

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
  });

  // Convert Mongoose document to plain object and remove password
  const userObj = user.toObject();
  const { password: _, ...userWithoutPassword } = userObj;

  // Generate tokens
  const accessToken = jwtHelpers.generateToken(
    userWithoutPassword,
    config.jwt.jwt_secret as Secret,
    config.jwt.expires_in as string,
  );

  const refreshToken = jwtHelpers.generateToken(
    userWithoutPassword,
    config.jwt.refresh_token_secret as Secret,
    config.jwt.refresh_token_expires_in as string,
  );

  return {
    accessToken,
    refreshToken,
    user: userWithoutPassword,
  };
};

const login = async (payload: TLogin) => {
  // find user
  // check whether password correct
  // generate access and refresh token
  // return data
  const { email, password } = payload;

  const user = await findUserByEmail(email);

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) throw new ApiError(401, "Invalid Credentials.");

  const { password: _, ...userWithoutPassword } = user;

  const accessToken = jwtHelpers.generateToken(
    userWithoutPassword,
    config.jwt.jwt_secret as Secret,
    config.jwt.expires_in as string,
  );

  const refreshToken = jwtHelpers.generateToken(
    userWithoutPassword,
    config.jwt.refresh_token_secret as Secret,
    config.jwt.refresh_token_expires_in as string,
  );

  return {
    accessToken,
    refreshToken,
    userWithoutPassword,
  };
};

export const AuthServices = {
  signup,
  login,
};
