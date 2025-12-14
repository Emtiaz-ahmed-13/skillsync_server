import { Request, Response } from "express";
import { ProjectServices } from "../services/project.services";
import catchAsync from "../utils/catchAsync";
import sendResponse from "../utils/sendResponse";
import { placeBidSchema, updateBidSchema } from "../validations/project.validation";

interface CustomRequest extends Request {
  user?: {
    id?: string;
    _id?: string;
    role?: string;
    iat?: number;
    exp?: number;
    _doc?: {
      _id?: string;
    };
    $__?: {
      activePaths?: {
        paths?: {
          _id?: boolean;
        };
      };
    };
  };
}
const createProject = catchAsync(async (req: Request & { user?: any }, res: Response) => {
  const result = await ProjectServices.createProject(req.body, req.user.id || req.user._id);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Project created successfully",
    data: result,
  });
});

const getAllProjects = catchAsync(async (req: Request, res: Response) => {
  // Extract query parameters
  const { limit = 10, page = 1, ownerId, status } = req.query;

  // Build filters object
  const filters: any = {};
  if (ownerId) filters.ownerId = ownerId as string;
  if (status) filters.status = status as string;

  const result = await ProjectServices.getAllProjects(
    filters,
    parseInt(limit as string),
    parseInt(page as string),
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Projects retrieved successfully",
    data: result,
  });
});

const getProjectById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ProjectServices.getProjectById(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Project retrieved successfully",
    data: result,
  });
});

const getProjectMilestones = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ProjectServices.getProjectMilestones(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Project milestones retrieved successfully",
    data: result,
  });
});

const updateProject = catchAsync(async (req: Request & { user?: any }, res: Response) => {
  const { id } = req.params;
  const result = await ProjectServices.updateProject(id, req.body, req.user.id || req.user._id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Project updated successfully",
    data: result,
  });
});

const deleteProject = catchAsync(async (req: Request & { user?: any }, res: Response) => {
  const { id } = req.params;
  const result = await ProjectServices.deleteProject(id, req.user.id || req.user._id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Project deleted successfully",
    data: result,
  });
});

const getDashboard = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await ProjectServices.getDashboard(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Project dashboard retrieved successfully",
    data: result,
  });
});

const addMilestone = catchAsync(async (req: Request & { user?: any }, res: Response) => {
  const { id } = req.params;
  const result = await ProjectServices.addMilestone(id, req.body, req.user.id || req.user._id);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Milestone added successfully",
    data: result,
  });
});

const getUserMilestones = catchAsync(async (req: Request & { user?: any }, res: Response) => {
  const userId = req.user?.id || req.user?._id;
  // Extract query parameters
  const { limit = 10, page = 1, completed } = req.query;

  // Build filters object
  const filters: any = {};
  if (completed !== undefined) filters.completed = completed === "true";

  const result = await ProjectServices.getUserMilestones(
    userId,
    filters,
    parseInt(limit as string),
    parseInt(page as string),
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User milestones retrieved successfully",
    data: result,
  });
});

const bulkUpdateMilestones = catchAsync(async (req: Request & { user?: any }, res: Response) => {
  const { updates } = req.body;
  const userId = req.user?.id || req.user?._id;

  const result = await ProjectServices.bulkUpdateMilestones(updates, userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Milestones updated successfully",
    data: result,
  });
});

const searchProjects = catchAsync(async (req: Request, res: Response) => {
  // Extract query parameters
  const { q: searchTerm, limit = 10, page = 1, ownerId, status } = req.query;

  // Build filters object
  const filters: any = {};
  if (ownerId) filters.ownerId = ownerId as string;
  if (status) filters.status = status as string;

  const result = await ProjectServices.searchProjects(
    (searchTerm as string) || "",
    filters,
    parseInt(limit as string),
    parseInt(page as string),
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Projects searched successfully",
    data: result,
  });
});

/**
 * Place a bid on a project
 */
const placeBid = catchAsync(async (req: CustomRequest, res: Response) => {
  const { id: projectId } = req.params;
  const freelancerId = req.user?.id || req.user?._id || req.user?._doc?._id;

  // Validate freelancer ID
  if (!freelancerId) {
    return sendResponse(res, {
      statusCode: 401,
      success: false,
      message: "Unauthorized: Freelancer ID not found",
      data: null,
    });
  }

  // Validate request body
  const validationResult = placeBidSchema.safeParse(req.body);
  if (!validationResult.success) {
    return sendResponse(res, {
      statusCode: 400,
      success: false,
      message: "Validation Error",
      data: validationResult.error.flatten(),
    });
  }

  const result = await ProjectServices.placeBid(projectId, req.body.body, freelancerId);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Bid placed successfully",
    data: result,
  });
});

/**
 * Get all bids for a project
 */
const getProjectBids = catchAsync(async (req: Request, res: Response) => {
  const { id: projectId } = req.params;
  const result = await ProjectServices.getProjectBids(projectId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Project bids retrieved successfully",
    data: result,
  });
});

/**
 * Accept a bid and assign freelancer to project
 */
const acceptBid = catchAsync(async (req: CustomRequest, res: Response) => {
  const { id: projectId, bidId } = req.params;
  const ownerId = req.user?.id || req.user?._id || req.user?._doc?._id;

  // Validate owner ID
  if (!ownerId) {
    return sendResponse(res, {
      statusCode: 401,
      success: false,
      message: "Unauthorized: Owner ID not found",
      data: null,
    });
  }

  // Validate request body
  const validationResult = updateBidSchema.safeParse(req.body);
  if (!validationResult.success) {
    return sendResponse(res, {
      statusCode: 400,
      success: false,
      message: "Validation Error",
      data: validationResult.error.flatten(),
    });
  }

  const result = await ProjectServices.acceptBid(projectId, bidId, ownerId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Bid accepted successfully",
    data: result,
  });
});

/**
 * Get freelancer's bids
 */
const getFreelancerBids = catchAsync(async (req: CustomRequest, res: Response) => {
  const freelancerId = req.user?.id || req.user?._id || req.user?._doc?._id;

  // Validate freelancer ID
  if (!freelancerId) {
    return sendResponse(res, {
      statusCode: 401,
      success: false,
      message: "Unauthorized: Freelancer ID not found",
      data: null,
    });
  }

  const result = await ProjectServices.getFreelancerBids(freelancerId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Freelancer bids retrieved successfully",
    data: result,
  });
});

/**
 * Approve a project (change status from pending to in_progress)
 */
const approveProject = catchAsync(async (req: Request & { user?: any }, res: Response) => {
  const { id } = req.params;
  const result = await ProjectServices.approveProject(id, req.user.id || req.user._id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Project approved successfully",
    data: result,
  });
});

export const ProjectControllers = {
  createProject,
  getAllProjects,
  searchProjects,
  getProjectById,
  getProjectMilestones,
  getUserMilestones,
  updateProject,
  deleteProject,
  getDashboard,
  addMilestone,
  bulkUpdateMilestones,
  placeBid,
  getProjectBids,
  acceptBid,
  getFreelancerBids,
  approveProject,
};
