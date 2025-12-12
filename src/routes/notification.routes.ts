import express from "express";
import { NotificationControllers } from "../controllers/notification.controllers";
import auth from "../middlewares/auth";

const router = express.Router();

// GET /notifications - Get user's notifications
router.get("/", auth(), NotificationControllers.getNotifications);

// GET /notifications/unread-count - Get unread notifications count
router.get("/unread-count", auth(), NotificationControllers.getUnreadCount);

// GET /notifications/:id - Get specific notification
router.get("/:id", auth(), NotificationControllers.getNotificationById);

// PUT /notifications/:id/read - Mark notification as read
router.put("/:id/read", auth(), NotificationControllers.markAsRead);

// PUT /notifications/read-all - Mark all notifications as read
router.put("/read-all", auth(), NotificationControllers.markAllAsRead);

// DELETE /notifications/:id - Delete a notification
router.delete("/:id", auth(), NotificationControllers.deleteNotification);

export const notificationRoutes = router;
