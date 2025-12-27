import { Mistral } from "@mistralai/mistralai";

interface Feature {
  title: string;
  description: string;
}

export const generateAIFeatures = async (
  projectTitle: string,
  projectDescription: string,
  featuresCount: number = 5,
): Promise<Feature[]> => {
  try {
    const apiKey = process.env.MISTRAL_API_KEY;

    if (!apiKey) {
      console.warn("Mistral AI API key not found, using mock response");

      return generateMockFeatures(projectTitle, projectDescription, featuresCount);
    }

    const mistral = new Mistral({ apiKey });

    const response = await mistral.chat.complete({
      model: "mistral-large-latest",
      messages: [
        {
          role: "user",
          content: `Generate ${featuresCount} specific software development features for a project titled "${projectTitle}" with description: "${projectDescription}". 
          Respond in JSON format with an array of objects, each having "title" and "description" fields. 
          The features should be specific to the project type and technically relevant. 
          Keep titles concise (under 50 characters) and descriptions informative (under 200 characters).`,
        },
      ],
      temperature: 0.7,
      maxTokens: 1000,
    });

    const messageContent = response.choices[0].message.content;

    let content: string;
    if (typeof messageContent === "string") {
      content = messageContent;
    } else if (Array.isArray(messageContent)) {
      content = messageContent
        .map((chunk) => (typeof chunk === "object" && chunk.type === "text" ? chunk.text : ""))
        .join("");
    } else {
      content = "";
    }

    if (!content) {
      console.error("AI response content is empty");
      throw new Error("Empty response from AI service");
    }

    let featuresData;

    try {
      featuresData = JSON.parse(content);
    } catch (parseError) {
      const jsonMatch = content.match(/\[.*\]/s);
      if (jsonMatch) {
        featuresData = JSON.parse(jsonMatch[0]);
      } else {
        console.error("Failed to parse AI response:", content);
        throw new Error("Invalid response format from AI service");
      }
    }

    return featuresData.map((feature: any) => ({
      title: feature.title || "Untitled Feature",
      description: feature.description || "No description provided",
    }));
  } catch (error: any) {
    console.error("AI service error:", error.message);

    // Fallback to mock features if AI service fails
    return generateMockFeatures(projectTitle, projectDescription, featuresCount);
  }
};

const generateMockFeatures = (
  projectTitle: string,
  projectDescription: string,
  featuresCount: number,
): Feature[] => {
  const lowerDesc = projectDescription.toLowerCase();
  const isEcommerce =
    lowerDesc.includes("shop") ||
    lowerDesc.includes("store") ||
    lowerDesc.includes("buy") ||
    lowerDesc.includes("sell");
  const isLearning =
    lowerDesc.includes("learn") ||
    lowerDesc.includes("course") ||
    lowerDesc.includes("education") ||
    lowerDesc.includes("lms");
  const isSocial =
    lowerDesc.includes("social") ||
    lowerDesc.includes("chat") ||
    lowerDesc.includes("community") ||
    lowerDesc.includes("connect");
  const isDashboard =
    lowerDesc.includes("dashboard") ||
    lowerDesc.includes("analytics") ||
    lowerDesc.includes("admin") ||
    lowerDesc.includes("manage");

  const featureTypes: Array<{ title: string; description: string }> = [];

  if (isEcommerce) {
    return [
      {
        title: "Product Management",
        description: "System for adding, updating, and managing products",
      },
      {
        title: "Shopping Cart",
        description: "User shopping cart functionality with add/remove operations",
      },
      { title: "Checkout Process", description: "Secure checkout flow with payment integration" },
      { title: "Order Tracking", description: "System for users to track their order status" },
      {
        title: "Payment Integration",
        description: "Integration with payment gateways for transactions",
      },
    ];
  } else if (isLearning) {
    return [
      { title: "Course Management", description: "System for creating and managing courses" },
      { title: "User Enrollment", description: "Student enrollment and course access system" },
      { title: "Content Delivery", description: "Platform for delivering course content" },
      { title: "Progress Tracking", description: "System to track student learning progress" },
      { title: "Quiz System", description: "Interactive quiz and assessment functionality" },
    ];
  } else if (isSocial) {
    return [
      { title: "User Profiles", description: "User profile creation and management system" },
      { title: "Content Feed", description: "News feed or content feed implementation" },
      { title: "Messaging", description: "Direct messaging or chat functionality" },
      { title: "Notifications", description: "Real-time notification system" },
      { title: "Media Sharing", description: "Image and video sharing capabilities" },
    ];
  } else if (isDashboard) {
    return [
      { title: "Data Visualization", description: "Charts and graphs for data representation" },
      {
        title: "User Management",
        description: "System for managing user accounts and permissions",
      },
      { title: "Analytics", description: "Data analytics and reporting features" },
      { title: "Settings Panel", description: "Configuration and settings management" },
      { title: "Reports", description: "Generate and export reports functionality" },
    ];
  } else {
    return [
      {
        title: "User Authentication",
        description: "User registration, login, and profile management",
      },
      { title: "Dashboard", description: "User dashboard with key information" },
      { title: "Data Management", description: "CRUD operations for core data entities" },
      { title: "Search Functionality", description: "Search and filtering capabilities" },
      { title: "File Management", description: "File upload and storage system" },
    ];
  }
  const features: Feature[] = [];
  return features;
};
