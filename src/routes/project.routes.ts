import express from "express";
import { ProjectControllers } from "../controllers/project.controllers";
import auth from "../middlewares/auth";
import validateRequest from "../middlewares/validateRequest";
import {
  addMilestoneSchema,
  bulkUpdateMilestonesSchema,
  createProjectSchema,
  updateProjectSchema,
} from "../validations/project.validation";

const router = express.Router();

// GET /projects - Get all projects (public or authenticated)
router.get("/", ProjectControllers.getAllProjects);

// GET /projects/search - Search projects by title or description
router.get("/search", ProjectControllers.searchProjects);

// GET /projects/:id - Get specific project
router.get("/:id", ProjectControllers.getProjectById);

// GET /projects/:id/milestones - Get all milestones for a project
router.get("/:id/milestones", ProjectControllers.getProjectMilestones);

// GET /projects/milestones - Get all milestones for the authenticated user
router.get("/milestones", auth(), ProjectControllers.getUserMilestones);

// PUT /projects/milestones/bulk - Bulk update milestones
router.put(
  "/milestones/bulk",
  auth(),
  validateRequest(bulkUpdateMilestonesSchema),
  ProjectControllers.bulkUpdateMilestones,
);

// PUT /projects/:id - Update project
router.put("/:id", auth(), validateRequest(updateProjectSchema), ProjectControllers.updateProject);

// DELETE /projects/:id - Delete project
router.delete("/:id", auth(), ProjectControllers.deleteProject);

// POST /projects - Create project (ADMIN only)
router.post(
  "/",
  auth("admin"), // Simplified - using auth middleware with role check
  validateRequest(createProjectSchema),
  ProjectControllers.createProject,
);

// GET /projects/:id/dashboard - Get project dashboard
router.get("/:id/dashboard", auth(), ProjectControllers.getDashboard);

// POST /projects/:id/milestones - Add milestone to project
router.post(
  "/:id/milestones",
  auth(),
  validateRequest(addMilestoneSchema),
  ProjectControllers.addMilestone,
);

export const projectRoutes = router;
