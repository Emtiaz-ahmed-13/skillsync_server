import { Request, Response } from "express";
import { PaymentServices } from "../services/payment.services";
import catchAsync from "../utils/catchAsync";
import sendResponse from "../utils/sendResponse";

const createPayment = catchAsync(async (req: Request & { user?: any }, res: Response) => {
  const result = await PaymentServices.createPayment({
    ...req.body,
    clientId: req.user?.id || req.user?._id,
  });

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Payment created successfully",
    data: result,
  });
});

const getPaymentById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await PaymentServices.getPaymentById(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Payment retrieved successfully",
    data: result,
  });
});

const getUserPayments = catchAsync(async (req: Request & { user?: any }, res: Response) => {
  const userId = req.user?.id || req.user?._id;
  const userRole = req.user?.role;
  const { limit = 10, page = 1 } = req.query;

  const result = await PaymentServices.getUserPayments(
    userId,
    userRole,
    parseInt(limit as string),
    parseInt(page as string),
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User payments retrieved successfully",
    data: result,
  });
});

const updatePayment = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await PaymentServices.updatePayment(id, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Payment updated successfully",
    data: result,
  });
});

const deletePayment = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await PaymentServices.deletePayment(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Payment deleted successfully",
    data: result,
  });
});

const getProjectPayments = catchAsync(async (req: Request, res: Response) => {
  const { projectId } = req.params;
  const result = await PaymentServices.getProjectPayments(projectId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Project payments retrieved successfully",
    data: result,
  });
});

export const PaymentControllers = {
  createPayment,
  getPaymentById,
  getUserPayments,
  updatePayment,
  deletePayment,
  getProjectPayments,
};
