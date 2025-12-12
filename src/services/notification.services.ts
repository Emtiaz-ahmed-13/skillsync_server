import { Notification } from "../models/notification.model";
import { User } from "../models/user.model";
import ApiError from "../utils/ApiError";

type CreateNotificationPayload = {
  userId: string;
  senderId?: string;
  type: string;
  title: string;
  message: string;
  projectId?: string;
  taskId?: string;
  milestoneId?: string;
  fileId?: string;
  reviewId?: string;
  metadata?: Record<string, any>;
};

const createNotification = async (payload: CreateNotificationPayload) => {
  // Verify user exists
  const user = await User.findById(payload.userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Verify sender exists (if provided)
  if (payload.senderId) {
    const sender = await User.findById(payload.senderId);
    if (!sender) {
      throw new ApiError(404, "Sender not found");
    }
  }

  const notification = await Notification.create(payload);

  const notificationObj = notification.toObject();
  return notificationObj;
};

const getNotificationById = async (notificationId: string) => {
  const notification = await Notification.findById(notificationId)
    .populate("userId", "name email avatar")
    .populate("senderId", "name email avatar")
    .populate("projectId", "title")
    .populate("taskId", "title")
    .populate("milestoneId", "title");

  if (!notification) {
    throw new ApiError(404, "Notification not found");
  }

  const notificationObj = notification.toObject();
  return notificationObj;
};

const getUserNotifications = async (userId: string, limit: number = 10, page: number = 1) => {
  const skip = (page - 1) * limit;

  const notifications = await Notification.find({ userId })
    .populate("senderId", "name email avatar")
    .populate("projectId", "title")
    .populate("taskId", "title")
    .populate("milestoneId", "title")
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip)
    .lean();

  const total = await Notification.countDocuments({ userId });

  return {
    notifications: notifications.map((notification) => ({
      id: notification._id || notification.id,
      userId: notification.userId,
      senderId: notification.senderId,
      type: notification.type,
      title: notification.title,
      message: notification.message,
      projectId: notification.projectId,
      taskId: notification.taskId,
      milestoneId: notification.milestoneId,
      fileId: notification.fileId,
      reviewId: notification.reviewId,
      isRead: notification.isRead,
      readAt: notification.readAt,
      metadata: notification.metadata,
      createdAt: notification.createdAt,
      updatedAt: notification.updatedAt,
    })),
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalNotifications: total,
      hasNextPage: page < Math.ceil(total / limit),
      hasPrevPage: page > 1,
    },
  };
};

const markNotificationAsRead = async (notificationId: string, userId: string) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: notificationId, userId },
    {
      $set: {
        isRead: true,
        readAt: new Date(),
      },
    },
    { new: true },
  );

  if (!notification) {
    throw new ApiError(404, "Notification not found or you don't have permission to update it");
  }

  const notificationObj = notification.toObject();
  return notificationObj;
};

const markAllNotificationsAsRead = async (userId: string) => {
  const result = await Notification.updateMany(
    { userId, isRead: false },
    {
      $set: {
        isRead: true,
        readAt: new Date(),
      },
    },
  );

  return {
    message: `${result.modifiedCount} notifications marked as read`,
    modifiedCount: result.modifiedCount,
  };
};

const deleteNotification = async (notificationId: string, userId: string) => {
  const notification = await Notification.findOneAndDelete({
    _id: notificationId,
    userId,
  });

  if (!notification) {
    throw new ApiError(404, "Notification not found or you don't have permission to delete it");
  }

  return { message: "Notification deleted successfully" };
};

const getUnreadNotificationsCount = async (userId: string) => {
  const count = await Notification.countDocuments({
    userId,
    isRead: false,
  });

  return { unreadCount: count };
};

export const NotificationServices = {
  createNotification,
  getNotificationById,
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  getUnreadNotificationsCount,
};
