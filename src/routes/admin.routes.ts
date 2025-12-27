import express from "express";
import { AdminControllers } from "../controllers/admin.controllers";
import auth from "../middlewares/auth";

const router = express.Router();

router.get("/analytics", auth("admin"), AdminControllers.getDashboardAnalytics);
router.get("/users", auth("admin"), AdminControllers.getAllUsers);
router.get("/users/:id", auth("admin"), AdminControllers.getUserById);
router.put("/users/:id/role", auth("admin"), AdminControllers.updateUserRole);
router.delete("/users/:id", auth("admin"), AdminControllers.deleteUser);
router.get("/disputes", auth("admin"), AdminControllers.getDisputes);
router.put("/disputes/:id/resolve", auth("admin"), AdminControllers.resolveDispute);

export const adminRoutes = router;
