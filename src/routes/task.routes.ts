import express from "express";
import { TaskControllers } from "../controllers/task.controllers";
import auth from "../middlewares/auth";
import validateRequest from "../middlewares/validateRequest";
import { createTaskSchema, updateTaskSchema } from "../validations/task.validation";

const router = express.Router();

// POST /tasks - Create a new task
router.post("/", auth(), validateRequest(createTaskSchema), TaskControllers.createTask);

// GET /tasks/:id - Get specific task
router.get("/:id", TaskControllers.getTaskById);

// GET /tasks/project/:projectId - Get all tasks for a project
router.get("/project/:projectId", TaskControllers.getProjectTasks);

// PUT /tasks/:id - Update a task
router.put("/:id", auth(), validateRequest(updateTaskSchema), TaskControllers.updateTask);

// DELETE /tasks/:id - Delete a task
router.delete("/:id", auth(), TaskControllers.deleteTask);

export const taskRoutes = router;
