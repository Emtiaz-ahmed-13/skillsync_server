import { Request, Response } from "express";
import { DisputeServices } from "../services/dispute.services";
import catchAsync from "../utils/catchAsync";
import sendResponse from "../utils/sendResponse";

const createDispute = catchAsync(async (req: Request & { user?: any }, res: Response) => {
  const userId = req.user?.id || req.user?._id;
  const result = await DisputeServices.createDispute({
    projectId: req.body.projectId,
    reportedBy: userId,
    reason: req.body.reason,
    againstUser: req.body.againstUser,
  });

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Dispute submitted successfully",
    data: result,
  });
});

const getDisputes = catchAsync(async (req: Request, res: Response) => {
  const { limit = 10, page = 1, status } = req.query;
  const result = await DisputeServices.getDisputes(
    parseInt(limit as string),
    parseInt(page as string),
    status as string | undefined,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Disputes retrieved",
    data: result,
  });
});

const resolveDispute = catchAsync(async (req: Request & { user?: any }, res: Response) => {
  const adminId = req.user?.id || req.user?._id;
  const result = await DisputeServices.resolveDispute(
    req.params.id,
    adminId,
    req.body.resolution,
    req.body.note,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Dispute resolved",
    data: result,
  });
});

export const DisputeControllers = { createDispute, getDisputes, resolveDispute };
