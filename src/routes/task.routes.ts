import express from "express";
import { TaskControllers } from "../controllers/task.controllers";
import auth from "../middlewares/auth";
import validateRequest from "../middlewares/validateRequest";
import { createTaskSchema, updateTaskSchema } from "../validations/task.validation";

const router = express.Router();

// POST /tasks - Create a new task
router.post(
  "/",
  auth(),
  validateRequest(createTaskSchema),
  TaskControllers.createTask
);

// GET /tasks/project/:projectId - Get all tasks for a project
router.get(
  "/project/:projectId",
  auth(),
  TaskControllers.getTasksByProject
);

// GET /tasks/sprint/:sprintId - Get all tasks for a sprint
router.get(
  "/sprint/:sprintId",
  auth(),
  TaskControllers.getTasksBySprint
);

// GET /tasks/:id - Get specific task
router.get(
  "/:id",
  auth(),
  TaskControllers.getTaskById
);

// PATCH /tasks/:id - Update a task
router.patch(
  "/:id",
  auth(),
  validateRequest(updateTaskSchema),
  TaskControllers.updateTask
);

// DELETE /tasks/:id - Delete a task
router.delete(
  "/:id",
  auth(),
  TaskControllers.deleteTask
);

export const taskRoutes = router;