import { Mistral } from "@mistralai/mistralai";
import { File } from "../models/file.model";

const mistral = new Mistral({
  apiKey: process.env.MISTRAL_API_KEY,
});

interface IAiTaskSuggestion {
  sprint: string;
  tasks: {
    title: string;
    description: string;
    estimatedHours: number;
    priority: "low" | "medium" | "high";
  }[];
}

const analyzeProjectAndGenerateTasks = async (
  projectId: string,
  projectDescription: string,
  projectName: string,
): Promise<{ sprints: any[]; tasks: any[] }> => {
  try {
    // Get project files
    const files = await File.find({ projectId });

    // Build context for AI
    let projectContext = `Project Name: ${projectName}\nProject Description: ${projectDescription}\n\n`;

    // Add file information to context
    if (files.length > 0) {
      projectContext += "Project Files:\n";
      for (const file of files) {
        projectContext += `- ${file.originalName} (${file.mimeType})\n`;
        // Note: In a real implementation, we might want to fetch and include file content
        // For now, we're just including file names and types
      }
      projectContext += "\n";
    }

    // AI prompt to generate sprint and task structure
    const prompt = `
    Based on the following project information, create a detailed sprint and task breakdown.
    The project should be divided into exactly 3 sprints with appropriate tasks for each sprint.
    
    ${projectContext}
    
    Please provide the response in the following JSON format:
    {
      "sprints": [
        {
          "name": "Sprint 1: Sprint name",
          "description": "Brief description of what will be accomplished in this sprint"
        },
        {
          "name": "Sprint 2: Sprint name",
          "description": "Brief description of what will be accomplished in this sprint"
        },
        {
          "name": "Sprint 3: Sprint name",
          "description": "Brief description of what will be accomplished in this sprint"
        }
      ],
      "tasks": [
        {
          "sprint": "Sprint 1",
          "title": "Task title",
          "description": "Detailed task description",
          "estimatedHours": 5,
          "priority": "medium"
        }
        // ... more tasks for all sprints
      ]
    }
    
    Guidelines:
    1. Distribute tasks logically across the 3 sprints
    2. Each task should have a clear objective
    3. Estimated hours should be realistic (between 2-16 hours)
    4. Priority should be either "low", "medium", or "high"
    5. Include 8-15 tasks total across all sprints
    6. Make sure tasks are specific and actionable
    `;

    // Call Mistral AI
    const response = await mistral.chat.complete({
      model: "mistral-large-latest", // Using a more capable model for this task
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      maxTokens: 2000,
      temperature: 0.3,
    });

    // Extract the AI response
    const aiResponse = response.choices[0]?.message?.content || "";

    // Try to parse the JSON from the AI response
    let parsedResponse;
    try {
      // Extract JSON from the response text
      const responseString = typeof aiResponse === "string" ? aiResponse : String(aiResponse);
      const jsonStart = responseString.indexOf("{");
      const jsonEnd = responseString.lastIndexOf("}") + 1;
      const jsonString = responseString.substring(jsonStart, jsonEnd);
      parsedResponse = JSON.parse(jsonString);
    } catch (parseError) {
      console.error("Error parsing AI response:", parseError);
      // Return a default structure if parsing fails
      parsedResponse = getDefaultTaskStructure();
    }

    return parsedResponse;
  } catch (error) {
    console.error("Error calling Mistral AI:", error);
    // Return a default structure if API call fails
    return getDefaultTaskStructure();
  }
};

const getDefaultTaskStructure = (): { sprints: any[]; tasks: any[] } => {
  return {
    sprints: [
      {
        name: "Sprint 1: Foundation",
        description: "Setup project foundation and initial implementation",
      },
      {
        name: "Sprint 2: Core Features",
        description: "Implement core features and functionality",
      },
      {
        name: "Sprint 3: Polish and Delivery",
        description: "Finalize features, testing, and project delivery",
      },
    ],
    tasks: [
      {
        sprint: "Sprint 1",
        title: "Project Setup",
        description: "Initialize project repository and development environment",
        estimatedHours: 4,
        priority: "high",
      },
      {
        sprint: "Sprint 1",
        title: "Requirements Analysis",
        description: "Analyze project requirements and create technical specifications",
        estimatedHours: 6,
        priority: "high",
      },
      {
        sprint: "Sprint 2",
        title: "Core Development",
        description: "Implement main features of the project",
        estimatedHours: 12,
        priority: "high",
      },
      {
        sprint: "Sprint 2",
        title: "Integration",
        description: "Integrate components and perform initial testing",
        estimatedHours: 8,
        priority: "medium",
      },
      {
        sprint: "Sprint 3",
        title: "Testing",
        description: "Perform comprehensive testing and bug fixing",
        estimatedHours: 10,
        priority: "medium",
      },
      {
        sprint: "Sprint 3",
        title: "Documentation",
        description: "Create project documentation and user guides",
        estimatedHours: 6,
        priority: "low",
      },
    ],
  };
};

export const AiServices = {
  analyzeProjectAndGenerateTasks,
};
