import { IProject } from "../interfaces/project.interface";
import { Project } from "../models/project.model";
import { User } from "../models/user.model";
import { NotificationServices } from "./notification.services";

/**
 * Create a new project
 */
const createProject = async (projectData: IProject): Promise<IProject> => {
  // Set default status to pending
  const projectWithStatus = {
    ...projectData,
    status: "pending",
  };

  const project = await Project.create(projectWithStatus);

  // Notify admin about new project
  try {
    // Find all admin users to notify
    const adminUsers = await User.find({ role: "admin" }).select("_id");

    // Send notification to each admin
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

/**
 * Get all projects with pagination
 */
const getAllProjects = async (
  limit: number = 10,
  page: number = 1,
): Promise<{ projects: IProject[]; totalCount: number }> => {
  const skip = (page - 1) * limit;

  const projects = await Project.find().sort({ createdAt: -1 }).limit(limit).skip(skip).lean();

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
  const projects = await Project.find({ ownerId }).sort({ createdAt: -1 }).lean();

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
): Promise<{ projects: IProject[]; totalCount: number }> => {
  const skip = (page - 1) * limit;

  const projects = await Project.find({ status: "approved" })
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip)
    .lean();

  const totalCount = await Project.countDocuments({ status: "approved" });

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
  const project = await Project.findById(id).lean();
  if (!project) {
    return null;
  }
  return {
    ...project,
    id: project._id.toString(),
  };
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

/**
 * Update project by ID
 */
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

/**
 * Approve or reject project by ID
 */
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

  // Notify project owner about approval/rejection
  try {
    await NotificationServices.createNotification({
      userId: project.ownerId,
      senderId: approvedBy,
      type: "project_approved",
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

/**
 * Delete project by ID
 */
const deleteProject = async (id: string): Promise<boolean> => {
  const result = await Project.findByIdAndDelete(id);
  return !!result;
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
};
