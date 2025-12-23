import express from "express";
import { ProjectControllers } from "../controllers/project.controllers";
import auth from "../middlewares/auth";
import validateRequest from "../middlewares/validateRequest";
import {
  approveProjectSchema,
  createProjectSchema,
  projectIdSchema,
  updateProjectSchema,
} from "../validations/project.validation";

const router = express.Router();

// POST /projects - Create a new project
router.post("/", validateRequest(createProjectSchema), ProjectControllers.createProject);

// GET /projects - Get all projects
router.get("/", ProjectControllers.getAllProjects);

// GET /projects/approved - Get approved projects
router.get("/approved", ProjectControllers.getApprovedProjects);

// GET /projects/pending - Get pending projects (Admin only)
router.get("/pending", auth("admin"), ProjectControllers.getPendingProjects);

// GET /projects/owner/:ownerId - Get projects by owner ID
router.get("/owner/:ownerId", ProjectControllers.getProjectsByOwnerId);

// GET /projects/:id - Get project by ID
router.get("/:id", validateRequest(projectIdSchema), ProjectControllers.getProjectById);

// PUT /projects/:id - Update project by ID
router.put(
  "/:id",
  validateRequest(projectIdSchema),
  validateRequest(updateProjectSchema),
  ProjectControllers.updateProject,
);

// PUT /projects/:id/approve - Approve or reject project (Admin only)
router.put(
  "/:id/approve",
  auth("admin"),
  validateRequest(projectIdSchema),
  validateRequest(approveProjectSchema),
  ProjectControllers.approveProject,
);

// DELETE /projects/:id - Delete project by ID
router.delete("/:id", validateRequest(projectIdSchema), ProjectControllers.deleteProject);

export const projectRoutes = router;
