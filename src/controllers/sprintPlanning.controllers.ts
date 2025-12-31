import { Request, Response } from "express";
import { SprintPlanningServices } from "../services/sprintPlanning.services";
import catchAsync from "../utils/catchAsync";
import sendResponse from "../utils/sendResponse";

const generateAndCreateSprintPlan = catchAsync(async (req: Request, res: Response) => {
  const { projectId } = req.params;
  const { method = "manual", customData } = req.body;

  // If customData is provided, use it directly; otherwise generate default plan
  const sprintPlan = customData || await SprintPlanningServices.generateAiSprintPlan(projectId, method);
  const savedSprints = await SprintPlanningServices.createSprintPlan(projectId, sprintPlan);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Sprint plan generated and saved successfully",
    data: savedSprints,
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
  generateAndCreateSprintPlan,
  getSprintPlan,
};
