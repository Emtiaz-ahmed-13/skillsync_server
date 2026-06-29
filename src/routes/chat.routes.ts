import express from "express";
import auth from "../middlewares/auth";
import { Chat } from "../models/chat.model";
import { User } from "../models/user.model";
import catchAsync from "../utils/catchAsync";
import sendResponse from "../utils/sendResponse";

const router = express.Router();

router.get(
  "/history/:userId",
  auth(),
  catchAsync(async (req, res) => {
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
  }),
);

router.get(
  "/conversations",
  auth(),
  catchAsync(async (req, res) => {
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
  }),
);

router.post(
  "/messages",
  auth(),
  catchAsync(async (req, res) => {
    const senderId = (req as any).user._id || (req as any).user.id;
    const { receiverId, message, attachmentUrl } = req.body;

    if (!receiverId || (!message?.trim() && !attachmentUrl)) {
      return sendResponse(res, {
        statusCode: 400,
        success: false,
        message: "receiverId and message or attachment required",
        data: null,
      });
    }

    const chatMessage = await Chat.create({
      senderId,
      receiverId,
      message: message?.trim() || (attachmentUrl ? "Attachment" : ""),
      attachmentUrl,
    });

    const populated = await Chat.findById(chatMessage._id)
      .populate("senderId", "name email avatar")
      .populate("receiverId", "name email avatar");

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Message sent",
      data: populated,
    });
  }),
);

export const chatRoutes = router;
