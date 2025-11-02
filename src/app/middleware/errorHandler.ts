import { ErrorRequestHandler } from "express";
import { ApiError } from "../../utils/ApiError";

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  if (err instanceof ApiError) {
    return res.status(err.status).json({
      success: false,
      message: err.message,
      status: err.status,
    });
  }

  // For all other errors
  return res.status(500).json({
    success: false,
    message: "Internal server error",
    status: 500,
  });
};
