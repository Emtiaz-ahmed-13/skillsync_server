/* eslint-disable @typescript-eslint/no-unused-vars */
import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application, Request, Response } from "express";
import globalErrorHandler from "./middlewares/globalErrorHandler";

// Import routes
import { adminRoutes } from "./routes/admin.routes";
import { articleRoutes } from "./routes/article.routes";
import { authRoutes } from "./routes/auth.routes";
import { fileRoutes } from "./routes/file.routes";
import { milestoneRoutes } from "./routes/milestone.routes";
import { notificationRoutes } from "./routes/notification.routes";
import { paymentRoutes } from "./routes/payment.routes";
import { profileRoutes } from "./routes/profile.routes";
import { projectRoutes } from "./routes/project.routes";
import { reviewRoutes } from "./routes/review.routes";
import { taskRoutes } from "./routes/task.routes";
import { timeTrackingRoutes } from "./routes/timeTracking.routes";

const app: Application = express();

// Enable CORS
app.use(cors());

// Cookie parser
app.use(cookieParser());

// Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check route
app.get("/", (_req: Request, res: Response) => {
  res.status(200).json({
    message: "✅ Backend is running successfully 🏃🏻‍♂️‍➡️",
  });
});

// API routes
app.use("/api/v1/articles", articleRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/files", fileRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/projects", projectRoutes);
app.use("/api/v1/milestones", milestoneRoutes);
app.use("/api/v1/tasks", taskRoutes);
app.use("/api/v1/time-tracking", timeTrackingRoutes);
app.use("/api/v1/reviews", reviewRoutes);
app.use("/api/v1/notifications", notificationRoutes);
app.use("/api/v1/payments", paymentRoutes);
app.use("/api/v1/admin", adminRoutes);

// API Base Route
app.get("/api/v1", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "API Base Route - Available endpoints listed",
    endpoints: {
      articles: "/api/v1/articles",
      auth: "/api/v1/auth",
      files: "/api/v1/files",
      profile: "/api/v1/profile",
      projects: "/api/v1/projects",
      milestones: "/api/v1/milestones",
      tasks: "/api/v1/tasks",
      timeTracking: "/api/v1/time-tracking",
      reviews: "/api/v1/reviews",
      notifications: "/api/v1/notifications",
      payments: "/api/v1/payments",
      admin: "/api/v1/admin",
    },
  });
});

// Health check endpoint
app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Server is running",
    timestamp: new Date().toISOString(),
  });
});

// Global error handler (should come after routes)
app.use(globalErrorHandler);

// 404 handler (last middleware)
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "API NOT FOUND!",
    error: {
      path: req.originalUrl,
      message: "Your requested path is not found!",
    },
  });
});

export default app;
