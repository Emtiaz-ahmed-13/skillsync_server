import { Server as HttpServer } from "http";
import jwt from "jsonwebtoken";
import { Server, Socket } from "socket.io";
import config from "../config";
import { Chat } from "../models/chat.model";
import { User } from "../models/user.model";

interface AuthSocket extends Socket {
  user?: any;
}

let io: Server;

export const initializeSocket = (httpServer: HttpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });
  io.use(async (socket: AuthSocket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(" ")[1];

      if (!token) {
        return next(new Error("Authentication error"));
      }

      const decoded = jwt.verify(token, config.jwt.jwt_secret as string) as any;
      const user = await User.findById(decoded.id || decoded._id);

      if (!user) {
        return next(new Error("User not found"));
      }

      socket.user = user;
      next();
    } catch (err) {
      next(new Error("Authentication error"));
    }
  });

  io.on("connection", (socket: AuthSocket) => {
    console.log(`User connected: ${socket.user?.email} (${socket.id})`);

    socket.join(socket.user?._id.toString());
    io.emit("user_online", { userId: socket.user?._id.toString() });
    socket.on("send_message", async (data) => {
      try {
        const { receiverId, message } = data;
        const newChat = await Chat.create({
          senderId: socket.user?._id,
          receiverId,
          message,
        });
        const populatedChat = await newChat.populate("senderId", "name email avatar");
        io.to(receiverId).emit("receive_message", populatedChat);
        socket.emit("message_sent", populatedChat);

      } catch (error) {
        console.error("Error sending message:", error);
        socket.emit("error", { message: "Failed to send message" });
      }
    });
    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.user?.email);
      io.emit("user_offline", { userId: socket.user?._id.toString() });
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};

export const emitToUser = (userId: string, event: string, data: any) => {
  if (!io) {
    console.error("Socket.io not initialized!");
    return;
  }
  io.to(userId).emit(event, data);
};

export const SocketServices = {
  initializeSocket,
  getIO,
  emitToUser,
};

