import express from "express";
import { ReviewControllers } from "../controllers/review.controllers";
import auth from "../middlewares/auth";
import validateRequest from "../middlewares/validateRequest";
import { createReviewSchema } from "../validations/review.validation";

const router = express.Router();

// POST /reviews - Create a new review
router.post("/", auth(), validateRequest(createReviewSchema), ReviewControllers.createReview);

// GET /reviews/:id - Get specific review
router.get("/:id", ReviewControllers.getReviewById);

// GET /reviews/user/:userId - Get all reviews for a user
router.get("/user/:userId", ReviewControllers.getUserReviews);

// GET /reviews/project/:projectId - Get all reviews for a project
router.get("/project/:projectId", ReviewControllers.getProjectReviews);

// DELETE /reviews/:id - Delete a review
router.delete("/:id", auth(), ReviewControllers.deleteReview);

export const reviewRoutes = router;
