import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import { FileServices } from "../services/file.services";
import catchAsync from "../utils/catchAsync";
import { ImageKitUtils } from "../utils/imagekit.utils";
import sendResponse from "../utils/sendResponse";

const createFile = catchAsync(async (req: Request & { user?: any }, res: Response) => {
  // Check if file was uploaded
  if (!req.file) {
    return sendResponse(res, {
      statusCode: 400,
      success: false,
      message: "No file uploaded",
      data: null,
    });
  }

  try {
    // Try to upload file to ImageKit first
    let uploadResult;
    let fileUrl;

    try {
      uploadResult = await ImageKitUtils.uploadFile(
        req.file.buffer,
        req.file.originalname,
        `/projects/${req.body.projectId}`,
      );
      fileUrl = uploadResult.url;
    } catch (imageKitError) {
      // If ImageKit fails, save locally as fallback
      console.log("ImageKit upload failed, saving locally as fallback:", (imageKitError as Error).message);

      // Create uploads directory if it doesn't exist
      const uploadDir = path.join(__dirname, "../../uploads");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      // Save file locally
      const filePath = path.join(uploadDir, `${Date.now()}-${req.file.originalname}`);
      fs.writeFileSync(filePath, req.file.buffer);
      fileUrl = `/uploads/${Date.now()}-${req.file.originalname}`;
    }

    // Prepare file data for database
    const fileData = {
      name: req.file.originalname,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      url: fileUrl,
      projectId: req.body.projectId || undefined,
      milestoneId: req.body.milestoneId || undefined,
      uploadedBy: req.user?.id || req.user?._id,
      folder: req.body.projectId ? `/projects/${req.body.projectId}` : '/user-uploads',
    };

    // Save file metadata to database
    const result = await FileServices.createFile(fileData);

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "File uploaded successfully",
      data: result,
    });
  } catch (error: any) {
    return sendResponse(res, {
      statusCode: 500,
      success: false,
      message: `File upload failed: ${error.message}`,
      data: null,
    });
  }
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
