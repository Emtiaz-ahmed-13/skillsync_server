import express from "express";
import { BidControllers } from "../controllers/bid.controllers";
import auth from "../middlewares/auth";
import validateRequest from "../middlewares/validateRequest";
import { createBidSchema, updateBidStatusSchema } from "../validations/bid.validation";

const router = express.Router();

// POST /bids - Place a new bid (freelancer only)
router.post("/", auth("freelancer"), validateRequest(createBidSchema), BidControllers.createBid);

// GET /bids/project/:projectId - Get all bids for a project
router.get("/project/:projectId", auth(), BidControllers.getProjectBids);

// GET /bids/my - Get all bids placed by the logged-in freelancer
router.get("/my", auth("freelancer"), BidControllers.getUserBids);

// PUT /bids/:id/status - Update bid status (client only)
router.put(
  "/:id/status",
  auth("client"),
  validateRequest(updateBidStatusSchema),
  BidControllers.updateBidStatus,
);

// DELETE /bids/:id - Delete a bid (freelancer only)
router.delete("/:id", auth("freelancer"), BidControllers.deleteBid);

export const bidRoutes = router;
