import { IFeature } from "../interfaces/sprint.interface";
import { Project } from "../models/project.model";
import { Sprint } from "../models/sprint.model";
import ApiError from "../utils/ApiError";
import { generateAIFeatures } from "../utils/ai.utils";

// AI service to generate project-specific features based on project details
const generateFeaturesFromProject = async (
  projectTitle: string,
  projectDescription: string,
  featuresCount: number = 5,
): Promise<IFeature[]> => {
  // Generate features using AI API
  const aiResponse = await generateAIFeatures(projectTitle, projectDescription, featuresCount);

  // Parse the AI response into features
  const features: IFeature[] = [];

  for (let i = 0; i < featuresCount && i < aiResponse.length; i++) {
    features.push({
      id: `feature-${Date.now()}-${i}`,
      title: aiResponse[i].title,
      description: aiResponse[i].description,
      status: "pending" as "pending" | "in-progress" | "completed",
    });
  }

  return features;
};

// Helper function to extract keywords from project title and description
const extractKeywords = (title: string, description: string): string[] => {
  const text = `${title} ${description}`.toLowerCase();
  const keywords: string[] = [];

  // Common tech keywords to identify project type
  const techKeywords = [
    "web",
    "mobile",
    "app",
    "application",
    "api",
    "dashboard",
    "admin",
    "frontend",
    "backend",
    "e-commerce",
    "ecommerce",
    "shop",
    "store",
    "blog",
    "website",
    "system",
    "platform",
    "crm",
    "erp",
    "learning",
    "lms",
    "education",
    "chat",
    "messaging",
    "social",
    "media",
    "payment",
    "booking",
    "reservation",
    "marketplace",
    "authentication",
    "user",
    "profile",
    "payment",
    "database",
    "security",
    "ui",
    "ux",
  ];

  for (const keyword of techKeywords) {
    if (text.includes(keyword)) {
      keywords.push(keyword);
    }
  }

  return [...new Set(keywords)]; // Remove duplicates
};

// Get feature templates based on project type
const getFeatureTemplatesByProjectType = (
  keywords: string[],
): Array<{ title: string; description: string }> => {
  let templates: Array<{ title: string; description: string }> = [];

  // E-commerce related templates
  if (keywords.some((k) => ["e-commerce", "ecommerce", "shop", "store"].includes(k))) {
    templates = [
      {
        title: "Product Catalog",
        description: "Implementation of product listing, search, and filtering functionality",
      },
      {
        title: "Shopping Cart",
        description: "Shopping cart functionality with add, remove, and update operations",
      },
      { title: "Checkout Process", description: "Secure checkout flow with payment integration" },
      {
        title: "User Authentication",
        description: "User registration, login, and profile management",
      },
      { title: "Order Management", description: "Order tracking, history, and management system" },
      {
        title: "Payment Integration",
        description: "Integration with payment gateways for secure transactions",
      },
      {
        title: "Admin Dashboard",
        description: "Admin panel for managing products, orders, and users",
      },
      { title: "Product Reviews", description: "User review and rating system for products" },
    ];
  }
  // Learning/education related templates
  else if (keywords.some((k) => ["learning", "lms", "education", "course"].includes(k))) {
    templates = [
      {
        title: "Course Management",
        description: "System for creating, updating, and managing courses",
      },
      { title: "User Enrollment", description: "Student enrollment and course access management" },
      {
        title: "Content Delivery",
        description: "Video/audio content streaming and delivery system",
      },
      { title: "Progress Tracking", description: "Student progress and completion tracking" },
      { title: "Quiz System", description: "Interactive quiz and assessment functionality" },
      {
        title: "User Dashboard",
        description: "Personalized dashboard for students and instructors",
      },
      {
        title: "Payment Processing",
        description: "Secure payment processing for course purchases",
      },
      {
        title: "Certificate Generation",
        description: "Automated certificate generation upon course completion",
      },
    ];
  }
  // Social media related templates
  else if (keywords.some((k) => ["social", "media", "chat", "messaging"].includes(k))) {
    templates = [
      { title: "User Profiles", description: "User profile creation and management system" },
      { title: "Content Feed", description: "News feed or content feed implementation" },
      { title: "Messaging System", description: "Direct messaging or chat functionality" },
      { title: "Notifications", description: "Real-time notification system" },
      { title: "Media Upload", description: "Image and video upload functionality" },
      { title: "Friend Connections", description: "User following and connection management" },
      { title: "Content Sharing", description: "Ability to share posts and content" },
      { title: "Privacy Controls", description: "User privacy and content visibility settings" },
    ];
  }
  // General web application templates
  else {
    templates = [
      {
        title: "User Authentication",
        description: "User registration, login, and authentication system",
      },
      { title: "Dashboard", description: "User dashboard with key information and metrics" },
      { title: "Data Management", description: "CRUD operations for core data entities" },
      { title: "Search Functionality", description: "Search and filtering capabilities" },
      { title: "File Management", description: "File upload, storage, and retrieval system" },
      { title: "Notifications", description: "Notification system for user updates" },
      { title: "Reporting", description: "Data reporting and analytics dashboard" },
      { title: "API Integration", description: "Integration with external APIs and services" },
    ];
  }

  return templates;
};

// Generate feature title based on project context
const generateFeatureTitle = (
  templateTitle: string,
  projectTitle: string,
  keywords: string[],
): string => {
  // Replace generic terms with project-specific terms if possible
  let title = templateTitle;

  if (keywords.includes("e-commerce") || keywords.includes("shop")) {
    title = title.replace(/product/gi, "product").replace(/catalog/gi, "catalog");
  } else if (keywords.includes("learning") || keywords.includes("lms")) {
    title = title.replace(/course/gi, "course").replace(/content/gi, "learning content");
  }

  return `${projectTitle} - ${title}`;
};

// Generate feature description based on project context
const generateFeatureDescription = (
  templateDescription: string,
  projectTitle: string,
  projectDescription: string,
  keywords: string[],
): string => {
  // Create a more specific description based on project context
  return `Implementation of ${templateDescription.toLowerCase()} specifically for the ${projectTitle} project. ${projectDescription.substring(0, 100)}...`;
};

// Mock AI service for milestone generation
const generateMilestonesFromProject = async (
  projectTitle: string,
  projectDescription: string,
  timeline: number,
): Promise<
  Array<{ id: string; title: string; description: string; targetDate: string; status: string }>
> => {
  // This is a mock implementation - in a real scenario, this would use an AI service
  const mockMilestones: Array<{
    id: string;
    title: string;
    description: string;
    targetDate: string;
    status: string;
  }> = [];

  const milestoneCount = Math.min(3, Math.ceil(timeline / 7)); // Max 3 milestones or one per week

  for (let i = 1; i <= milestoneCount; i++) {
    mockMilestones.push({
      id: `milestone-${i}`,
      title: `${projectTitle} - Milestone ${i}`,
      description: `Key milestone ${i} for ${projectTitle}: ${projectDescription.substring(0, 50)}...`,
      targetDate: new Date(Date.now() + i * (timeline / milestoneCount) * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      status: "pending",
    });
  }

  return mockMilestones;
};

const generateSprintPlan = async (
  projectId: string,
  projectTitle: string,
  projectDescription: string,
  timeline: number,
  featuresCount: number = 5,
) => {
  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  // Generate features using AI
  const features = await generateFeaturesFromProject(
    projectTitle,
    projectDescription,
    featuresCount,
  );

  // Calculate sprint dates based on timeline
  const totalDays = timeline;
  const sprintsCount = Math.min(4, Math.ceil(totalDays / 14)); // Max 4 sprints, max 2 weeks per sprint
  const daysPerSprint = Math.ceil(totalDays / sprintsCount);

  const sprints: Array<{
    projectId: string;
    title: string;
    description: string;
    features: IFeature[];
    startDate: Date;
    endDate: Date;
    status: string;
  }> = [];
  const startDate = new Date();

  for (let i = 0; i < sprintsCount; i++) {
    const startIndex = Math.floor((i * features.length) / sprintsCount);
    const endIndex = Math.floor(((i + 1) * features.length) / sprintsCount);
    const sprintFeatures = features.slice(startIndex, endIndex);

    const sprint = {
      projectId,
      title: `${projectTitle} - Sprint ${i + 1}`,
      description: `Sprint ${i + 1} for ${projectTitle} project`,
      features: sprintFeatures,
      startDate: new Date(startDate.getTime() + i * daysPerSprint * 24 * 60 * 60 * 1000),
      endDate: new Date(startDate.getTime() + (i + 1) * daysPerSprint * 24 * 60 * 60 * 1000),
      status: "planning",
    };

    sprints.push(sprint);
  }

  return {
    project: {
      id: projectId,
      title: projectTitle,
      description: projectDescription,
    },
    timeline,
    sprints,
    features,
  };
};

const updateFeature = async (sprintId: string, featureId: string, updateData: any) => {
  const sprint = await Sprint.findById(sprintId);
  if (!sprint) {
    throw new ApiError(404, "Sprint not found");
  }

  // Find the feature in the sprint
  const featureIndex = sprint.features.findIndex((feature: any) => feature.id === featureId);
  if (featureIndex === -1) {
    throw new ApiError(404, "Feature not found in sprint");
  }

  // Update the feature
  const updatedFeature = {
    ...sprint.features[featureIndex],
    ...updateData,
  };

  // Update the sprint with the modified feature
  const updatedFeatures = [...sprint.features];
  updatedFeatures[featureIndex] = updatedFeature;

  const updatedSprint = await Sprint.findByIdAndUpdate(
    sprintId,
    { features: updatedFeatures },
    { new: true, runValidators: true },
  ).lean();

  if (!updatedSprint) {
    throw new ApiError(404, "Sprint not found");
  }

  return {
    ...updatedSprint,
    id: updatedSprint._id,
  };
};

const generateMilestones = async (
  projectId: string,
  projectTitle: string,
  projectDescription: string,
  timeline: number,
) => {
  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  // Generate milestones using AI
  const milestones = await generateMilestonesFromProject(
    projectTitle,
    projectDescription,
    timeline,
  );

  return {
    project: {
      id: projectId,
      title: projectTitle,
      description: projectDescription,
    },
    timeline,
    milestones,
  };
};

const completeSprint = async (sprintId: string) => {
  const sprint = await Sprint.findByIdAndUpdate(
    sprintId,
    { status: "completed" },
    { new: true, runValidators: true },
  ).lean();

  if (!sprint) {
    throw new ApiError(404, "Sprint not found");
  }

  return {
    ...sprint,
    id: sprint._id,
  };
};

export const AISprintDistributionServices = {
  generateSprintPlan,
  updateFeature,
  generateMilestones,
  completeSprint,
};
