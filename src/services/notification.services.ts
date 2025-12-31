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

const populateFields = [
  { path: "userId", select: "name email avatar" },
  { path: "senderId", select: "name email avatar" },
  { path: "projectId", select: "title" },
  { path: "taskId", select: "title" },
  { path: "milestoneId", select: "title" },
];

const createNotification = async (payload: CreateNotificationPayload) => {
  const user = await User.findById(payload.userId);
  if (!user) throw new ApiError(404, "User not found");

  if (payload.senderId) {
    const sender = await User.findById(payload.senderId);
    if (!sender) throw new ApiError(404, "Sender not found");
  }

  return (await Notification.create(payload)).toObject();
};

const getNotificationById = async (notificationId: string) => {
  const notification = await Notification.findById(notificationId).populate(populateFields);

  if (!notification) throw new ApiError(404, "Notification not found");

  return notification.toObject();
};

const getUserNotifications = async (userId: string, limit = 10, page = 1) => {
  const skip = (page - 1) * limit;

  const notifications = await Notification.find({ userId })
    .populate(populateFields.slice(1)) 
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip)
    .lean();

  const total = await Notification.countDocuments({ userId });
  const totalPages = Math.ceil(total / limit);

  return {
    notifications: notifications.map((n) => ({
      id: n._id,
      ...n,
    })),
    pagination: {
      currentPage: page,
      totalPages,
      totalNotifications: total,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    },
  };
};

const markNotificationAsRead = async (notificationId: string, userId: string) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: notificationId, userId },
    { $set: { isRead: true, readAt: new Date() } },
    { new: true },
  );

  if (!notification) {
    throw new ApiError(404, "Notification not found or permission denied");
  }

  return notification.toObject();
};

const markAllNotificationsAsRead = async (userId: string) => {
  const result = await Notification.updateMany(
    { userId, isRead: false },
    { $set: { isRead: true, readAt: new Date() } },
  );

  return {
    message: `${result.modifiedCount} notifications marked as read`,
    modifiedCount: result.modifiedCount,
  };
};

const deleteNotification = async (notificationId: string, userId: string) => {
  const notification = await Notification.findOneAndDelete({ _id: notificationId, userId });

  if (!notification) {
    throw new ApiError(404, "Notification not found or permission denied");
  }

  return { message: "Notification deleted successfully" };
};

const getUnreadNotificationsCount = async (userId: string) => {
  const unreadCount = await Notification.countDocuments({ userId, isRead: false });
  return { unreadCount };
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
