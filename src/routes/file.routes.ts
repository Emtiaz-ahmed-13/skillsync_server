import express from "express";
import { FileControllers } from "../controllers/file.controllers";
import auth from "../middlewares/auth";
import { uploadSingle } from "../middlewares/upload.middleware";

const router = express.Router();

router.post("/", auth(), uploadSingle, FileControllers.createFile);
router.get("/:id", FileControllers.getFileById);
router.get("/project/:projectId", FileControllers.getProjectFiles);
router.delete("/:id", auth(), FileControllers.deleteFile);
export const fileRoutes = router;
