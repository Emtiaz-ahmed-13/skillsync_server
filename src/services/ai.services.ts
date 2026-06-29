import { generateGroqCompletion, parseJsonFromAI } from "../utils/groq.utils";

const pdfParse = require("pdf-parse") as (
  dataBuffer: Buffer,
) => Promise<{ text: string; numpages: number; info: any; metadata: any; version: string }>;

interface AnalysisResult {
  similarityPercentage: number;
  similarFeatures: string[];
  differentFeatures: string[];
  recommendation: string;
  estimatedComplexity: "low" | "medium" | "high";
  estimatedDuration?: string;
  suggestedTechnologies?: string[];
}

export const extractTextFromPDF = async (pdfBuffer: Buffer): Promise<string> => {
  try {
    const data = await pdfParse(pdfBuffer);
    return data.text;
  } catch (error: any) {
    throw new Error(`PDF parsing failed: ${error.message}`);
  }
};

export const analyzeProjectPDF = async (
  pdfBuffer: Buffer,
  existingProjects: any[],
): Promise<AnalysisResult> => {
  try {
    const pdfText = await extractTextFromPDF(pdfBuffer);

    if (!pdfText || pdfText.trim().length === 0) {
      throw new Error("PDF appears to be empty or unreadable");
    }

    const projectsSummary = existingProjects
      .map((p, i) => `Project ${i + 1}: ${p.title}\nFeatures: ${p.description || "N/A"}`)
      .join("\n\n");

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

    const text = await generateGroqCompletion(prompt);
    const analysis = parseJsonFromAI<AnalysisResult>(text);

    if (
      typeof analysis.similarityPercentage !== "number" ||
      !Array.isArray(analysis.similarFeatures) ||
      !Array.isArray(analysis.differentFeatures)
    ) {
      throw new Error("Invalid response format from Groq AI");
    }

    return analysis;
  } catch (error: any) {
    console.error("Groq AI analysis error:", error);
    throw new Error(`AI analysis failed: ${error.message}`);
  }
};

export const analyzeProjectText = async (
  projectDescription: string,
  existingProjects: any[],
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

  const text = await generateGroqCompletion(prompt);
  return parseJsonFromAI<AnalysisResult>(text);
};

export const estimateProjectTimeline = async (payload: {
  title: string;
  description: string;
  technologies?: string[];
  taskCount?: number;
}) => {
  const prompt = `You are a project manager. Estimate timeline for this freelance project.

Title: ${payload.title}
Description: ${payload.description}
Technologies: ${payload.technologies?.join(", ") || "Not specified"}
Task count: ${payload.taskCount ?? "Unknown"}

Respond with JSON only:
{
  "estimatedWeeks": <number>,
  "estimatedDuration": "<human readable e.g. 4-6 weeks>",
  "phases": [{"name": "<phase>", "duration": "<duration>", "description": "<brief>"}],
  "confidence": "<low|medium|high>",
  "notes": "<brief recommendation>"
}`;

  const text = await generateGroqCompletion(prompt);
  return parseJsonFromAI<{
    estimatedWeeks: number;
    estimatedDuration: string;
    phases: { name: string; duration: string; description: string }[];
    confidence: string;
    notes: string;
  }>(text);
};
