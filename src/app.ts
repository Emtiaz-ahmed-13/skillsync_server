/* eslint-disable @typescript-eslint/no-unused-vars */
import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application, Request, Response } from "express";
import { setupRoutes } from "./app/routes";
import globalErrorHandler from "./middlewares/globalErrorHandler";

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

// Use the setupRoutes function from routes.ts
setupRoutes(app);

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
