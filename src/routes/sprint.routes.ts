import express from "express";
import { SprintControllers } from "../controllers/sprint.controllers";
import auth from "../middlewares/auth";
import validateRequest from "../middlewares/validateRequest";
import { createSprintSchema, updateSprintSchema } from "../validations/sprint.validation";

const router = express.Router();

// POST /sprints - Create a new sprint
router.post(
  "/",
  auth(),
  validateRequest(createSprintSchema),
  SprintControllers.createSprint
);

// GET /sprints/project/:projectId - Get all sprints for a project
router.get(
  "/project/:projectId",
  auth(),
  SprintControllers.getSprintsByProject
);

// GET /sprints/:id - Get specific sprint
router.get(
  "/:id",
  auth(),
  SprintControllers.getSprintById
);

// PATCH /sprints/:id - Update a sprint
router.patch(
  "/:id",
  auth(),
  validateRequest(updateSprintSchema),
  SprintControllers.updateSprint
);

// DELETE /sprints/:id - Delete a sprint
router.delete(
  "/:id",
  auth(),
  SprintControllers.deleteSprint
);

export const sprintRoutes = router;