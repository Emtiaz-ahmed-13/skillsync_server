import { Request, Response } from "express";
import {
  IAuthRequest,
  ILoginRequest,
  IRegisterRequest,
} from "../interfaces/auth.interface";
import { AuthService } from "../services/auth.service";
import { ApiError } from "../utils/ApiError";

const authService = new AuthService();

export const authController = {
  // Register a new user
  async register(req: Request, res: Response) {
    try {
      const userData: IRegisterRequest = req.body;
      const result = await authService.register(userData);

      res.status(201).json({
        message: "User registered successfully",
        ...result,
      });
    } catch (error) {
      if (error instanceof ApiError) {
        res.status(error.status).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Could not register user" });
      }
    }
  },

  // Login user
  async login(req: Request, res: Response) {
    try {
      const credentials: ILoginRequest = req.body;
      const result = await authService.login(credentials);

      res.json({
        message: "User logged in successfully",
        ...result,
      });
    } catch (error) {
      if (error instanceof ApiError) {
        res.status(error.status).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Could not login user" });
      }
    }
  },

  // Get user profile
  async getProfile(req: IAuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Authentication required" });
      }

      const user = await authService.getProfile(userId);
      res.json({ user });
    } catch (error) {
      if (error instanceof ApiError) {
        res.status(error.status).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Could not get profile" });
      }
    }
  },

  // Update user profile
  async updateProfile(req: IAuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Authentication required" });
      }

      const updateData = {
        name: req.body.name,
      };

      const user = await authService.updateProfile(userId, updateData);
      res.json({ user });
    } catch (error) {
      if (error instanceof ApiError) {
        res.status(error.status).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Could not update profile" });
      }
    }
  },

  // Change password
  async changePassword(req: IAuthRequest, res: Response) {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ message: "Authentication required" });
      }

      const { currentPassword, newPassword } = req.body;
      await authService.changePassword(userId, currentPassword, newPassword);

      res.json({ message: "Password updated successfully" });
    } catch (error) {
      if (error instanceof ApiError) {
        res.status(error.status).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Could not change password" });
      }
    }
  },
};
