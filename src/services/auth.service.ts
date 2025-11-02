import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../app/config";
import {
  IAuthResponse,
  IJwtPayload,
  ILoginRequest,
  IRegisterRequest,
  IUser,
} from "../interfaces/auth.interface";
import { User } from "../models/user.model";
import { ApiError } from "../utils/ApiError";

export class AuthService {
  private createAuthResponse(user: IUser): IAuthResponse {
    const tokenPayload: IJwtPayload = {
      userId: user.id,
      role: user.role,
    };

    const token = jwt.sign(tokenPayload, config.jwt.secret, {
      expiresIn: "7d",
    });

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  private async validatePassword(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  private validatePasswordStrength(password: string): void {
    if (password.length < 6) {
      throw new ApiError(400, "Password must be at least 6 characters long");
    }
  }

  private validateEmail(email: string): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new ApiError(400, "Invalid email format");
    }
  }

  async register(userData: IRegisterRequest): Promise<IAuthResponse> {
    try {
      this.validateEmail(userData.email);
      this.validatePasswordStrength(userData.password);

      const existingUser = await User.findOne({
        email: userData.email.toLowerCase(),
      });

      if (existingUser) {
        throw new ApiError(409, "Email already registered");
      }

      const hashedPassword = await this.hashPassword(userData.password);

      const user = await User.create({
        ...userData,
        password: hashedPassword,
        email: userData.email.toLowerCase(),
      });

      return this.createAuthResponse(user as IUser);
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, "Error creating user");
    }
  }

  async login(credentials: ILoginRequest): Promise<IAuthResponse> {
    try {
      const user = await User.findOne({
        email: credentials.email.toLowerCase(),
      }).select("+password");

      if (
        !user ||
        !(await this.validatePassword(credentials.password, user.password))
      ) {
        throw new ApiError(401, "Invalid credentials");
      }

      return this.createAuthResponse(user as IUser);
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, "Login failed");
    }
  }

  async getProfile(userId: string): Promise<IAuthResponse["user"]> {
    try {
      const user = await User.findById(userId);

      if (!user) {
        throw new ApiError(404, "User not found");
      }

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      };
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, "Error fetching profile");
    }
  }

  async updateProfile(
    userId: string,
    updateData: Partial<Pick<IUser, "name">>
  ): Promise<IAuthResponse["user"]> {
    try {
      const name = updateData.name?.trim();
      if (!name || name.length < 2) {
        throw new ApiError(400, "Name must be at least 2 characters long");
      }

      const user = await User.findByIdAndUpdate(
        userId,
        { $set: { name } },
        { new: true, runValidators: true }
      );

      if (!user) {
        throw new ApiError(404, "User not found");
      }

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      };
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, "Error updating profile");
    }
  }

  async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ): Promise<void> {
    try {
      this.validatePasswordStrength(newPassword);

      const user = await User.findById(userId).select("+password");
      if (!user) {
        throw new ApiError(404, "User not found");
      }

      if (!(await this.validatePassword(currentPassword, user.password))) {
        throw new ApiError(401, "Current password is incorrect");
      }

      user.password = await this.hashPassword(newPassword);
      await user.save();
    } catch (error) {
      if (error instanceof ApiError) throw error;
      throw new ApiError(500, "Error changing password");
    }
  }
}
