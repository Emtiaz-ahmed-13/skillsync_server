import { Request, Response } from "express";
import { ProjectServices } from "../services/project.services";
import catchAsync from "../utils/catchAsync";
import sendResponse from "../utils/sendResponse";

const createProject = catchAsync(async (req: Request, res: Response) => {
  const projectData = req.body;
  const result = await ProjectServices.createProject(projectData);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Project created successfully",
    data: result,
  });
});

const getAllProjects = catchAsync(async (req: Request, res: Response) => {
  const { limit = 10, page = 1 } = req.query;
  const result = await ProjectServices.getAllProjects(
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

  if (!result) {
    return sendResponse(res, {
      statusCode: 404,
      success: false,
      message: "Project not found",
      data: null,
    });
  }

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Project retrieved successfully",
    data: result,
  });
});

const updateProject = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updateData = req.body;
  const result = await ProjectServices.updateProject(id, updateData);

  if (!result) {
    return sendResponse(res, {
      statusCode: 404,
      success: false,
      message: "Project not found",
      data: null,
    });
  }

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Project updated successfully",
    data: result,
  });
});

const deleteProject = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ProjectServices.deleteProject(id);

  if (!result) {
    return sendResponse(res, {
      statusCode: 404,
      success: false,
      message: "Project not found",
      data: null,
    });
  }

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Project deleted successfully",
    data: null,
  });
});

// Get projects by owner ID
const getProjectsByOwnerId = catchAsync(async (req: Request, res: Response) => {
  const { ownerId } = req.params;
  const result = await ProjectServices.getProjectsByOwnerId(ownerId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Projects retrieved successfully",
    data: result,
  });
});

// Get approved projects
const getApprovedProjects = catchAsync(async (req: Request, res: Response) => {
  const { limit = 10, page = 1 } = req.query;
  const result = await ProjectServices.getApprovedProjects(
    parseInt(limit as string),
    parseInt(page as string),
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Approved projects retrieved successfully",
    data: result,
  });
});

// Get pending projects for admin
const getPendingProjects = catchAsync(async (req: Request, res: Response) => {
  const { limit = 10, page = 1 } = req.query;
  const result = await ProjectServices.getPendingProjects(
    parseInt(limit as string),
    parseInt(page as string),
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Pending projects retrieved successfully",
    data: result,
  });
});

// Approve or reject project
const approveProject = catchAsync(async (req: Request & { user?: any }, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  const approvedBy = req.user?.id || req.user?._id;

  const result = await ProjectServices.approveProject(id, status, approvedBy);

  if (!result) {
    return sendResponse(res, {
      statusCode: 404,
      success: false,
      message: "Project not found",
      data: null,
    });
  }

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: `Project ${status} successfully`,
    data: result,
  });
});

export const ProjectControllers = {
  createProject,
  getAllProjects,
  getProjectsByOwnerId,
  getApprovedProjects,
  getPendingProjects,
  getProjectById,
  updateProject,
  approveProject,
  deleteProject,
};
