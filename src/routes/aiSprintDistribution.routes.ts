import express from "express";
import { AISprintDistributionControllers } from "../controllers/aiSprintDistribution.controllers";
import validateRequest from "../middlewares/validateRequest";
import {
  editFeatureSchema,
  generateSprintPlanSchema,
} from "../validations/aiSprintDistribution.validation";

const router = express.Router();

router.post(
  "/generate-sprint-plan/:projectId",
  validateRequest(generateSprintPlanSchema),
  AISprintDistributionControllers.generateSprintPlan,
);

router.patch(
  "/sprints/:sprintId/features/:featureId",
  validateRequest(editFeatureSchema),
  AISprintDistributionControllers.updateFeature,
);

router.post(
  "/generate-milestones/:projectId",
  validateRequest(generateSprintPlanSchema),
  AISprintDistributionControllers.generateMilestones,
);
router.patch("/complete-sprint/:sprintId", AISprintDistributionControllers.completeSprint);

export const aiSprintDistributionRoutes = router;
