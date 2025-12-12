import { Request, Response } from "express";
import { FileServices } from "../services/file.services";
import catchAsync from "../utils/catchAsync";
import sendResponse from "../utils/sendResponse";

const createFile = catchAsync(async (req: Request & { user?: any }, res: Response) => {
  const result = await FileServices.createFile({
    ...req.body,
    uploadedBy: req.user?.id || req.user?._id,
  });

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "File uploaded successfully",
    data: result,
  });
});

const getFileById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await FileServices.getFileById(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "File retrieved successfully",
    data: result,
  });
});

const getProjectFiles = catchAsync(async (req: Request, res: Response) => {
  const { projectId } = req.params;
  const { limit = 10, page = 1 } = req.query;

  const result = await FileServices.getProjectFiles(
    projectId,
    parseInt(limit as string),
    parseInt(page as string),
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Project files retrieved successfully",
    data: result,
  });
});

const deleteFile = catchAsync(async (req: Request & { user?: any }, res: Response) => {
  const { id } = req.params;
  const result = await FileServices.deleteFile(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "File deleted successfully",
    data: result,
  });
});

export const FileControllers = {
  createFile,
  getFileById,
  getProjectFiles,
  deleteFile,
};
