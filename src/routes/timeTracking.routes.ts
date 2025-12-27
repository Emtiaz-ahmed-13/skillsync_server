import express from "express";
import { TimeTrackingControllers } from "../controllers/timeTracking.controllers";
import auth from "../middlewares/auth";
import validateRequest from "../middlewares/validateRequest";
import {
  createTimeTrackingSchema,
  updateTimeTrackingSchema,
} from "../validations/timeTracking.validation";

const router = express.Router();

router.post(
  "/",
  auth(),
  validateRequest(createTimeTrackingSchema),
  TimeTrackingControllers.createTimeTracking,
);

router.get("/:id", auth(), TimeTrackingControllers.getTimeTrackingById);

router.get("/", auth(), TimeTrackingControllers.getUserTimeTracking);

router.put(
  "/:id",
  auth(),
  validateRequest(updateTimeTrackingSchema),
  TimeTrackingControllers.updateTimeTracking,
);

router.delete("/:id", auth(), TimeTrackingControllers.deleteTimeTracking);

export const timeTrackingRoutes = router;
