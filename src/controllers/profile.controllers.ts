import { Request, Response } from "express";
import { ProfileService } from "../services/profile.services";
import catchAsync from "../utils/catchAsync";
import sendResponse from "../utils/sendResponse";

const getProfile = catchAsync(async (req: Request & { user?: any }, res: Response) => {
  const userId = req.user?.id || req.user?._id;
  const result = await ProfileService.getProfile(userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Profile retrieved successfully",
    data: result,
  });
});

const updateProfile = catchAsync(async (req: Request & { user?: any }, res: Response) => {
  const userId = req.user?.id || req.user?._id;
  const result = await ProfileService.updateProfile(userId, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Profile updated successfully",
    data: result,
  });
});

const updateFreelancerProfile = catchAsync(async (req: Request & { user?: any }, res: Response) => {
  const userId = req.user?.id || req.user?._id;
  const result = await ProfileService.updateFreelancerProfile(userId, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Freelancer profile updated successfully",
    data: result,
  });
});

const updateClientProfile = catchAsync(async (req: Request & { user?: any }, res: Response) => {
  const userId = req.user?.id || req.user?._id;
  const result = await ProfileService.updateClientProfile(userId, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Client profile updated successfully",
    data: result,
  });
});

const deleteProfile = catchAsync(async (req: Request & { user?: any }, res: Response) => {
  const userId = req.user?.id || req.user?._id;
  const result = await ProfileService.deleteProfile(userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Profile deleted successfully",
    data: result,
  });
});

const listFreelancers = catchAsync(async (req: Request, res: Response) => {
  const { search, skill, limit = 12, page = 1 } = req.query;
  const result = await ProfileService.listFreelancers({
    search: search as string | undefined,
    skill: skill as string | undefined,
    limit: parseInt(limit as string),
    page: parseInt(page as string),
  });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Freelancers retrieved successfully",
    data: result,
  });
});

const getPublicFreelancerProfile = catchAsync(async (req: Request, res: Response) => {
  const result = await ProfileService.getPublicFreelancerProfile(req.params.id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Freelancer profile retrieved successfully",
    data: result,
  });
});

export const ProfileController = {
  getProfile,
  updateProfile,
  updateFreelancerProfile,
  updateClientProfile,
  deleteProfile,
  listFreelancers,
  getPublicFreelancerProfile,
};
