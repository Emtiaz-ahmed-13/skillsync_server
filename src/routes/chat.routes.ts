import express from "express";
import auth from "../middlewares/auth";
import { Chat } from "../models/chat.model";
import { User } from "../models/user.model";
import catchAsync from "../utils/catchAsync";
import sendResponse from "../utils/sendResponse";

const router = express.Router();
router.get("/history/:userId", auth(), catchAsync(async (req, res) => {
  const currentUserId = (req as any).user._id || (req as any).user.id;
  const otherUserId = req.params.userId;

  const messages = await Chat.find({
    $or: [
      { senderId: currentUserId, receiverId: otherUserId },
      { senderId: otherUserId, receiverId: currentUserId },
    ],
  })
    .sort({ createdAt: 1 })
    .populate("senderId", "name email avatar")
    .populate("receiverId", "name email avatar");

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Chat history retrieved successfully",
    data: messages,
  });
}));

router.get("/conversations", auth(), catchAsync(async (req, res) => {
  const currentUserId = (req as any).user._id || (req as any).user.id;
  const sentMessages = await Chat.distinct("receiverId", { senderId: currentUserId });
  const receivedMessages = await Chat.distinct("senderId", { receiverId: currentUserId });

  const uniqueUserIds = [...new Set([...sentMessages, ...receivedMessages])];
  const conversations = await User.find({
    _id: { $in: uniqueUserIds },
  }).select("name email avatar role");

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Conversations retrieved successfully",
    data: conversations,
  });
}));

export const chatRoutes = router;
