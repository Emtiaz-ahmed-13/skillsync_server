import express from "express";
import { MilestoneControllers } from "../controllers/milestone.controllers";
import auth from "../middlewares/auth";
import validateRequest from "../middlewares/validateRequest";
import { updateMilestoneSchema } from "../validations/project.validation";

const router = express.Router();

// GET /milestones/:id - Get specific milestone
router.get("/:id", MilestoneControllers.getMilestoneById);

// PUT /milestones/:id/complete - Mark milestone as complete
router.put("/:id/complete", auth(), MilestoneControllers.completeMilestone);

// PUT /milestones/:id - Update milestone
router.put(
  "/:id",
  auth(),
  validateRequest(updateMilestoneSchema),
  MilestoneControllers.updateMilestone,
);

// DELETE /milestones/:id - Delete milestone
router.delete("/:id", auth(), MilestoneControllers.deleteMilestone);

export const milestoneRoutes = router;
