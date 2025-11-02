import { Router } from "express";
import { authController } from "../../controllers/auth.controller";
import { verifyToken } from "../../middleware/auth/auth.middleware";

const router = Router();

// Public routes (no auth required)
router.post("/register", authController.register);
router.post("/login", authController.login);

// Protected routes (auth required)
router.get("/profile", verifyToken, authController.getProfile);
router.patch("/profile", verifyToken, authController.updateProfile);
router.post("/change-password", verifyToken, authController.changePassword);

export const authRoutes = router;
