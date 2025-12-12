import { Request, Response } from "express";
import { NotificationServices } from "../services/notification.services";
import catchAsync from "../utils/catchAsync";
import sendResponse from "../utils/sendResponse";

const getNotifications = catchAsync(async (req: Request & { user?: any }, res: Response) => {
  const userId = req.user?.id || req.user?._id;
  const { limit = 10, page = 1 } = req.query;

  const result = await NotificationServices.getUserNotifications(
    userId,
    parseInt(limit as string),
    parseInt(page as string),
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Notifications retrieved successfully",
    data: result,
  });
});

const getNotificationById = catchAsync(async (req: Request & { user?: any }, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.id || req.user?._id;

  const result = await NotificationServices.getNotificationById(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Notification retrieved successfully",
    data: result,
  });
});

const markAsRead = catchAsync(async (req: Request & { user?: any }, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.id || req.user?._id;

  const result = await NotificationServices.markNotificationAsRead(id, userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Notification marked as read",
    data: result,
  });
});

const markAllAsRead = catchAsync(async (req: Request & { user?: any }, res: Response) => {
  const userId = req.user?.id || req.user?._id;

  const result = await NotificationServices.markAllNotificationsAsRead(userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "All notifications marked as read",
    data: result,
  });
});

const deleteNotification = catchAsync(async (req: Request & { user?: any }, res: Response) => {
  const { id } = req.params;
  const userId = req.user?.id || req.user?._id;

  const result = await NotificationServices.deleteNotification(id, userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Notification deleted successfully",
    data: result,
  });
});

const getUnreadCount = catchAsync(async (req: Request & { user?: any }, res: Response) => {
  const userId = req.user?.id || req.user?._id;

  const result = await NotificationServices.getUnreadNotificationsCount(userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Unread notifications count retrieved successfully",
    data: result,
  });
});

export const NotificationControllers = {
  getNotifications,
  getNotificationById,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  getUnreadCount,
};
