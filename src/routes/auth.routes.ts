import express from "express";
import auth from "../middlewares/auth";
import validateRequest from "../middlewares/validateRequest";
import { AuthControllers } from "../controllers/auth.controllers";
import {
  forgotPasswordSchema,
  githubAuthSchema,
  loginSchema,
  resendVerificationSchema,
  resetPasswordSchema,
  signupSchema,
  verifyEmailSchema,
} from "../validations/auth.validation";
import { uploadSingle } from "../middlewares/upload.middleware";

const router = express.Router();

router.post("/signup", uploadSingle, validateRequest(signupSchema), AuthControllers.signup);
router.post("/login", validateRequest(loginSchema), AuthControllers.login);
router.post("/forgot-password", validateRequest(forgotPasswordSchema), AuthControllers.forgotPassword);
router.post("/reset-password", validateRequest(resetPasswordSchema), AuthControllers.resetPassword);
router.post("/verify-email", validateRequest(verifyEmailSchema), AuthControllers.verifyEmail);
router.post("/resend-verification", validateRequest(resendVerificationSchema), AuthControllers.resendVerification);
router.post("/github", validateRequest(githubAuthSchema), AuthControllers.githubAuth);
router.get("/users/:id", auth(), AuthControllers.getUserById);

export const authRoutes = router;
