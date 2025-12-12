"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-unused-vars */
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const globalErrorHandler_1 = __importDefault(require("./middlewares/globalErrorHandler"));
// Import routes
const admin_routes_1 = require("./routes/admin.routes");
const auth_routes_1 = require("./routes/auth.routes");
const file_routes_1 = require("./routes/file.routes");
const milestone_routes_1 = require("./routes/milestone.routes");
const notification_routes_1 = require("./routes/notification.routes");
const payment_routes_1 = require("./routes/payment.routes");
const profile_routes_1 = require("./routes/profile.routes");
const project_routes_1 = require("./routes/project.routes");
const review_routes_1 = require("./routes/review.routes");
const task_routes_1 = require("./routes/task.routes");
const timeTracking_routes_1 = require("./routes/timeTracking.routes");
const app = (0, express_1.default)();
// Enable CORS
app.use((0, cors_1.default)());
// Cookie parser
app.use((0, cookie_parser_1.default)());
// Body parsers
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Health check route
app.get("/", (_req, res) => {
    res.status(200).json({
        message: "✅ Backend is running successfully 🏃🏻‍♂️‍➡️",
    });
});
// API routes
app.use("/api/v1/auth", auth_routes_1.authRoutes);
app.use("/api/v1/files", file_routes_1.fileRoutes);
app.use("/api/v1/profile", profile_routes_1.profileRoutes);
app.use("/api/v1/projects", project_routes_1.projectRoutes);
app.use("/api/v1/milestones", milestone_routes_1.milestoneRoutes);
app.use("/api/v1/tasks", task_routes_1.taskRoutes);
app.use("/api/v1/time-tracking", timeTracking_routes_1.timeTrackingRoutes);
app.use("/api/v1/reviews", review_routes_1.reviewRoutes);
app.use("/api/v1/notifications", notification_routes_1.notificationRoutes);
app.use("/api/v1/payments", payment_routes_1.paymentRoutes);
app.use("/api/v1/admin", admin_routes_1.adminRoutes);
// API Base Route
app.get("/api/v1", (req, res) => {
    res.status(200).json({
        success: true,
        message: "API Base Route - Available endpoints listed",
        endpoints: {
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
app.get("/health", (_req, res) => {
    res.status(200).json({
        success: true,
        message: "Server is running",
        timestamp: new Date().toISOString(),
    });
});
// Global error handler (should come after routes)
app.use(globalErrorHandler_1.default);
// 404 handler (last middleware)
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "API NOT FOUND!",
        error: {
            path: req.originalUrl,
            message: "Your requested path is not found!",
        },
    });
});
exports.default = app;
