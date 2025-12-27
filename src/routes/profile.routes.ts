import express from "express";
import { ProfileController } from "../controllers/profile.controllers";
import auth from "../middlewares/auth";
import validateRequest from "../middlewares/validateRequest";
import {
  updateClientProfileSchema,
  updateFreelancerProfileSchema,
  updateProfileSchema,
} from "../validations/profile.validation";

const router = express.Router();

router.use(auth());

router.get("/me", ProfileController.getProfile);
router.patch("/me", validateRequest(updateProfileSchema), ProfileController.updateProfile);
router.patch(
  "/me/freelancer",
  auth("freelancer"),
  validateRequest(updateFreelancerProfileSchema),
  ProfileController.updateFreelancerProfile,
);
router.patch(
  "/me/client",
  auth("client"),
  validateRequest(updateClientProfileSchema),
  ProfileController.updateClientProfile,
);
router.delete("/me", ProfileController.deleteProfile);

export const profileRoutes = router;
