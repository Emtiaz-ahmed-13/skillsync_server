import express from "express";
import { SprintPlanningControllers } from "../controllers/sprintPlanning.controllers";
import auth from "../middlewares/auth";
import validateRequest from "../middlewares/validateRequest";
import {
  createSprintPlanSchema,
  generateSprintPlanSchema,
} from "../validations/sprintPlanning.validation";

const router = express.Router();

router.post(
  "/generate/:projectId",
  auth(),
  validateRequest(generateSprintPlanSchema),
  SprintPlanningControllers.generateSprintPlan,
);
router.post(
  "/create/:projectId",
  auth(),
  validateRequest(createSprintPlanSchema),
  SprintPlanningControllers.createSprintPlan,
);
router.get("/:projectId", auth(), SprintPlanningControllers.getSprintPlan);

export const sprintPlanningRoutes = router;
