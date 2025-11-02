import express, { Application } from "express";
import { errorHandler } from "./app/middleware/errorHandler";
import { setupMiddlewares } from "./app/middleware/setup";
import { setupRoutes } from "./app/routes";

const app: Application = express();

// Setup application-level middleware
setupMiddlewares(app);

// Setup routes
setupRoutes(app);

// Global error handler
app.use(errorHandler);

export default app;
