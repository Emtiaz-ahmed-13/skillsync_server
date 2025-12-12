import { Request, Response } from "express";
import { ProjectServices } from "../services/project.services";
import catchAsync from "../utils/catchAsync";
import sendResponse from "../utils/sendResponse";

const getMilestoneById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ProjectServices.getMilestoneById(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Milestone retrieved successfully",
    data: result,
  });
});

const updateMilestone = catchAsync(async (req: Request & { user?: any }, res: Response) => {
  const { id } = req.params;
  const result = await ProjectServices.updateMilestone(id, req.body, req.user.id || req.user._id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Milestone updated successfully",
    data: result,
  });
});

const deleteMilestone = catchAsync(async (req: Request & { user?: any }, res: Response) => {
  const { id } = req.params;
  const result = await ProjectServices.deleteMilestone(id, req.user.id || req.user._id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Milestone deleted successfully",
    data: result,
  });
});

export const MilestoneControllers = {
  getMilestoneById,
  updateMilestone,
  deleteMilestone,
};
