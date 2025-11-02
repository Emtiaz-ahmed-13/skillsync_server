import { NextFunction, Request, Response } from "express";
import { ApiError } from "../../utils/ApiError";

export const validateRegistration = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const { email, password, name, role } = req.body;

  // Validate email
  if (!email || !email.match(/^\S+@\S+\.\S+$/)) {
    return next(new ApiError(400, "Please provide a valid email"));
  }

  // Validate password
  if (!password || password.length < 6) {
    return next(
      new ApiError(400, "Password must be at least 6 characters long")
    );
  }

  // Validate name
  if (!name || name.trim().length < 2) {
    return next(new ApiError(400, "Please provide a valid name"));
  }

  // Validate role
  if (!role || !["client", "freelancer"].includes(role)) {
    return next(new ApiError(400, "Role must be either client or freelancer"));
  }

  next();
};

export const validateLogin = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ApiError(400, "Please provide email and password"));
  }

  next();
};

export const validatePasswordChange = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return next(new ApiError(400, "Please provide current and new password"));
  }

  if (newPassword.length < 6) {
    return next(
      new ApiError(400, "New password must be at least 6 characters long")
    );
  }

  next();
};
