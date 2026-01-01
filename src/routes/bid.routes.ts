import express from "express";
import { BidControllers } from "../controllers/bid.controllers";
import auth from "../middlewares/auth";
import { uploadSingle } from "../middlewares/upload.middleware";
import validateRequest from "../middlewares/validateRequest";
import { createBidSchema, updateBidStatusSchema } from "../validations/bid.validation";

const router = express.Router();

router.post(
  "/",
  auth("freelancer"),
  uploadSingle,
  validateRequest(createBidSchema),
  BidControllers.createBid,
);
router.get("/project/:projectId", auth(), BidControllers.getProjectBids);
router.get("/my", auth("freelancer"), BidControllers.getUserBids);
router.put(
  "/:id/status",
  auth("client"),
  validateRequest(updateBidStatusSchema),
  BidControllers.updateBidStatus,
);
router.delete("/:id", auth("freelancer"), BidControllers.deleteBid);

export const bidRoutes = router;
