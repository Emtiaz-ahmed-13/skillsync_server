import express from "express";
import { AdminControllers } from "../controllers/admin.controllers";
import auth from "../middlewares/auth";

const router = express.Router();

// GET /admin/analytics - Get dashboard analytics
router.get("/analytics", auth("admin"), AdminControllers.getDashboardAnalytics);

// GET /admin/users - Get all users
router.get("/users", auth("admin"), AdminControllers.getAllUsers);

// GET /admin/users/:id - Get specific user
router.get("/users/:id", auth("admin"), AdminControllers.getUserById);

// PUT /admin/users/:id/role - Update user role
router.put("/users/:id/role", auth("admin"), AdminControllers.updateUserRole);

// DELETE /admin/users/:id - Delete user
router.delete("/users/:id", auth("admin"), AdminControllers.deleteUser);

// GET /admin/disputes - Get all disputes
router.get("/disputes", auth("admin"), AdminControllers.getDisputes);

// PUT /admin/disputes/:id/resolve - Resolve dispute
router.put("/disputes/:id/resolve", auth("admin"), AdminControllers.resolveDispute);

export const adminRoutes = router;
