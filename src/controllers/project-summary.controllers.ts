import { Request, Response } from "express";
import { ProjectSummaryService } from "../services/project-summary.services";
import catchAsync from "../utils/catchAsync";
import sendResponse from "../utils/sendResponse";

/**
 * Generate project summary
 * POST /api/v1/projects/:projectId/generate-summary
 */
export const generateSummary = catchAsync(async (req: Request, res: Response) => {
    const { projectId } = req.params;
    const userId = (req as any).user._id || (req as any).user.id;

    // Generate summary
    const summary = await ProjectSummaryService.generateProjectSummary(projectId);

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Project summary generated successfully",
        data: summary,
    });
});

/**
 * Get project summary
 * GET /api/v1/projects/:projectId/summary
 */
export const getSummary = catchAsync(async (req: Request, res: Response) => {
    const { projectId } = req.params;
    const userId = (req as any).user._id || (req as any).user.id;

    // Get summary
    const summary = await ProjectSummaryService.getProjectSummary(projectId);

    sendResponse(res, {
        statusCode: 200,
        success: true,
        message: "Project summary retrieved successfully",
        data: summary,
    });
});

export const ProjectSummaryController = {
    generateSummary,
    getSummary,
};
