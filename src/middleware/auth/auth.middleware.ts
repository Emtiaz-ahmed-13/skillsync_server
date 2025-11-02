/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import config from "../../app/config";

import {
  IAuthenticatedRequest,
  IJwtPayload,
} from "../../interfaces/auth.interface";
import { UserRole } from "../../interfaces/user.interface";
import { User } from "../../models/user.model";
import { ApiError } from "../../utils/ApiError";

export const verifyToken = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    // Log the authorization header for debugging
    console.log("Authorization header:", req.headers.authorization);

    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return next(new ApiError(401, "Authorization header missing"));
    }

    const parts = authHeader.split(" ");

    if (parts.length !== 2) {
      return next(
        new ApiError(
          401,
          "Authorization header format is invalid. Expected: Bearer <token>"
        )
      );
    }

    if (parts[0] !== "Bearer") {
      return next(
        new ApiError(401, "Authorization header must start with 'Bearer'")
      );
    }

    const token = parts[1];

    if (!token) {
      return next(new ApiError(401, "Token is missing"));
    }

    const decoded = jwt.verify(token, config.jwt.secret) as IJwtPayload;
    const user = await User.findById(decoded.userId).exec();

    if (!user) {
      return next(new ApiError(401, "User not found"));
    }

    (req as IAuthenticatedRequest).user = {
      id: user.id,
      role: user.role,
    };
    next();
  } catch (error) {
    console.error("Token verification error:", error);
    if (error instanceof jwt.TokenExpiredError) {
      return next(new ApiError(401, "Token has expired"));
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return next(new ApiError(401, "Token is invalid"));
    }
    next(new ApiError(401, "Invalid token"));
  }
};

export const requireRole = (...roles: UserRole[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const authReq = req as IAuthenticatedRequest;
    const user = authReq.user;

    if (!user) {
      return next(new ApiError(401, "Authentication required"));
    }

    if (!roles.includes(user.role)) {
      return next(
        new ApiError(403, "You do not have permission to perform this action")
      );
    }

    next();
  };
};
