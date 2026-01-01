import { Request, Response } from "express";
import { BidServices } from "../services/bid.services";
import catchAsync from "../utils/catchAsync";
import sendResponse from "../utils/sendResponse";

const createBid = catchAsync(async (req: Request & { user?: any }, res: Response) => {
  const freelancerId = req.user?.id || req.user?._id;
  const bidData = { ...req.body, freelancerId };

  if (req.file) {
    try {
      // Import necessary utilities if not available in scope
      const { ImageKitUtils } = await import("../utils/imagekit.utils");
      const path = await import("path");
      const fs = await import("fs");

      let uploadResult;
      let resumeUrl;

      try {
        uploadResult = await ImageKitUtils.uploadFile(
          req.file.buffer,
          req.file.originalname,
          `/resumes/${freelancerId}`,
        );
        resumeUrl = uploadResult.url;
      } catch (imageKitError) {
        console.log(
          "ImageKit upload failed for resume, saving locally as fallback:",
          (imageKitError as Error).message,
        );

        const uploadDir = path.join(__dirname, "../../uploads/resumes");
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }

        const fileName = `${Date.now()}-${req.file.originalname}`;
        const filePath = path.join(uploadDir, fileName);
        fs.writeFileSync(filePath, req.file.buffer);
        resumeUrl = `/uploads/resumes/${fileName}`;
      }

      bidData.resumeUrl = resumeUrl;
    } catch (error) {
      console.error("Resume processing failed:", error);
    }
  }

  const result = await BidServices.createBid(bidData);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Bid placed successfully",
    data: result,
  });
});

const getProjectBids = catchAsync(async (req: Request, res: Response) => {
  const { projectId } = req.params;
  const result = await BidServices.getProjectBids(projectId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Project bids retrieved successfully",
    data: result,
  });
});

const getUserBids = catchAsync(async (req: Request & { user?: any }, res: Response) => {
  const userId = req.user?.id || req.user?._id;
  const result = await BidServices.getUserBids(userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User bids retrieved successfully",
    data: result,
  });
});

const updateBidStatus = catchAsync(async (req: Request & { user?: any }, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.id || req.user?._id;
  const result = await BidServices.updateBidStatus(id, req.body.status, userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: `Bid ${req.body.status} successfully`,
    data: result,
  });
});

const deleteBid = catchAsync(async (req: Request & { user?: any }, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.id || req.user?._id;
  const result = await BidServices.deleteBid(id, userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Bid deleted successfully",
    data: result,
  });
});

export const BidControllers = {
  createBid,
  getProjectBids,
  getUserBids,
  updateBidStatus,
  deleteBid,
};
