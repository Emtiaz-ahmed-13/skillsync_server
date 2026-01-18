import express from "express";
import { MilestoneControllers } from "../controllers/milestone.controllers";
import auth from "../middlewares/auth";

const router = express.Router();

router.get("/:id", MilestoneControllers.getMilestoneById);
router.put("/:id/complete", auth(), MilestoneControllers.completeMilestone);
router.put("/:id/approve", auth("client"), MilestoneControllers.approveMilestone);
router.delete("/:id", auth(), MilestoneControllers.deleteMilestone);

export const milestoneRoutes = router;
