import { GoogleGenerativeAI } from "@google/generative-ai";
import { Bid } from "../models/bid.model";
import { Chat } from "../models/chat.model";
import { Project } from "../models/project.model";
import { ProjectSummary } from "../models/projectSummary.model";
import { WorkSubmission } from "../models/workSubmission.model";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

interface AISummaryResult {
    overview: string;
    keyHighlights: string[];
    challenges: string[];
    recommendations: string[];
    performanceRating: string;
    clientSatisfaction: string;
    freelancerPerformance: string;
}

/**
 * Generate AI-powered project summary using Gemini
 */
export const generateAISummary = async (projectData: any): Promise<AISummaryResult> => {
    try {
        const prompt = `You are a professional project analyst. Generate a comprehensive project summary report based on the following data.

PROJECT DETAILS:
Title: ${projectData.project.title}
Description: ${projectData.project.description}
Duration: ${new Date(projectData.project.startDate).toLocaleDateString()} to ${new Date(projectData.project.endDate).toLocaleDateString()}
Budget: $${projectData.project.budget}
Technologies: ${projectData.project.technology.join(", ")}

PARTICIPANTS:
Client: ${projectData.participants.client.name} (${projectData.participants.client.email})
Freelancer: ${projectData.participants.freelancer.name} (${projectData.participants.freelancer.email})

COMMUNICATION:
Total Messages Exchanged: ${projectData.chatHistory.totalMessages}
Sample Conversations: ${projectData.chatHistory.keyConversations.slice(0, 5).map((c: any) => `${c.sender}: "${c.message}"`).join(" | ")}

DELIVERABLES:
${projectData.workSubmissions.map((s: any, i: number) => `
Submission ${i + 1}:
- Features: ${s.completedFeatures.join(", ")}
- GitHub: ${s.githubLink}
- Status: ${s.status}
`).join("\n")}

BID INFORMATION:
Accepted Bid Amount: $${projectData.bidHistory.acceptedBid}
Total Bids Received: ${projectData.bidHistory.totalBids}

Please analyze this project and provide a detailed summary in the following JSON format (respond ONLY with valid JSON, no markdown):
{
  "overview": "A comprehensive 2-3 sentence overview of the project, its goals, and outcomes",
  "keyHighlights": ["Achievement 1", "Achievement 2", "Achievement 3", ...],
  "challenges": ["Challenge 1", "Challenge 2", ...],
  "recommendations": ["Recommendation 1", "Recommendation 2", ...],
  "performanceRating": "Excellent|Good|Satisfactory|Needs Improvement",
  "clientSatisfaction": "Analysis of client satisfaction based on conversations and project completion",
  "freelancerPerformance": "Analysis of freelancer performance based on deliverables and communication"
}

Focus on:
1. Project success and goal achievement
2. Quality of deliverables
3. Communication effectiveness
4. Technical implementation
5. Areas for improvement`;

        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text().trim();

        // Clean and parse JSON response
        let cleanedText = text;
        if (cleanedText.startsWith("```json")) {
            cleanedText = cleanedText.replace(/```json\n?/g, "").replace(/```\n?/g, "");
        } else if (cleanedText.startsWith("```")) {
            cleanedText = cleanedText.replace(/```\n?/g, "");
        }

        const aiSummary: AISummaryResult = JSON.parse(cleanedText);

        // Validate response
        if (
            !aiSummary.overview ||
            !Array.isArray(aiSummary.keyHighlights) ||
            !Array.isArray(aiSummary.challenges) ||
            !Array.isArray(aiSummary.recommendations)
        ) {
            throw new Error("Invalid AI response format");
        }

        return aiSummary;
    } catch (error: any) {
        console.error("AI summary generation error:", error);
        // Return fallback summary
        return {
            overview: `Project "${projectData.project.title}" was completed with ${projectData.workSubmissions.length} deliverable(s).`,
            keyHighlights: [
                `Budget: $${projectData.project.budget}`,
                `Technologies: ${projectData.project.technology.join(", ")}`,
                `Total communications: ${projectData.chatHistory.totalMessages} messages`,
            ],
            challenges: ["AI analysis unavailable"],
            recommendations: ["Review project details manually"],
            performanceRating: "Satisfactory",
            clientSatisfaction: "Analysis unavailable",
            freelancerPerformance: "Analysis unavailable",
        };
    }
};

/**
 * Fetch all project-related data for summary generation
 */
export const fetchProjectData = async (projectId: string) => {
    try {
        // Fetch project details
        const project = await Project.findById(projectId).populate("ownerId", "name email avatar");
        if (!project) {
            throw new Error("Project not found");
        }

        // Fetch accepted bid and freelancer
        const acceptedBid = await Bid.findOne({
            projectId,
            status: "accepted",
        }).populate("freelancerId", "name email avatar");

        if (!acceptedBid) {
            throw new Error("No accepted bid found for this project");
        }

        const freelancer = acceptedBid.freelancerId as any;
        const client = project.ownerId as any;

        // Fetch all bids for this project
        const allBids = await Bid.find({ projectId });

        // Fetch chat history between client and freelancer
        const chatMessages = await Chat.find({
            $or: [
                { senderId: client._id, receiverId: freelancer._id },
                { senderId: freelancer._id, receiverId: client._id },
            ],
        })
            .sort({ createdAt: 1 })
            .populate("senderId", "name");

        // Fetch work submissions
        const workSubmissions = await WorkSubmission.find({
            projectId,
            freelancerId: freelancer._id,
        }).sort({ createdAt: 1 });

        // Prepare data structure
        const projectData = {
            project: {
                title: project.title,
                description: project.description,
                status: project.status,
                budget: project.budget,
                minimumBid: project.minimumBid,
                startDate: project.createdAt,
                endDate: new Date(), // Current date as end date
                technology: project.technology,
            },
            participants: {
                client: {
                    _id: client._id.toString(),
                    name: client.name,
                    email: client.email,
                    avatar: client.avatar,
                },
                freelancer: {
                    _id: freelancer._id.toString(),
                    name: freelancer.name,
                    email: freelancer.email,
                    avatar: freelancer.avatar,
                },
            },
            chatHistory: {
                totalMessages: chatMessages.length,
                keyConversations: chatMessages.map((msg: any) => ({
                    sender: msg.senderId.name,
                    message: msg.message,
                    timestamp: msg.createdAt,
                })),
            },
            workSubmissions: workSubmissions.map((sub: any) => ({
                completedFeatures: sub.completedFeatures,
                githubLink: sub.githubLink,
                liveLink: sub.liveLink,
                status: sub.status,
                submittedAt: sub.createdAt,
            })),
            bidHistory: {
                acceptedBid: acceptedBid.amount,
                totalBids: allBids.length,
                acceptedFreelancer: freelancer.name,
            },
        };

        return projectData;
    } catch (error: any) {
        console.error("Error fetching project data:", error);
        throw new Error(`Failed to fetch project data: ${error.message}`);
    }
};

/**
 * Generate complete project summary
 */
export const generateProjectSummary = async (projectId: string) => {
    try {
        // Check if summary already exists
        const existingSummary = await ProjectSummary.findOne({ projectId });
        if (existingSummary) {
            return existingSummary;
        }

        // Fetch all project data
        const projectData = await fetchProjectData(projectId);

        // Generate AI summary
        const aiSummary = await generateAISummary(projectData);

        // Create complete summary data
        const summaryData = {
            ...projectData,
            aiSummary,
        };

        // Save to database
        const projectSummary = await ProjectSummary.create({
            projectId,
            summaryData,
            generatedAt: new Date(),
        });

        return projectSummary;
    } catch (error: any) {
        console.error("Error generating project summary:", error);
        throw new Error(`Failed to generate project summary: ${error.message}`);
    }
};

/**
 * Get existing project summary
 */
export const getProjectSummary = async (projectId: string) => {
    try {
        const summary = await ProjectSummary.findOne({ projectId });
        if (!summary) {
            throw new Error("Project summary not found");
        }
        return summary;
    } catch (error: any) {
        console.error("Error fetching project summary:", error);
        throw new Error(`Failed to fetch project summary: ${error.message}`);
    }
};

export const ProjectSummaryService = {
    generateProjectSummary,
    getProjectSummary,
    fetchProjectData,
    generateAISummary,
};
