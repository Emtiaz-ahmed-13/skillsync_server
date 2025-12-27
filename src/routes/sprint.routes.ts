import express from "express";
import { SprintControllers } from "../controllers/sprint.controllers";
import auth from "../middlewares/auth";
import validateRequest from "../middlewares/validateRequest";
import { createSprintSchema, updateSprintSchema } from "../validations/sprint.validation";

const router = express.Router();

router.post("/", auth(), validateRequest(createSprintSchema), SprintControllers.createSprint);

router.get("/project/:projectId", auth(), SprintControllers.getSprintsByProject);

router.get("/:id", auth(), SprintControllers.getSprintById);

router.patch("/:id", auth(), validateRequest(updateSprintSchema), SprintControllers.updateSprint);

router.delete("/:id", auth(), SprintControllers.deleteSprint);

export const sprintRoutes = router;
