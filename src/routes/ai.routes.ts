import express from "express";
import multer from "multer";
import { analyzePDF, analyzeText } from "../controllers/ai.controllers";
import auth from "../middlewares/auth";

const router = express.Router();

// Configure multer for PDF upload
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB max file size
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype === "application/pdf") {
            cb(null, true);
        } else {
            cb(new Error("Only PDF files are allowed"));
        }
    },
});

/**
 * POST /api/v1/ai/analyze-pdf
 * Analyze PDF project proposal with Gemini AI
 * Requires authentication
 */
router.post("/analyze-pdf", auth(), upload.single("pdf"), analyzePDF);

/**
 * POST /api/v1/ai/analyze-text
 * Analyze project description text with Gemini AI
 * Requires authentication
 */
router.post("/analyze-text", auth(), analyzeText);

export default router;
