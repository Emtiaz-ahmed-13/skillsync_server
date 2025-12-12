import { Request, Response } from "express";
import { AdminServices } from "../services/admin.services";
import catchAsync from "../utils/catchAsync";
import sendResponse from "../utils/sendResponse";

const getDashboardAnalytics = catchAsync(async (req: Request, res: Response) => {
  const result = await AdminServices.getDashboardAnalytics();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Dashboard analytics retrieved successfully",
    data: result,
  });
});

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const { limit = 10, page = 1, role } = req.query;

  const result = await AdminServices.getAllUsers(
    parseInt(limit as string),
    parseInt(page as string),
    role as string,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Users retrieved successfully",
    data: result,
  });
});

const getUserById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await AdminServices.getUserById(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User retrieved successfully",
    data: result,
  });
});

const updateUserRole = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { role } = req.body;
  const result = await AdminServices.updateUserRole(id, role);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User role updated successfully",
    data: result,
  });
});

const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await AdminServices.deleteUser(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User deleted successfully",
    data: result,
  });
});

const getDisputes = catchAsync(async (req: Request, res: Response) => {
  const { limit = 10, page = 1 } = req.query;

  const result = await AdminServices.getDisputes(
    parseInt(limit as string),
    parseInt(page as string),
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Disputes retrieved successfully",
    data: result,
  });
});

const resolveDispute = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { resolution } = req.body;
  const result = await AdminServices.resolveDispute(id, resolution);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Dispute resolved successfully",
    data: result,
  });
});

export const AdminControllers = {
  getDashboardAnalytics,
  getAllUsers,
  getUserById,
  updateUserRole,
  deleteUser,
  getDisputes,
  resolveDispute,
};
