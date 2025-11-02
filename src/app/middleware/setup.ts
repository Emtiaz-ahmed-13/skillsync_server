import cors from "cors";
import express, { Application } from "express";

/**
 * Setup application-level middleware
 * @param app Express application instance
 */
export const setupMiddlewares = (app: Application): void => {
  // Parse JSON bodies
  app.use(express.json({ limit: "10mb" }));

  // Parse URL-encoded bodies
  app.use(express.urlencoded({ extended: true, limit: "10mb" }));

  // Enable CORS
  app.use(cors());
};
