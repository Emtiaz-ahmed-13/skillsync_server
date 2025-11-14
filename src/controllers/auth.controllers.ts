import { Request, Response } from "express";
import { AuthServices } from "../services/auth.services";
import catchAsync from "../utils/catchAsync";
import sendResponse from "../utils/sendResponse";

const signup = catchAsync(async (req: Request, res: Response) => {
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

export const AuthControllers = {
  signup,
  login,
};
