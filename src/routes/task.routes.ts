import express from "express";
import { TaskControllers } from "../controllers/task.controllers";
import auth from "../middlewares/auth";
import validateRequest from "../middlewares/validateRequest";
import { createTaskSchema, updateTaskSchema } from "../validations/task.validation";

const router = express.Router();
router.post("/", auth(), validateRequest(createTaskSchema), TaskControllers.createTask);
router.get("/project/:projectId", auth(), TaskControllers.getTasksByProject);
router.get("/sprint/:sprintId", auth(), TaskControllers.getTasksBySprint);
router.get("/:id", auth(), TaskControllers.getTaskById);
router.patch("/:id", auth(), validateRequest(updateTaskSchema), TaskControllers.updateTask);
router.delete("/:id", auth(), TaskControllers.deleteTask);

export const taskRoutes = router;
