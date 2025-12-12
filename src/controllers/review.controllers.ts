import { Request, Response } from "express";
import { ReviewServices } from "../services/review.services";
import catchAsync from "../utils/catchAsync";
import sendResponse from "../utils/sendResponse";

const createReview = catchAsync(async (req: Request & { user?: any }, res: Response) => {
  const result = await ReviewServices.createReview({
    ...req.body,
    reviewerId: req.user?.id || req.user?._id,
  });

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Review created successfully",
    data: result,
  });
});

const getReviewById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ReviewServices.getReviewById(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Review retrieved successfully",
    data: result,
  });
});

const getUserReviews = catchAsync(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { limit = 10, page = 1 } = req.query;

  const result = await ReviewServices.getUserReviews(
    userId,
    parseInt(limit as string),
    parseInt(page as string),
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User reviews retrieved successfully",
    data: result,
  });
});

const getProjectReviews = catchAsync(async (req: Request, res: Response) => {
  const { projectId } = req.params;
  const result = await ReviewServices.getProjectReviews(projectId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Project reviews retrieved successfully",
    data: result,
  });
});

const deleteReview = catchAsync(async (req: Request & { user?: any }, res: Response) => {
  const { id } = req.params;
  const result = await ReviewServices.deleteReview(id, req.user?.id || req.user?._id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Review deleted successfully",
    data: result,
  });
});

export const ReviewControllers = {
  createReview,
  getReviewById,
  getUserReviews,
  getProjectReviews,
  deleteReview,
};
