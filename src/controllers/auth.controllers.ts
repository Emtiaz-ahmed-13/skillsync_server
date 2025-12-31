import { Request, Response } from "express";
import { AuthServices } from "../services/auth.services";
import catchAsync from "../utils/catchAsync";
import sendResponse from "../utils/sendResponse";

import { ImageKitUtils } from "../utils/imagekit.utils";

const signup = catchAsync(async (req: Request, res: Response) => {
  // Handle file upload for avatar
  if (req.file) {
    try {
      const uploadResult = await ImageKitUtils.uploadFile(
        req.file.buffer,
        req.file.originalname,
        "/user-avatars"
      );
      req.body.avatar = uploadResult.url;
    } catch (error) {
      console.error("Avatar upload failed:", error);
      // We can choose to proceed without avatar or throw error. 
      // Proceeding ensures user can still signup even if image upload fails.
    }
  }

  const result = await AuthServices.signup(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "User registered successfully",
    data: result,
  });
});

const login = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthServices.login(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Logged In Successful.",
    data: result,
  });
});

const getUserById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await AuthServices.getUserById(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User retrieved successfully",
    data: result,
  });
});

const googleCallback = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) {
    return sendResponse(res, {
      statusCode: 401,
      success: false,
      message: "Google Authentication Failed",
      data: null,
    });
  }

  const result = await AuthServices.loginWithGoogle(req.user);

  // Redirect to frontend with tokens
  // Note: ideally should be configurable via env
  res.redirect(
    `http://localhost:3000?accessToken=${result.accessToken}&refreshToken=${result.refreshToken}`
  );
});

export const AuthControllers = {
  signup,
  login,
  getUserById,
  googleCallback,
};
