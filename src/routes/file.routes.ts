import express from "express";
import { FileControllers } from "../controllers/file.controllers";
import auth from "../middlewares/auth";
import validateRequest from "../middlewares/validateRequest";
import { createFileSchema } from "../validations/file.validation";

const router = express.Router();

// POST /files - Upload a new file
router.post("/", auth(), validateRequest(createFileSchema), FileControllers.createFile);

// GET /files/:id - Get specific file
router.get("/:id", FileControllers.getFileById);

// GET /files/project/:projectId - Get all files for a project
router.get("/project/:projectId", FileControllers.getProjectFiles);

// DELETE /files/:id - Delete a file
router.delete("/:id", auth(), FileControllers.deleteFile);

export const fileRoutes = router;
