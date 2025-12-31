/* eslint-disable @typescript-eslint/no-unused-vars */
import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application, Request, Response } from "express";
import path from "path";
import globalErrorHandler from "./middlewares/globalErrorHandler";

// Import route modules
import { adminRoutes } from "./routes/admin.routes";

import { articleRoutes } from "./routes/article.routes";
import { authRoutes } from "./routes/auth.routes";
import { bidRoutes } from "./routes/bid.routes";
import { chatRoutes } from "./routes/chat.routes";
import { fileRoutes } from "./routes/file.routes";
import { milestoneRoutes } from "./routes/milestone.routes";
import { notificationRoutes } from "./routes/notification.routes";
import { paymentRoutes } from "./routes/payment.routes";
import { profileRoutes } from "./routes/profile.routes";
import { projectRoutes } from "./routes/project.routes";
import { reviewRoutes } from "./routes/review.routes";
import { sprintRoutes } from "./routes/sprint.routes";
import { sprintPlanningRoutes } from "./routes/sprintPlanning.routes";
import { taskRoutes } from "./routes/task.routes";
import { timeTrackingRoutes } from "./routes/timeTracking.routes";
import { workSubmissionRoutes } from "./routes/workSubmission.routes";

const app: Application = express();
app.use(cors({
  origin: [
    "http://localhost:3000",
    "https://skillsync-client.vercel.app",
    process.env.CLIENT_URL || ""
  ].filter(Boolean),
  credentials: true,
}));
app.use(cookieParser());

import session from "express-session";

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: false,
  })
);

app.get("/", (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "✅ SkillSync Backend is running successfully 🏃🏻‍♂️‍➡️",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  });
});
app.get("/api/v1", (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "SkillSync API v1 - Available endpoints",
    version: "1.0.0",
    endpoints: {
      articles: "/api/v1/articles",
      auth: "/api/v1/auth",
      bids: "/api/v1/bids",
      files: "/api/v1/files",
      profile: "/api/v1/profile",
      projects: "/api/v1/projects",
      milestones: "/api/v1/milestones",
      sprintPlanning: "/api/v1/sprint-planning",
      sprints: "/api/v1/sprints",
      tasks: "/api/v1/tasks",
      timeTracking: "/api/v1/time-tracking",
      reviews: "/api/v1/reviews",
      notifications: "/api/v1/notifications",
      payments: "/api/v1/payments",
      admin: "/api/v1/admin",
      workSubmissions: "/api/v1/work-submissions",
      chat: "/api/v1/chat",
    },
  });
});
app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "SkillSync Server is running",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
  });
});
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/articles", articleRoutes);
app.use("/api/v1/projects", projectRoutes);
app.use("/api/v1/bids", bidRoutes);
app.use("/api/v1/milestones", milestoneRoutes);
app.use("/api/v1/sprints", sprintRoutes);
app.use("/api/v1/sprint-planning", sprintPlanningRoutes);
app.use("/api/v1/tasks", taskRoutes);
app.use("/api/v1/time-tracking", timeTrackingRoutes);
app.use("/api/v1/files", fileRoutes);
app.use("/api/v1/work-submissions", workSubmissionRoutes);
app.use("/api/v1/reviews", reviewRoutes);
app.use("/api/v1/notifications", notificationRoutes);
app.use("/api/v1/payments", paymentRoutes);
app.use("/api/v1/chat", chatRoutes);

app.use("/api/v1/admin", adminRoutes);

app.use(globalErrorHandler);

app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "API Endpoint Not Found",
    error: {
      path: req.originalUrl,
      method: req.method,
      message: "The requested endpoint does not exist",
    },
  });
});

export default app;
