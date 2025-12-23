import { Request, Response } from "express";
import { SprintServices } from "../services/sprint.services";
import catchAsync from "../utils/catchAsync";
import sendResponse from "../utils/sendResponse";

const createSprint = catchAsync(async (req: Request, res: Response) => {
  const result = await SprintServices.createSprint(req.body);
  
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Sprint created successfully",
    data: result,
  });
});

const getSprintsByProject = catchAsync(async (req: Request, res: Response) => {
  const { projectId } = req.params;
  const result = await SprintServices.getSprintsByProject(projectId);
  
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Sprints retrieved successfully",
    data: result,
  });
});

const getSprintById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await SprintServices.getSprintById(id);
  
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Sprint retrieved successfully",
    data: result,
  });
});

const updateSprint = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await SprintServices.updateSprint(id, req.body);
  
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Sprint updated successfully",
    data: result,
  });
});

const deleteSprint = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await SprintServices.deleteSprint(id);
  
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Sprint deleted successfully",
    data: result,
  });
});

export const SprintControllers = {
  createSprint,
  getSprintsByProject,
  getSprintById,
  updateSprint,
  deleteSprint,
};