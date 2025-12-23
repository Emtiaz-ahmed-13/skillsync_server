import { Request, Response } from "express";
import { SprintPlanningServices } from "../services/sprintPlanning.services";
import catchAsync from "../utils/catchAsync";
import sendResponse from "../utils/sendResponse";

const generateSprintPlan = catchAsync(async (req: Request, res: Response) => {
  const { projectId } = req.params;
  const { method, customData } = req.body;
  
  const result = await SprintPlanningServices.generateAiSprintPlan(
    projectId,
    method
  );
  
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Sprint plan generated successfully",
    data: result,
  });
});

const createSprintPlan = catchAsync(async (req: Request, res: Response) => {
  const { projectId } = req.params;
  const { method, customData } = req.body;
  
  const result = await SprintPlanningServices.createSprintPlan(
    projectId,
    method,
    customData
  );
  
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Sprint plan created successfully",
    data: result,
  });
});

const getSprintPlan = catchAsync(async (req: Request, res: Response) => {
  const { projectId } = req.params;
  const result = await SprintPlanningServices.getSprintPlan(projectId);
  
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Sprint plan retrieved successfully",
    data: result,
  });
});

export const SprintPlanningControllers = {
  generateSprintPlan,
  createSprintPlan,
  getSprintPlan,
};