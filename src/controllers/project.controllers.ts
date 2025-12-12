import { Request, Response } from "express";
import { ProjectServices } from "../services/project.services";
import catchAsync from "../utils/catchAsync";
import sendResponse from "../utils/sendResponse";

const createProject = catchAsync(async (req: Request & { user?: any }, res: Response) => {
  const result = await ProjectServices.createProject(req.body, req.user.id || req.user._id);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Project created successfully",
    data: result,
  });
});

const getAllProjects = catchAsync(async (req: Request, res: Response) => {
  // Extract query parameters
  const { limit = 10, page = 1, ownerId, status } = req.query;

  // Build filters object
  const filters: any = {};
  if (ownerId) filters.ownerId = ownerId as string;
  if (status) filters.status = status as string;

  const result = await ProjectServices.getAllProjects(
    filters,
    parseInt(limit as string),
    parseInt(page as string),
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Projects retrieved successfully",
    data: result,
  });
});

const getProjectById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ProjectServices.getProjectById(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Project retrieved successfully",
    data: result,
  });
});

const getProjectMilestones = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ProjectServices.getProjectMilestones(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Project milestones retrieved successfully",
    data: result,
  });
});

const updateProject = catchAsync(async (req: Request & { user?: any }, res: Response) => {
  const { id } = req.params;
  const result = await ProjectServices.updateProject(id, req.body, req.user.id || req.user._id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Project updated successfully",
    data: result,
  });
});

const deleteProject = catchAsync(async (req: Request & { user?: any }, res: Response) => {
  const { id } = req.params;
  const result = await ProjectServices.deleteProject(id, req.user.id || req.user._id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Project deleted successfully",
    data: result,
  });
});

const getDashboard = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ProjectServices.getDashboard(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Project dashboard retrieved successfully",
    data: result,
  });
});

const addMilestone = catchAsync(async (req: Request & { user?: any }, res: Response) => {
  const { id } = req.params;
  const result = await ProjectServices.addMilestone(id, req.body, req.user.id || req.user._id);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Milestone added successfully",
    data: result,
  });
});

const getUserMilestones = catchAsync(async (req: Request & { user?: any }, res: Response) => {
  const userId = req.user?.id || req.user?._id;
  // Extract query parameters
  const { limit = 10, page = 1, completed } = req.query;

  // Build filters object
  const filters: any = {};
  if (completed !== undefined) filters.completed = completed === "true";

  const result = await ProjectServices.getUserMilestones(
    userId,
    filters,
    parseInt(limit as string),
    parseInt(page as string),
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User milestones retrieved successfully",
    data: result,
  });
});

const bulkUpdateMilestones = catchAsync(async (req: Request & { user?: any }, res: Response) => {
  const { updates } = req.body;
  const userId = req.user?.id || req.user?._id;

  const result = await ProjectServices.bulkUpdateMilestones(updates, userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Milestones updated successfully",
    data: result,
  });
});

const searchProjects = catchAsync(async (req: Request, res: Response) => {
  // Extract query parameters
  const { q: searchTerm, limit = 10, page = 1, ownerId, status } = req.query;

  // Build filters object
  const filters: any = {};
  if (ownerId) filters.ownerId = ownerId as string;
  if (status) filters.status = status as string;

  const result = await ProjectServices.searchProjects(
    (searchTerm as string) || "",
    filters,
    parseInt(limit as string),
    parseInt(page as string),
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Projects searched successfully",
    data: result,
  });
});

export const ProjectControllers = {
  createProject,
  getAllProjects,
  searchProjects,
  getProjectById,
  getProjectMilestones,
  getUserMilestones,
  updateProject,
  deleteProject,
  getDashboard,
  addMilestone,
  bulkUpdateMilestones,
};
