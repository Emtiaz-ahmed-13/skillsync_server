"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable @typescript-eslint/no-unused-vars */
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const globalErrorHandler_1 = __importDefault(require("./app/middleware/globalErrorHandler"));
const index_1 = __importDefault(require("./app/routes/index"));
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
// Main API routes
app.use("/api/v1", index_1.default);
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
