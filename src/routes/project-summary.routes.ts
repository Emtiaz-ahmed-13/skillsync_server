import express from "express";
import { ProjectSummaryController } from "../controllers/project-summary.controllers";
import auth from "../middlewares/auth";

const router = express.Router();

/**
 * POST /api/v1/projects/:projectId/generate-summary
 * Generate AI-powered project summary
 * Requires authentication
 */
router.post(
    "/:projectId/generate-summary",
    auth(),
    ProjectSummaryController.generateSummary
);

/**
 * GET /api/v1/projects/:projectId/summary
 * Get existing project summary
 * Requires authentication
 */
router.get(
    "/:projectId/summary",
    auth(),
    ProjectSummaryController.getSummary
);

export const projectSummaryRoutes = router;
