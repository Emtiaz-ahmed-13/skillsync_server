import { Application, Request, Response } from "express";
import { authRoutes } from "../routes/v1/auth.routes";

/**
 * Setup application routes
 * @param app Express application instance
 */
export const setupRoutes = (app: Application): void => {
  // API Routes
  app.use("/api/v1/auth", authRoutes);

  // Health check endpoint
  app.get("/health", (req: Request, res: Response) => {
    res.status(200).json({
      success: true,
      message: "Server is running",
      timestamp: new Date().toISOString(),
    });
  });

  // Home route
  app.get("/", (req: Request, res: Response) => {
    res.send("Hello World!");
  });

  // 404 handler for unmatched routes
  app.use((req: Request, res: Response) => {
    res.status(404).json({
      success: false,
      message: `Route ${req.originalUrl} not found`,
      status: 404,
    });
  });
};
