import { Request, Response } from "express";
import { AuthServices } from "../services/auth.services";
import catchAsync from "../utils/catchAsync";
import sendResponse from "../utils/sendResponse";

import { ImageKitUtils } from "../utils/imagekit.utils";

const signup = catchAsync(async (req: Request, res: Response) => {
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

export const AuthControllers = {
  signup,
  login,
  getUserById
};
