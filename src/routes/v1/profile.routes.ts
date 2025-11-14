import express from "express";
import { ProfileController } from "../../controllers/profile.controllers";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import {
  updateClientProfileSchema,
  updateFreelancerProfileSchema,
  updateProfileSchema,
} from "../../validations/profile.validation";

const router = express.Router();

// All profile routes require authentication
router.use(auth());

// Get current user profile
router.get("/me", ProfileController.getProfile);

// Update basic profile (name, phone, avatar)
router.patch("/me", validateRequest(updateProfileSchema), ProfileController.updateProfile);

// Update freelancer-specific profile (only for freelancers)
router.patch(
  "/me/freelancer",
  auth("freelancer"),
  validateRequest(updateFreelancerProfileSchema),
  ProfileController.updateFreelancerProfile,
);

// Update client-specific profile (only for clients)
router.patch(
  "/me/client",
  auth("client"),
  validateRequest(updateClientProfileSchema),
  ProfileController.updateClientProfile,
);

export const profileRoutes = router;
