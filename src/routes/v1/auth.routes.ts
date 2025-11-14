import express from "express";
import validateRequest from "../../middlewares/validateRequest";

import { AuthControllers } from "../../controllers/auth.controllers";
import { loginSchema, signupSchema } from "../../validations/auth.validation";

const router = express.Router();

router.post("/signup", validateRequest(signupSchema), AuthControllers.signup);
router.post("/login", validateRequest(loginSchema), AuthControllers.login);

export const authRoutes = router;
