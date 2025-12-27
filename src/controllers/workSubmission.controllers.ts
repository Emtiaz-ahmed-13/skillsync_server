import { Request, Response } from "express";
import { WorkSubmissionServices } from "../services/workSubmission.services";
import catchAsync from "../utils/catchAsync";
import sendResponse from "../utils/sendResponse";

const createWorkSubmission = catchAsync(async (req: Request, res: Response) => {
  const result = await WorkSubmissionServices.createWorkSubmission(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Work submission created successfully",
    data: result,
  });
});

const getWorkSubmissionsByProject = catchAsync(async (req: Request, res: Response) => {
  const { projectId } = req.params;
  const result = await WorkSubmissionServices.getWorkSubmissionsByProject(projectId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Work submissions retrieved successfully",
    data: result,
  });
});

const getWorkSubmissionsBySprint = catchAsync(async (req: Request, res: Response) => {
  const { sprintId } = req.params;
  const result = await WorkSubmissionServices.getWorkSubmissionsBySprint(sprintId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Work submissions retrieved successfully",
    data: result,
  });
});

const getWorkSubmissionsByFreelancer = catchAsync(async (req: Request, res: Response) => {
  const { freelancerId } = req.params;
  const result = await WorkSubmissionServices.getWorkSubmissionsByFreelancer(freelancerId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Work submissions retrieved successfully",
    data: result,
  });
});

const getWorkSubmissionById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await WorkSubmissionServices.getWorkSubmissionById(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Work submission retrieved successfully",
    data: result,
  });
});

const updateWorkSubmission = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await WorkSubmissionServices.updateWorkSubmission(id, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Work submission updated successfully",
    data: result,
  });
});

const updateWorkSubmissionStatus = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  const result = await WorkSubmissionServices.updateWorkSubmissionStatus(id, status);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Work submission status updated successfully",
    data: result,
  });
});

const deleteWorkSubmission = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await WorkSubmissionServices.deleteWorkSubmission(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Work submission deleted successfully",
    data: result,
  });
});

export const WorkSubmissionControllers = {
  createWorkSubmission,
  getWorkSubmissionsByProject,
  getWorkSubmissionsBySprint,
  getWorkSubmissionsByFreelancer,
  getWorkSubmissionById,
  updateWorkSubmission,
  updateWorkSubmissionStatus,
  deleteWorkSubmission,
};
