import express from "express";
import auth from "../middlewares/auth";
import validateRequest from "../middlewares/validateRequest";

import { AuthControllers } from "../controllers/auth.controllers";
import { loginSchema, signupSchema } from "../validations/auth.validation";

import { uploadSingle } from "../middlewares/upload.middleware";

const router = express.Router();

router.post("/signup", uploadSingle, validateRequest(signupSchema), AuthControllers.signup);
router.post("/login", validateRequest(loginSchema), AuthControllers.login);
router.get("/users/:id", auth(), AuthControllers.getUserById);

export const authRoutes = router;
