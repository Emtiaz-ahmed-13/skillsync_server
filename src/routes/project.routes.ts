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

router.post("/", auth(), validateRequest(createProjectSchema), ProjectControllers.createProject);

router.get("/", ProjectControllers.getAllProjects);
router.get("/approved", ProjectControllers.getApprovedProjects);
router.get("/pending", auth("admin"), ProjectControllers.getPendingProjects);
router.get("/owner/:ownerId", ProjectControllers.getProjectsByOwnerId);
router.get("/:id", validateRequest(projectIdSchema), ProjectControllers.getProjectById);
router.put(
  "/:id",
  auth(),
  validateRequest(projectIdSchema),
  validateRequest(updateProjectSchema),
  ProjectControllers.updateProject,
);
router.put(
  "/:id/approve",
  auth("admin"),
  validateRequest(projectIdSchema),
  validateRequest(approveProjectSchema),
  ProjectControllers.approveProject,
);
router.delete("/:id", auth(), validateRequest(projectIdSchema), ProjectControllers.deleteProject);

export const projectRoutes = router;
