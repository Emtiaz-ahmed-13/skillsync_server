import { GoogleGenerativeAI } from "@google/generative-ai";
const pdfParse = require("pdf-parse") as (dataBuffer: Buffer) => Promise<{ text: string; numpages: number; info: any; metadata: any; version: string }>;

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

interface AnalysisResult {
    similarityPercentage: number;
    similarFeatures: string[];
    differentFeatures: string[];
    recommendation: string;
    estimatedComplexity: "low" | "medium" | "high";
    estimatedDuration?: string;
    suggestedTechnologies?: string[];
}

/**
 * Extract text from PDF buffer
 */
export const extractTextFromPDF = async (pdfBuffer: Buffer): Promise<string> => {
    try {
        const data = await pdfParse(pdfBuffer);
        return data.text;
    } catch (error: any) {
        throw new Error(`PDF parsing failed: ${error.message}`);
    }
};

/**
 * Analyze project proposal PDF using Gemini AI
 */
export const analyzeProjectPDF = async (
    pdfBuffer: Buffer,
    existingProjects: any[]
): Promise<AnalysisResult> => {
    try {
        // Extract text from PDF
        const pdfText = await extractTextFromPDF(pdfBuffer);

        if (!pdfText || pdfText.trim().length === 0) {
            throw new Error("PDF appears to be empty or unreadable");
        }

        // Prepare existing projects summary
        const projectsSummary = existingProjects
            .map((p, i) => `Project ${i + 1}: ${p.title}\nFeatures: ${p.description || "N/A"}`)
            .join("\n\n");

        // Create prompt for Gemini
        const prompt = `You are an expert project analyst. Analyze the following project proposal and compare it with existing projects in our database.

NEW PROJECT PROPOSAL:
${pdfText}

EXISTING PROJECTS IN DATABASE:
${projectsSummary || "No existing projects to compare"}

Please analyze and provide a detailed comparison in the following JSON format (respond ONLY with valid JSON, no markdown):
{
  "similarityPercentage": <number between 0-100>,
  "similarFeatures": [<array of features that are similar to existing projects>],
  "differentFeatures": [<array of unique/different features not found in existing projects>],
  "recommendation": "<brief recommendation about the project>",
  "estimatedComplexity": "<low|medium|high>",
  "estimatedDuration": "<estimated time to complete, e.g., '2-3 months'>",
  "suggestedTechnologies": [<array of recommended technologies>]
}

Focus on:
1. Feature similarity with existing projects
2. Unique aspects of this proposal
3. Technical complexity
4. Realistic time estimates`;

        // Call Gemini API
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Clean and parse JSON response
        let cleanedText = text.trim();

        // Remove markdown code blocks if present
        if (cleanedText.startsWith("```json")) {
            cleanedText = cleanedText.replace(/```json\n?/g, "").replace(/```\n?/g, "");
        } else if (cleanedText.startsWith("```")) {
            cleanedText = cleanedText.replace(/```\n?/g, "");
        }

        // Parse JSON
        const analysis: AnalysisResult = JSON.parse(cleanedText);

        // Validate response
        if (
            typeof analysis.similarityPercentage !== "number" ||
            !Array.isArray(analysis.similarFeatures) ||
            !Array.isArray(analysis.differentFeatures)
        ) {
            throw new Error("Invalid response format from Gemini AI");
        }

        return analysis;
    } catch (error: any) {
        console.error("Gemini AI analysis error:", error);
        throw new Error(`AI analysis failed: ${error.message}`);
    }
};

/**
 * Simple text-based project analysis (fallback if PDF fails)
 */
export const analyzeProjectText = async (
    projectDescription: string,
    existingProjects: any[]
): Promise<AnalysisResult> => {
    const projectsSummary = existingProjects
        .map((p, i) => `Project ${i + 1}: ${p.title}\nFeatures: ${p.description || "N/A"}`)
        .join("\n\n");

    const prompt = `Analyze this project description and compare with existing projects.

NEW PROJECT:
${projectDescription}

EXISTING PROJECTS:
${projectsSummary || "No existing projects"}

Respond with JSON only:
{
  "similarityPercentage": <0-100>,
  "similarFeatures": [<array>],
  "differentFeatures": [<array>],
  "recommendation": "<text>",
  "estimatedComplexity": "<low|medium|high>",
  "estimatedDuration": "<time estimate>",
  "suggestedTechnologies": [<array>]
}`;

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    const text = (await result.response).text().trim();

    let cleanedText = text.replace(/```json\n?/g, "").replace(/```\n?/g, "");
    return JSON.parse(cleanedText);
};
