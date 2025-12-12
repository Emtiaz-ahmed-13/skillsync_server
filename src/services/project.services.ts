import { IMilestone } from "../interfaces/project.interface";
import { ActivityLog } from "../models/activityLog.model";
import { Milestone } from "../models/milestone.model";
import { Project } from "../models/project.model";
import { User } from "../models/user.model";
import ApiError from "../utils/ApiError";

type CreateProjectPayload = {
  title: string;
  description?: string;
  ownerId: string;
  status?: "pending" | "in_progress" | "completed" | "cancelled";
};

type AddMilestonePayload = {
  title: string;
  description?: string;
  dueDate?: Date;
  order?: number;
};

type UpdateProjectPayload = {
  title?: string;
  description?: string;
  status?: "pending" | "in_progress" | "completed" | "cancelled";
};

type UpdateMilestonePayload = {
  title?: string;
  description?: string;
  dueDate?: Date;
  completed?: boolean;
  order?: number;
};

/**
 * Create a new project (ADMIN only)
 */
const createProject = async (payload: CreateProjectPayload, actorId: string) => {
  const { title, description, ownerId, status = "pending" } = payload;

  // Verify owner exists
  const owner = await User.findById(ownerId);
  if (!owner) {
    throw new ApiError(404, "Owner not found");
  }

  // Create project
  const project = await Project.create({
    title,
    description,
    ownerId,
    status,
  });

  // Create activity log for project creation
  await ActivityLog.create({
    projectId: project._id,
    actorId,
    type: "project_created",
    payload: {
      title: project.title,
      status: project.status,
    },
  });

  const projectObj = project.toObject();
  return projectObj;
};

/**
 * Get all projects with optional filtering
 */
const getAllProjects = async (filters: any = {}, limit: number = 10, page: number = 1) => {
  const skip = (page - 1) * limit;

  // Build query based on filters
  const query: any = {};
  if (filters.ownerId) query.ownerId = filters.ownerId;
  if (filters.status) query.status = filters.status;

  // Get projects with pagination
  const projects = await Project.find(query)
    .populate("ownerId", "name email avatar role")
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip)
    .lean();

  // Get total count for pagination
  const total = await Project.countDocuments(query);

  return {
    projects: projects.map((project) => ({
      id: project._id || project.id,
      title: project.title,
      description: project.description,
      status: project.status,
      ownerId: project.ownerId,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
    })),
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalProjects: total,
      hasNextPage: page < Math.ceil(total / limit),
      hasPrevPage: page > 1,
    },
  };
};

/**
 * Search projects by title or description
 */
const searchProjects = async (
  searchTerm: string,
  filters: any = {},
  limit: number = 10,
  page: number = 1,
) => {
  const skip = (page - 1) * limit;

  // Build query based on search term and filters
  const query: any = { ...filters };

  if (searchTerm) {
    query.$or = [
      { title: { $regex: searchTerm, $options: "i" } },
      { description: { $regex: searchTerm, $options: "i" } },
    ];
  }

  // Get projects with pagination
  const projects = await Project.find(query)
    .populate("ownerId", "name email avatar role")
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip)
    .lean();

  // Get total count for pagination
  const total = await Project.countDocuments(query);

  return {
    projects: projects.map((project) => ({
      id: project._id || project.id,
      title: project.title,
      description: project.description,
      status: project.status,
      ownerId: project.ownerId,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
    })),
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalProjects: total,
      hasNextPage: page < Math.ceil(total / limit),
      hasPrevPage: page > 1,
    },
  };
};

/**
 * Get a specific project by ID
 */
const getProjectById = async (projectId: string) => {
  const project = await Project.findById(projectId).populate("ownerId", "name email avatar role");

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  // Get all milestones for this project, ordered by order field
  const milestones = await Milestone.find({ projectId }).sort({ order: 1, createdAt: 1 }).lean();

  // Convert project to plain object
  const projectObj = project.toObject ? project.toObject() : project;

  return {
    project: {
      id: projectObj._id || projectObj.id,
      title: projectObj.title,
      description: projectObj.description,
      status: projectObj.status,
      ownerId: projectObj.ownerId,
      createdAt: projectObj.createdAt,
      updatedAt: projectObj.updatedAt,
    },
    milestones: milestones.map((m) => ({
      id: m._id || m.id,
      projectId: m.projectId,
      title: m.title,
      description: m.description,
      dueDate: m.dueDate,
      completed: m.completed,
      order: m.order,
      createdAt: m.createdAt,
      updatedAt: m.updatedAt,
    })),
  };
};

/**
 * Get all milestones for a project
 */
const getProjectMilestones = async (projectId: string) => {
  // Verify project exists
  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  // Get all milestones for this project, ordered by order field
  const milestones = await Milestone.find({ projectId }).sort({ order: 1, createdAt: 1 }).lean();

  return milestones.map((m) => ({
    id: m._id || m.id,
    projectId: m.projectId,
    title: m.title,
    description: m.description,
    dueDate: m.dueDate,
    completed: m.completed,
    order: m.order,
    createdAt: m.createdAt,
    updatedAt: m.updatedAt,
  }));
};

/**
 * Get a specific milestone by ID
 */
const getMilestoneById = async (milestoneId: string) => {
  const milestone = await Milestone.findById(milestoneId).populate("projectId", "title");

  if (!milestone) {
    throw new ApiError(404, "Milestone not found");
  }

  const milestoneObj = milestone.toObject ? milestone.toObject() : milestone;

  return {
    id: milestoneObj._id || milestoneObj.id,
    projectId: milestoneObj.projectId,
    title: milestoneObj.title,
    description: milestoneObj.description,
    dueDate: milestoneObj.dueDate,
    completed: milestoneObj.completed,
    order: milestoneObj.order,
    createdAt: milestoneObj.createdAt,
    updatedAt: milestoneObj.updatedAt,
  };
};

/**
 * Update a milestone by ID
 */
const updateMilestone = async (
  milestoneId: string,
  payload: UpdateMilestonePayload,
  actorId: string,
) => {
  // Verify milestone exists
  const milestone = await Milestone.findById(milestoneId);
  if (!milestone) {
    throw new ApiError(404, "Milestone not found");
  }

  // Update milestone
  const updatedMilestone = await Milestone.findByIdAndUpdate(
    milestoneId,
    { $set: payload },
    { new: true, runValidators: true },
  );

  if (!updatedMilestone) {
    throw new ApiError(500, "Failed to update milestone");
  }

  // Create activity log for milestone update
  await ActivityLog.create({
    projectId: updatedMilestone.projectId,
    actorId,
    type: "milestone_updated",
    payload: {
      milestoneId: updatedMilestone._id,
      title: updatedMilestone.title,
      completed: updatedMilestone.completed,
    },
  });

  const milestoneObj = updatedMilestone.toObject();
  return milestoneObj;
};

/**
 * Delete a milestone by ID
 */
const deleteMilestone = async (milestoneId: string, actorId: string) => {
  // Verify milestone exists
  const milestone = await Milestone.findById(milestoneId);
  if (!milestone) {
    throw new ApiError(404, "Milestone not found");
  }

  // Delete the milestone
  const deletedMilestone = await Milestone.findByIdAndDelete(milestoneId);

  if (!deletedMilestone) {
    throw new ApiError(500, "Failed to delete milestone");
  }

  // Create activity log for milestone deletion
  await ActivityLog.create({
    projectId: deletedMilestone.projectId,
    actorId,
    type: "milestone_deleted",
    payload: {
      milestoneId: deletedMilestone._id,
      title: deletedMilestone.title,
    },
  });

  return { message: "Milestone deleted successfully" };
};

/**
 * Bulk update milestones (e.g., for reordering or status updates)
 */
const bulkUpdateMilestones = async (
  milestoneUpdates: { id: string; updates: Partial<UpdateMilestonePayload> }[],
  actorId: string,
) => {
  const results: IMilestone[] = [];

  for (const update of milestoneUpdates) {
    const { id, updates } = update;

    // Verify milestone exists
    const milestone = await Milestone.findById(id);
    if (!milestone) {
      throw new ApiError(404, `Milestone with ID ${id} not found`);
    }

    // Update milestone
    const updatedMilestone = await Milestone.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: true },
    );

    if (!updatedMilestone) {
      throw new ApiError(500, `Failed to update milestone with ID ${id}`);
    }

    // Create activity log for milestone update
    await ActivityLog.create({
      projectId: updatedMilestone.projectId,
      actorId,
      type: "milestone_updated",
      payload: {
        milestoneId: updatedMilestone._id,
        title: updatedMilestone.title,
        updates: updates,
      },
    });

    results.push(
      updatedMilestone.toObject
        ? updatedMilestone.toObject()
        : (updatedMilestone as unknown as IMilestone),
    );
  }

  return results;
};

/**
 * Update a project by ID
 */
const updateProject = async (projectId: string, payload: UpdateProjectPayload, actorId: string) => {
  // Verify project exists
  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  // Update project
  const updatedProject = await Project.findByIdAndUpdate(
    projectId,
    { $set: payload },
    { new: true, runValidators: true },
  );

  if (!updatedProject) {
    throw new ApiError(500, "Failed to update project");
  }

  // Create activity log for project update
  await ActivityLog.create({
    projectId: updatedProject._id,
    actorId,
    type: "project_updated",
    payload: {
      title: updatedProject.title,
      status: updatedProject.status,
    },
  });

  const projectObj = updatedProject.toObject();
  return projectObj;
};

/**
 * Delete a project by ID
 */
const deleteProject = async (projectId: string, actorId: string) => {
  // Verify project exists
  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  // Delete all milestones associated with this project
  await Milestone.deleteMany({ projectId });

  // Delete all activity logs associated with this project
  await ActivityLog.deleteMany({ projectId });

  // Delete the project
  const deletedProject = await Project.findByIdAndDelete(projectId);

  if (!deletedProject) {
    throw new ApiError(500, "Failed to delete project");
  }

  // Create activity log for project deletion
  await ActivityLog.create({
    projectId: deletedProject._id,
    actorId,
    type: "project_deleted",
    payload: {
      title: deletedProject.title,
    },
  });

  return { message: "Project deleted successfully" };
};

/**
 * Get project dashboard with consolidated data
 */
const getDashboard = async (projectId: string) => {
  const project = await Project.findById(projectId).populate("ownerId", "name email avatar role");

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  // Get all milestones for this project, ordered by order field
  const milestones = await Milestone.find({ projectId }).sort({ order: 1, createdAt: 1 }).lean();

  // Get recent activities (last 10)
  const recentActivities = await ActivityLog.find({ projectId })
    .populate("actorId", "name email avatar")
    .sort({ createdAt: -1 })
    .limit(10)
    .lean();

  // Calculate stats
  const totalMilestones = milestones.length;
  const completedMilestones = milestones.filter((m) => m.completed).length;
  const completionRate = totalMilestones > 0 ? (completedMilestones / totalMilestones) * 100 : 0;

  // Convert project to plain object
  const projectObj = project.toObject ? project.toObject() : project;

  return {
    project: {
      id: projectObj._id || projectObj.id,
      title: projectObj.title,
      description: projectObj.description,
      status: projectObj.status,
      createdAt: projectObj.createdAt,
      updatedAt: projectObj.updatedAt,
    },
    owner: projectObj.ownerId,
    milestones: milestones.map((m) => ({
      id: m._id || m.id,
      projectId: m.projectId,
      title: m.title,
      description: m.description,
      dueDate: m.dueDate,
      completed: m.completed,
      order: m.order,
      createdAt: m.createdAt,
      updatedAt: m.updatedAt,
    })),
    recentActivities: recentActivities.map((a) => ({
      id: a._id || a.id,
      projectId: a.projectId,
      actorId: a.actorId,
      type: a.type,
      payload: a.payload,
      createdAt: a.createdAt,
    })),
    stats: {
      completionRate: Math.round(completionRate * 100) / 100, // Round to 2 decimal places
      totalMilestones,
      completedMilestones,
    },
  };
};

/**
 * Get all milestones for a specific user across all projects
 */
const getUserMilestones = async (
  userId: string,
  filters: any = {},
  limit: number = 10,
  page: number = 1,
) => {
  const skip = (page - 1) * limit;

  // Build query based on filters
  const query: any = { ...filters };

  // Find projects owned by the user to get their milestone IDs
  const userProjects = await Project.find({ ownerId: userId }).select("_id");
  const projectIds = userProjects.map((project) => project._id);

  // Add project filter if user has projects
  if (projectIds.length > 0) {
    query.projectId = { $in: projectIds };
  } else {
    // If user has no projects, return empty result
    return {
      milestones: [],
      pagination: {
        currentPage: page,
        totalPages: 0,
        totalMilestones: 0,
        hasNextPage: false,
        hasPrevPage: false,
      },
    };
  }

  // Get milestones with pagination
  const milestones = await Milestone.find(query)
    .populate("projectId", "title")
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip)
    .lean();

  // Get total count for pagination
  const total = await Milestone.countDocuments(query);

  return {
    milestones: milestones.map((milestone) => ({
      id: milestone._id || milestone.id,
      projectId: milestone.projectId,
      title: milestone.title,
      description: milestone.description,
      dueDate: milestone.dueDate,
      completed: milestone.completed,
      order: milestone.order,
      createdAt: milestone.createdAt,
      updatedAt: milestone.updatedAt,
    })),
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalMilestones: total,
      hasNextPage: page < Math.ceil(total / limit),
      hasPrevPage: page > 1,
    },
  };
};

/**
 * Add milestone to a project and log activity
 */
const addMilestone = async (projectId: string, payload: AddMilestonePayload, actorId: string) => {
  // Verify project exists
  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  // Get the highest order number for this project
  const lastMilestone = await Milestone.findOne({ projectId }).sort({ order: -1 }).lean();

  const order = payload.order !== undefined ? payload.order : (lastMilestone?.order ?? -1) + 1;

  // Create milestone
  const milestone = await Milestone.create({
    projectId,
    title: payload.title,
    description: payload.description,
    dueDate: payload.dueDate,
    completed: false,
    order,
  });

  // Create activity log
  await ActivityLog.create({
    projectId,
    actorId,
    type: "milestone_created",
    payload: {
      milestoneId: milestone._id,
      title: milestone.title,
      order: milestone.order,
    },
  });

  const milestoneObj = milestone.toObject();
  return milestoneObj;
};

export const ProjectServices = {
  createProject,
  getAllProjects,
  searchProjects,
  getProjectById,
  getProjectMilestones,
  getUserMilestones,
  getMilestoneById,
  updateMilestone,
  deleteMilestone,
  bulkUpdateMilestones,
  updateProject,
  deleteProject,
  getDashboard,
  addMilestone,
};
