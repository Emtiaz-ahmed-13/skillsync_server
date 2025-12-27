import express from "express";
import { ReviewControllers } from "../controllers/review.controllers";
import auth from "../middlewares/auth";
import validateRequest from "../middlewares/validateRequest";
import { createReviewSchema } from "../validations/review.validation";

const router = express.Router();

router.post("/", auth(), validateRequest(createReviewSchema), ReviewControllers.createReview);
router.get("/:id", ReviewControllers.getReviewById);
router.get("/user/:userId", ReviewControllers.getUserReviews);
router.get("/project/:projectId", ReviewControllers.getProjectReviews);
router.delete("/:id", auth(), ReviewControllers.deleteReview);

export const reviewRoutes = router;
