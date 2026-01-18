import { Document, Schema, model } from "mongoose";

export interface IProjectSummary extends Document {
    projectId: Schema.Types.ObjectId;
    generatedAt: Date;
    summaryData: {
        project: {
            title: string;
            description: string;
            status: string;
            budget: number;
            minimumBid: number;
            startDate: Date;
            endDate: Date;
            technology: string[];
        };
        participants: {
            client: {
                _id: string;
                name: string;
                email: string;
                avatar?: string;
            };
            freelancer: {
                _id: string;
                name: string;
                email: string;
                avatar?: string;
            };
        };
        chatHistory: {
            totalMessages: number;
            keyConversations: Array<{
                sender: string;
                message: string;
                timestamp: Date;
            }>;
        };
        workSubmissions: Array<{
            completedFeatures: string[];
            githubLink: string;
            liveLink?: string;
            status: string;
            submittedAt: Date;
        }>;
        bidHistory: {
            acceptedBid: number;
            totalBids: number;
            acceptedFreelancer: string;
        };
        aiSummary: {
            overview: string;
            keyHighlights: string[];
            challenges: string[];
            recommendations: string[];
            performanceRating: string;
            clientSatisfaction: string;
            freelancerPerformance: string;
        };
    };
    pdfUrl?: string;
}

const projectSummarySchema = new Schema<IProjectSummary>(
    {
        projectId: {
            type: Schema.Types.ObjectId,
            ref: "Project",
            required: true,
            unique: true,
        },
        generatedAt: {
            type: Date,
            default: Date.now,
        },
        summaryData: {
            type: Schema.Types.Mixed,
            required: true,
        },
        pdfUrl: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

// Index for faster queries
projectSummarySchema.index({ projectId: 1 });

export const ProjectSummary = model<IProjectSummary>(
    "ProjectSummary",
    projectSummarySchema
);
