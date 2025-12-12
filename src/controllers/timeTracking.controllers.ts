import { Request, Response } from "express";
import { TimeTrackingServices } from "../services/timeTracking.services";
import catchAsync from "../utils/catchAsync";
import sendResponse from "../utils/sendResponse";

const createTimeTracking = catchAsync(async (req: Request & { user?: any }, res: Response) => {
  const result = await TimeTrackingServices.createTimeTracking({
    ...req.body,
    userId: req.user?.id || req.user?._id,
  });

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Time tracking record created successfully",
    data: result,
  });
});

const getTimeTrackingById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await TimeTrackingServices.getTimeTrackingById(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Time tracking record retrieved successfully",
    data: result,
  });
});

const getUserTimeTracking = catchAsync(async (req: Request & { user?: any }, res: Response) => {
  const userId = req.user?.id || req.user?._id;
  const { limit = 10, page = 1, projectId, taskId } = req.query;

  // Build filters object
  const filters: any = {};
  if (projectId) filters.projectId = projectId as string;
  if (taskId) filters.taskId = taskId as string;

  const result = await TimeTrackingServices.getUserTimeTracking(
    userId,
    filters,
    parseInt(limit as string),
    parseInt(page as string),
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User time tracking records retrieved successfully",
    data: result,
  });
});

const updateTimeTracking = catchAsync(async (req: Request & { user?: any }, res: Response) => {
  const { id } = req.params;
  const result = await TimeTrackingServices.updateTimeTracking(id, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Time tracking record updated successfully",
    data: result,
  });
});

const deleteTimeTracking = catchAsync(async (req: Request & { user?: any }, res: Response) => {
  const { id } = req.params;
  const result = await TimeTrackingServices.deleteTimeTracking(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Time tracking record deleted successfully",
    data: result,
  });
});

export const TimeTrackingControllers = {
  createTimeTracking,
  getTimeTrackingById,
  getUserTimeTracking,
  updateTimeTracking,
  deleteTimeTracking,
};
