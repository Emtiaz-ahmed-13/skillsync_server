"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-unused-vars */
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const globalErrorHandler_1 = __importDefault(require("./middlewares/globalErrorHandler"));
// Import route modules
const admin_routes_1 = require("./routes/admin.routes");
const aiSprintDistribution_routes_1 = require("./routes/aiSprintDistribution.routes");
const article_routes_1 = require("./routes/article.routes");
const auth_routes_1 = require("./routes/auth.routes");
const bid_routes_1 = require("./routes/bid.routes");
const file_routes_1 = require("./routes/file.routes");
const milestone_routes_1 = require("./routes/milestone.routes");
const notification_routes_1 = require("./routes/notification.routes");
const payment_routes_1 = require("./routes/payment.routes");
const profile_routes_1 = require("./routes/profile.routes");
const project_routes_1 = require("./routes/project.routes");
const review_routes_1 = require("./routes/review.routes");
const sprint_routes_1 = require("./routes/sprint.routes");
const sprintPlanning_routes_1 = require("./routes/sprintPlanning.routes");
const task_routes_1 = require("./routes/task.routes");
const timeTracking_routes_1 = require("./routes/timeTracking.routes");
const workSubmission_routes_1 = require("./routes/workSubmission.routes");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json({ limit: "50mb" }));
app.use(express_1.default.urlencoded({ extended: true, limit: "50mb" }));
app.use("/uploads", express_1.default.static(path_1.default.join(__dirname, "../uploads")));
app.get("/", (_req, res) => {
    res.status(200).json({
        success: true,
        message: "✅ SkillSync Backend is running successfully 🏃🏻‍♂️‍➡️",
        timestamp: new Date().toISOString(),
        version: "1.0.0",
    });
});
app.get("/api/v1", (_req, res) => {
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
            aiSprintDistribution: "/api/v1/ai-sprint-distribution",
        },
    });
});
app.get("/health", (_req, res) => {
    res.status(200).json({
        success: true,
        message: "SkillSync Server is running",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || "development",
    });
});
app.use("/api/v1/auth", auth_routes_1.authRoutes);
app.use("/api/v1/profile", profile_routes_1.profileRoutes);
app.use("/api/v1/articles", article_routes_1.articleRoutes);
app.use("/api/v1/projects", project_routes_1.projectRoutes);
app.use("/api/v1/bids", bid_routes_1.bidRoutes);
app.use("/api/v1/milestones", milestone_routes_1.milestoneRoutes);
app.use("/api/v1/sprints", sprint_routes_1.sprintRoutes);
app.use("/api/v1/sprint-planning", sprintPlanning_routes_1.sprintPlanningRoutes);
app.use("/api/v1/tasks", task_routes_1.taskRoutes);
app.use("/api/v1/time-tracking", timeTracking_routes_1.timeTrackingRoutes);
app.use("/api/v1/files", file_routes_1.fileRoutes);
app.use("/api/v1/work-submissions", workSubmission_routes_1.workSubmissionRoutes);
app.use("/api/v1/reviews", review_routes_1.reviewRoutes);
app.use("/api/v1/notifications", notification_routes_1.notificationRoutes);
app.use("/api/v1/payments", payment_routes_1.paymentRoutes);
app.use("/api/v1/ai-sprint-distribution", aiSprintDistribution_routes_1.aiSprintDistributionRoutes);
app.use("/api/v1/admin", admin_routes_1.adminRoutes);
app.use(globalErrorHandler_1.default);
app.use((req, res) => {
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
exports.default = app;
