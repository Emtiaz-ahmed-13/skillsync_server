import express from "express";
import { SprintPlanningControllers } from "../controllers/sprintPlanning.controllers";
import auth from "../middlewares/auth";
import validateRequest from "../middlewares/validateRequest";
import { createSprintPlanSchema, generateSprintPlanSchema } from "../validations/sprintPlanning.validation";

const router = express.Router();

// POST /sprint-planning/generate/:projectId - Generate sprint plan (AI or manual)
router.post(
  "/generate/:projectId",
  auth(),
  validateRequest(generateSprintPlanSchema),
  SprintPlanningControllers.generateSprintPlan
);

// POST /sprint-planning/create/:projectId - Create sprint plan
router.post(
  "/create/:projectId",
  auth(),
  validateRequest(createSprintPlanSchema),
  SprintPlanningControllers.createSprintPlan
);

// GET /sprint-planning/:projectId - Get existing sprint plan
router.get(
  "/:projectId",
  auth(),
  SprintPlanningControllers.getSprintPlan
);

export const sprintPlanningRoutes = router;