import { Request, Response } from "express";
import { TaskServices } from "../services/task.services";
import catchAsync from "../utils/catchAsync";
import sendResponse from "../utils/sendResponse";

const createTask = catchAsync(async (req: Request, res: Response) => {
  const result = await TaskServices.createTask(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Task created successfully",
    data: result,
  });
});

const getTasksByProject = catchAsync(async (req: Request, res: Response) => {
  const { projectId } = req.params;
  const result = await TaskServices.getTasksByProject(projectId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Tasks retrieved successfully",
    data: result,
  });
});

const getTasksBySprint = catchAsync(async (req: Request, res: Response) => {
  const { sprintId } = req.params;
  const result = await TaskServices.getTasksBySprint(sprintId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Tasks retrieved successfully",
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

const updateTask = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await TaskServices.updateTask(id, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Task updated successfully",
    data: result,
  });
});

const deleteTask = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await TaskServices.deleteTask(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Task deleted successfully",
    data: result,
  });
});

const updateTaskOrder = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { order, status } = req.body;
  const result = await TaskServices.updateTaskOrder(id, order, status);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Task order updated successfully",
    data: result,
  });
});

const bulkUpdateTasks = catchAsync(async (req: Request, res: Response) => {
  const { updates } = req.body;
  const result = await TaskServices.bulkUpdateTasks(updates);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Tasks updated successfully",
    data: result,
  });
});

const getTasksByStatus = catchAsync(async (req: Request, res: Response) => {
  const { projectId, status } = req.params;
  const result = await TaskServices.getTasksByStatus(projectId, status);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Tasks retrieved successfully",
    data: result,
  });
});

export const TaskControllers = {
  createTask,
  getTasksByProject,
  getTasksBySprint,
  getTaskById,
  updateTask,
  deleteTask,
  updateTaskOrder,
  bulkUpdateTasks,
  getTasksByStatus,
};