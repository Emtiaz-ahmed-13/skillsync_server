import crypto from "crypto";
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

const generateToken = () => crypto.randomBytes(32).toString("hex");

const buildAuthResponse = (userObj: any) => {
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

  return { accessToken, refreshToken, user: cleanUser };
};

const signup = async (payload: TSignup) => {
  const { name, email, password, role, phone, avatar } = payload;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(409, "User already exists with this email");
  }

  const verificationToken = generateToken();
  const user = await User.create({
    name,
    email,
    password,
    role,
    phone,
    avatar,
    emailVerificationToken: verificationToken,
    emailVerificationExpires: new Date(Date.now() + 24 * 60 * 60 * 1000),
  });

  try {
    const { EmailUtils } = await import("../utils/email.utils");
    await EmailUtils.sendWelcomeEmail(email, name);
    await EmailUtils.sendVerificationEmail(email, name, verificationToken);
  } catch (error: any) {
    console.error(`Failed to send signup emails to ${email}:`, error.message);
  }

  return buildAuthResponse(user.toObject());
};

const login = async (payload: TLogin) => {
  const { email, password } = payload;
  const user = await findUserByEmail(email);
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) throw new ApiError(401, "Invalid Credentials.");

  if (!user.isEmailVerified && user.role !== "admin") {
    throw new ApiError(
      403,
      "Please verify your email before logging in. Check your inbox or request a new verification link.",
    );
  }

  return {
    ...buildAuthResponse(user.toObject()),
    userWithoutPassword: buildAuthResponse(user.toObject()).user,
  };
};

const getUserById = async (id: string) => {
  const user = await User.findById(id).select("name email role avatar");
  if (!user) throw new ApiError(404, "User not found");
  return user;
};

const forgotPassword = async (email: string) => {
  const user = await User.findOne({ email });
  if (!user) {
    return { message: "If that email exists, a reset link has been sent." };
  }

  const resetToken = generateToken();
  user.passwordResetToken = resetToken;
  user.passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000);
  await user.save();

  try {
    const { EmailUtils } = await import("../utils/email.utils");
    await EmailUtils.sendPasswordResetEmail(email, user.name, resetToken);
  } catch (error: any) {
    console.error("Failed to send reset email:", error.message);
  }

  return { message: "If that email exists, a reset link has been sent." };
};

const resetPassword = async (token: string, newPassword: string) => {
  const user = await User.findOne({
    passwordResetToken: token,
    passwordResetExpires: { $gt: new Date() },
  }).select("+passwordResetToken +passwordResetExpires");

  if (!user) throw new ApiError(400, "Invalid or expired reset token");

  user.password = newPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  return { message: "Password reset successful" };
};

const verifyEmail = async (token: string) => {
  const user = await User.findOne({
    emailVerificationToken: token,
    emailVerificationExpires: { $gt: new Date() },
  }).select("+emailVerificationToken +emailVerificationExpires");

  if (!user) throw new ApiError(400, "Invalid or expired verification token");

  user.isEmailVerified = true;
  user.emailVerificationToken = undefined;
  user.emailVerificationExpires = undefined;
  await user.save();

  return { message: "Email verified successfully" };
};

const resendVerification = async (email: string) => {
  const user = await User.findOne({ email }).select(
    "+emailVerificationToken +emailVerificationExpires",
  );
  if (!user) throw new ApiError(404, "User not found");
  if (user.isEmailVerified) throw new ApiError(400, "Email already verified");

  const verificationToken = generateToken();
  user.emailVerificationToken = verificationToken;
  user.emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
  await user.save();

  const { EmailUtils } = await import("../utils/email.utils");
  await EmailUtils.sendVerificationEmail(email, user.name, verificationToken);

  return { message: "Verification email sent" };
};

const loginWithGitHub = async (payload: {
  email: string;
  name: string;
  avatar?: string;
  githubId: string;
}) => {
  const { email, name, avatar, githubId } = payload;
  let user = await User.findOne({ email });

  if (!user) {
    const randomPassword = crypto.randomBytes(32).toString("hex");
    user = await User.create({
      name,
      email,
      password: randomPassword,
      role: "freelancer",
      avatar,
      isEmailVerified: true,
    });

    try {
      const { EmailUtils } = await import("../utils/email.utils");
      await EmailUtils.sendWelcomeEmail(email, name);
    } catch (error: any) {
      console.error(`Welcome email failed for GitHub user ${email}:`, error.message);
    }
  } else {
    if (avatar && user.avatar !== avatar) {
      user.avatar = avatar;
    }
    if (!user.isEmailVerified) {
      user.isEmailVerified = true;
    }
    await user.save();
  }

  const response = buildAuthResponse(user.toObject());
  return {
    ...response,
    userWithoutPassword: response.user,
  };
};

const loginWithGoogle = async (user: any) => {
  const userObj = user.toObject ? user.toObject() : user;
  return buildAuthResponse(userObj);
};

export const AuthServices = {
  signup,
  login,
  getUserById,
  forgotPassword,
  resetPassword,
  verifyEmail,
  resendVerification,
  loginWithGitHub,
  loginWithGoogle,
};
