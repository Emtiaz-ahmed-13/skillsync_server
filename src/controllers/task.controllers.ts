import { Request, Response } from "express";
import { TaskServices } from "../services/task.services";
import catchAsync from "../utils/catchAsync";
import sendResponse from "../utils/sendResponse";

const createTask = catchAsync(async (req: Request & { user?: any }, res: Response) => {
  const result = await TaskServices.createTask({
    ...req.body,
    createdBy: req.user?.id || req.user?._id,
  });

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Task created successfully",
    data: result,
  });
});

const getTaskById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await TaskServices.getTaskById(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Task retrieved successfully",
    data: result,
  });
});

const getProjectTasks = catchAsync(async (req: Request, res: Response) => {
  const { projectId } = req.params;
  const { limit = 10, page = 1, status, assignedTo } = req.query;

  // Build filters object
  const filters: any = {};
  if (status) filters.status = status as string;
  if (assignedTo) filters.assignedTo = assignedTo as string;

  const result = await TaskServices.getProjectTasks(
    projectId,
    filters,
    parseInt(limit as string),
    parseInt(page as string),
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Project tasks retrieved successfully",
    data: result,
  });
});

const updateTask = catchAsync(async (req: Request & { user?: any }, res: Response) => {
  const { id } = req.params;
  const result = await TaskServices.updateTask(id, req.body, req.user?.id || req.user?._id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Task updated successfully",
    data: result,
  });
});

const deleteTask = catchAsync(async (req: Request & { user?: any }, res: Response) => {
  const { id } = req.params;
  const result = await TaskServices.deleteTask(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Task deleted successfully",
    data: result,
  });
});

export const TaskControllers = {
  createTask,
  getTaskById,
  getProjectTasks,
  updateTask,
  deleteTask,
};
