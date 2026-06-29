import { IProject } from "../interfaces/project.interface";
import { Project } from "../models/project.model";
import { Sprint } from "../models/sprint.model";
import { User } from "../models/user.model";
import { NotificationServices } from "./notification.services";

const createProject = async (projectData: IProject): Promise<IProject> => {
  const projectWithStatus = {
    ...projectData,
    status: process.env.NODE_ENV === "development" ? "approved" : "pending",
  };

  const project = await Project.create(projectWithStatus);

  try {
    const adminUsers = await User.find({ role: "admin" }).select("_id");

    for (const admin of adminUsers) {
      await NotificationServices.createNotification({
        userId: admin._id.toString(),
        senderId: projectData.ownerId,
        type: "project_created",
        title: "New Project Created",
        message: `A new project "${projectData.title}" has been created and is pending approval.`,
        projectId: project._id.toString(),
      });
    }
  } catch (error) {
    console.error("Failed to send notification:", error);
  }

  return project.toObject();
};
const getAllProjects = async (
  limit: number = 10,
  page: number = 1,
): Promise<{ projects: IProject[]; totalCount: number }> => {
  const skip = (page - 1) * limit;

  const projects = await Project.find().sort({ createdAt: -1 }).limit(limit).skip(skip).populate("ownerId", "name email").lean();

  const totalCount = await Project.countDocuments();

  return {
    projects: projects.map((project) => ({
      ...project,
      id: project._id.toString(),
    })),
    totalCount,
  };
};

/**
 * Get projects by owner ID
 */
const getProjectsByOwnerId = async (ownerId: string): Promise<IProject[]> => {
  const projects = await Project.find({ ownerId }).sort({ createdAt: -1 }).populate("ownerId", "name email").lean();

  return projects.map((project) => ({
    ...project,
    id: project._id.toString(),
  }));
};

/**
 * Get approved projects
 */
const getApprovedProjects = async (
  limit: number = 10,
  page: number = 1,
  filters: {
    search?: string;
    technology?: string;
    minBudget?: number;
    maxBudget?: number;
    sort?: string;
  } = {},
): Promise<{ projects: IProject[]; totalCount: number }> => {
  const skip = (page - 1) * limit;

  const query: Record<string, unknown> = {
    status: { $in: ["approved", "in-progress"] },
  };

  if (filters.search) {
    query.$or = [
      { title: { $regex: filters.search, $options: "i" } },
      { description: { $regex: filters.search, $options: "i" } },
    ];
  }

  if (filters.technology) {
    query.technology = { $in: [filters.technology] };
  }

  if (filters.minBudget !== undefined || filters.maxBudget !== undefined) {
    query.budget = {};
    if (filters.minBudget !== undefined) {
      (query.budget as Record<string, number>).$gte = filters.minBudget;
    }
    if (filters.maxBudget !== undefined) {
      (query.budget as Record<string, number>).$lte = filters.maxBudget;
    }
  }

  let sortOption: Record<string, 1 | -1> = { createdAt: -1 };
  if (filters.sort === "budget_asc") sortOption = { budget: 1 };
  if (filters.sort === "budget_desc") sortOption = { budget: -1 };
  if (filters.sort === "oldest") sortOption = { createdAt: 1 };

  const projects = await Project.find(query)
    .sort(sortOption)
    .limit(limit)
    .skip(skip)
    .populate("ownerId", "name email")
    .populate("freelancerId", "name email avatar")
    .lean();

  const totalCount = await Project.countDocuments(query);

  return {
    projects: projects.map((project) => ({
      ...project,
      id: project._id.toString(),
    })),
    totalCount,
  };
};

/**
 * Get project by ID
 */
const getProjectById = async (id: string): Promise<IProject | null> => {
  const project = await Project.findById(id).populate("ownerId", "name email").lean();
  if (!project) {
    return null;
  }

  // Fetch project files
  const { File } = await import("../models/file.model");
  const files = await File.find({ projectId: id }).lean();

  return {
    ...project,
    id: project._id.toString(),
    files: files.map(file => ({
      ...file,
      id: file._id.toString()
    }))
  } as any;
};

/**
 * Get pending projects for admin review
 */
const getPendingProjects = async (
  limit: number = 10,
  page: number = 1,
): Promise<{ projects: IProject[]; totalCount: number }> => {
  const skip = (page - 1) * limit;

  const projects = await Project.find({ status: "pending" })
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip)
    .lean();

  const totalCount = await Project.countDocuments({ status: "pending" });

  return {
    projects: projects.map((project) => ({
      ...project,
      id: project._id.toString(),
    })),
    totalCount,
  };
};

const updateProject = async (
  id: string,
  updateData: Partial<IProject>,
): Promise<IProject | null> => {
  const project = await Project.findByIdAndUpdate(
    id,
    { $set: updateData },
    { new: true, runValidators: true },
  ).lean();

  if (!project) {
    return null;
  }

  return {
    ...project,
    id: project._id.toString(),
  };
};

const approveProject = async (
  id: string,
  status: "approved" | "rejected",
  approvedBy: string,
): Promise<IProject | null> => {
  const project = await Project.findByIdAndUpdate(
    id,
    { $set: { status } },
    { new: true, runValidators: true },
  ).lean();

  if (!project) {
    return null;
  }

  try {
    await NotificationServices.createNotification({
      userId: project.ownerId,
      senderId: approvedBy,
      type: status === "approved" ? "project_approved" : "project_rejected",
      title: `Project ${status.charAt(0).toUpperCase() + status.slice(1)}`,
      message: `Your project "${project.title}" has been ${status}.`,
      projectId: project._id.toString(),
    });
  } catch (error) {
    console.error("Failed to send notification:", error);
  }

  return {
    ...project,
    id: project._id.toString(),
  };
};

const deleteProject = async (id: string): Promise<boolean> => {
  const result = await Project.findByIdAndDelete(id);
  return !!result;
};

const createProjectSprints = async (projectId: string, sprintData: any) => {
  const project = await Project.findById(projectId);
  if (!project) {
    throw new Error("Project not found");
  }

  const createdSprints: any[] = [];

  for (const sprint of sprintData.sprints || sprintData) {
    const sprintPayload = {
      ...sprint,
      projectId: projectId,
    };

    const createdSprint = await Sprint.create(sprintPayload);
    createdSprints.push(createdSprint);
  }

  return createdSprints.map((sprint) => ({
    ...sprint.toObject(),
    id: sprint._id.toString(),
  }));
};

export const ProjectServices = {
  createProject,
  getAllProjects,
  getProjectsByOwnerId,
  getApprovedProjects,
  getPendingProjects,
  getProjectById,
  updateProject,
  approveProject,
  deleteProject,
  createProjectSprints,
};
