import express from "express";
import { authRoutes } from "../../routes/v1/auth.routes";
import { profileRoutes } from "../../routes/v1/profile.routes";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/auth",
    route: authRoutes,
  },
  {
    path: "/profile",
    route: profileRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
