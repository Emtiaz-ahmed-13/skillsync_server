import express from "express";
import { TimeTrackingControllers } from "../controllers/timeTracking.controllers";
import auth from "../middlewares/auth";
import validateRequest from "../middlewares/validateRequest";
import {
  createTimeTrackingSchema,
  updateTimeTrackingSchema,
} from "../validations/timeTracking.validation";

const router = express.Router();

// POST /time-tracking - Create a new time tracking record
router.post(
  "/",
  auth(),
  validateRequest(createTimeTrackingSchema),
  TimeTrackingControllers.createTimeTracking,
);

// GET /time-tracking/:id - Get specific time tracking record
router.get("/:id", auth(), TimeTrackingControllers.getTimeTrackingById);

// GET /time-tracking - Get user's time tracking records
router.get("/", auth(), TimeTrackingControllers.getUserTimeTracking);

// PUT /time-tracking/:id - Update a time tracking record
router.put(
  "/:id",
  auth(),
  validateRequest(updateTimeTrackingSchema),
  TimeTrackingControllers.updateTimeTracking,
);

// DELETE /time-tracking/:id - Delete a time tracking record
router.delete("/:id", auth(), TimeTrackingControllers.deleteTimeTracking);

export const timeTrackingRoutes = router;
