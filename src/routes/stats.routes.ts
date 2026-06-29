import express from "express";
import { StatsServices } from "../services/stats.services";
import catchAsync from "../utils/catchAsync";
import sendResponse from "../utils/sendResponse";

const router = express.Router();

router.get(
  "/public",
  catchAsync(async (_req, res) => {
    const stats = await StatsServices.getPublicStats();
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Public stats retrieved",
      data: stats,
    });
  }),
);

export const statsRoutes = router;
