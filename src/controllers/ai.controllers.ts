import { Request, Response } from "express";
import { Project } from "../models/project.model";
import { analyzeProjectPDF, analyzeProjectText } from "../services/ai.services";
import ApiError from "../utils/ApiError";

/**
 * Analyze PDF project proposal using Groq AI
 * POST /api/v1/ai/analyze-pdf
 */
export const analyzePDF = async (req: Request, res: Response) => {
    try {
        // Check if file was uploaded
        if (!req.file) {
            throw new ApiError(400, "No PDF file uploaded");
        }

        // Validate file type
        if (req.file.mimetype !== "application/pdf") {
            throw new ApiError(400, "Only PDF files are allowed");
        }

        // Get existing projects for comparison (limit to 10 most recent)
        const existingProjects = await Project.find()
            .select("title description features")
            .sort({ createdAt: -1 })
            .limit(10)
            .lean();

        // Analyze PDF with Groq AI
        const analysis = await analyzeProjectPDF(req.file.buffer, existingProjects);

        res.status(200).json({
            success: true,
            message: "PDF analyzed successfully",
            data: analysis,
        });
    } catch (error: any) {
        console.error("PDF analysis error:", error);
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "PDF analysis failed",
            error: {
                statusCode: error.statusCode || 500,
            },
        });
    }
};

/**
 * Analyze project description text using Groq AI
 * POST /api/v1/ai/analyze-text
 */
export const analyzeText = async (req: Request, res: Response) => {
    try {
        const { description } = req.body;

        if (!description || typeof description !== "string") {
            throw new ApiError(400, "Project description is required");
        }

        if (description.trim().length < 50) {
            throw new ApiError(400, "Project description must be at least 50 characters");
        }

        // Get existing projects for comparison
        const existingProjects = await Project.find()
            .select("title description features")
            .sort({ createdAt: -1 })
            .limit(10)
            .lean();

        // Analyze text with Groq AI
        const analysis = await analyzeProjectText(description, existingProjects);

        res.status(200).json({
            success: true,
            message: "Project description analyzed successfully",
            data: analysis,
        });
    } catch (error: any) {
        console.error("Text analysis error:", error);
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Text analysis failed",
            error: {
                statusCode: error.statusCode || 500,
            },
        });
    }
};

export const estimateTimeline = async (req: Request, res: Response) => {
    try {
        const { title, description, technologies, taskCount } = req.body;

        if (!title || !description) {
            throw new ApiError(400, "Project title and description are required");
        }

        const { estimateProjectTimeline } = await import("../services/ai.services");
        const estimate = await estimateProjectTimeline({
            title,
            description,
            technologies,
            taskCount,
        });

        res.status(200).json({
            success: true,
            message: "Timeline estimated successfully",
            data: estimate,
        });
    } catch (error: any) {
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message || "Timeline estimation failed",
        });
    }
};
