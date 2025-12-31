import express from "express";
import { SprintPlanningControllers } from "../controllers/sprintPlanning.controllers";
import auth from "../middlewares/auth";
import validateRequest from "../middlewares/validateRequest";
import { generateSprintPlanSchema } from "../validations/sprintPlanning.validation";

const router = express.Router();

router.post("/generate/:projectId",auth(),validateRequest(generateSprintPlanSchema),
SprintPlanningControllers.generateAndCreateSprintPlan,
);

router.get("/:projectId", auth(), SprintPlanningControllers.getSprintPlan);

export const sprintPlanningRoutes = router;
