import { Application, Request, Response } from "express";
import router from "./routes/index";

export const setupRoutes = (app: Application): void => {
  // Base route for API
  app.get("/api/v1/router", (req: Request, res: Response) => {
    res.status(200).json({
      success: true,
      message: "API Base Route - Available endpoints listed",
      endpoints: {
        auth: "/api/v1/auth",
        profile: "/api/v1/profile",
      },
    });
  });

  // Main API routes - this will delegate to index.ts
  app.use("/api/v1", router);

  // Health check endpoint
  app.get("/health", (_req: Request, res: Response) => {
    res.status(200).json({
      success: true,
      message: "Server is running",
      timestamp: new Date().toISOString(),
    });
  });
};
