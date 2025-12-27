import { Request, Response } from "express";
import { AISprintDistributionServices } from "../services/aiSprintDistribution.services";
import catchAsync from "../utils/catchAsync";
import sendResponse from "../utils/sendResponse";

const generateSprintPlan = catchAsync(async (req: Request, res: Response) => {
  const { projectId } = req.params;
  const { projectTitle, projectDescription, timeline, featuresCount } = req.body;

  const result = await AISprintDistributionServices.generateSprintPlan(
    projectId,
    projectTitle,
    projectDescription,
    timeline,
    featuresCount,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Sprint plan generated successfully",
    data: result.sprints,
  });
});

const updateFeature = catchAsync(async (req: Request, res: Response) => {
  const { sprintId, featureId } = req.params;
  const updateData = req.body;

  const result = await AISprintDistributionServices.updateFeature(sprintId, featureId, updateData);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Feature updated successfully",
    data: result,
  });
});

const generateMilestones = catchAsync(async (req: Request, res: Response) => {
  const { projectId } = req.params;
  const { projectTitle, projectDescription, timeline } = req.body;

  const result = await AISprintDistributionServices.generateMilestones(
    projectId,
    projectTitle,
    projectDescription,
    timeline,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Milestones generated successfully",
    data: result.milestones,
  });
});

const completeSprint = catchAsync(async (req: Request, res: Response) => {
  const { sprintId } = req.params;

  const result = await AISprintDistributionServices.completeSprint(sprintId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Sprint completed successfully",
    data: result,
  });
});

export const AISprintDistributionControllers = {
  generateSprintPlan,
  updateFeature,
  generateMilestones,
  completeSprint,
};
