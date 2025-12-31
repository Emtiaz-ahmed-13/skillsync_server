import express from "express";
import { NotificationControllers } from "../controllers/notification.controllers";
import auth from "../middlewares/auth";

const router = express.Router();

router.post("/", auth(), NotificationControllers.createNotification);
router.get("/", auth(), NotificationControllers.getNotifications);
router.get("/unread-count", auth(), NotificationControllers.getUnreadCount);
router.get("/:id", auth(), NotificationControllers.getNotificationById);
router.put("/:id/read", auth(), NotificationControllers.markAsRead);
router.put("/read-all", auth(), NotificationControllers.markAllAsRead);
router.delete("/:id", auth(), NotificationControllers.deleteNotification);

export const notificationRoutes = router;
