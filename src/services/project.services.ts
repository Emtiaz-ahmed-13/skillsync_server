import { IMilestone } from "../interfaces/project.interface";
import { ActivityLog } from "../models/activityLog.model";
import { Bid } from "../models/bid.model";
import { Milestone } from "../models/milestone.model";
import { Project } from "../models/project.model";
import { User } from "../models/user.model";
import ApiError from "../utils/ApiError";
import { AdminServices } from "./admin.services";
import { NotificationServices } from "./notification.services";

type CreateProjectPayload = {
  title: string;
  description?: string;
  ownerId: string;
  status?: "pending" | "in_progress" | "completed" | "cancelled";
  budget?: number;
  minBidAmount?: number;
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
  budget?: number;
  minBidAmount?: number;
};

type UpdateMilestonePayload = {
  title?: string;
  description?: string;
  dueDate?: Date;
  completed?: boolean;
  order?: number;
};

type PlaceBidPayload = {
  amount: number;
  proposal: string;
};

/**
 * Create a new project (ADMIN only)
 */
const createProject = async (payload: CreateProjectPayload, actorId: string) => {
  const { title, description, ownerId, status = "pending", budget, minBidAmount } = payload;

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
    budget,
    minBidAmount,
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

  // Send notifications to all admins about the new project
  try {
    // Get all admins
    const adminResponse = await AdminServices.getAllUsers(100, 1, "admin");
    const admins = adminResponse.users;

    // Send notification to each admin
    for (const admin of admins) {
      await NotificationServices.createNotification({
        userId: admin.id.toString(),
        senderId: actorId,
        type: "project_created",
        title: "New Project Created",
        message: `A new project "${project.title}" has been created by ${owner.name} and is pending approval.`,
        projectId: project._id.toString(),
      });
    }
  } catch (error) {
    // Log error but don't fail the project creation
    console.error("Failed to send admin notifications:", error);
  }

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
  if (filters.assignedFreelancerId) query.assignedFreelancerId = filters.assignedFreelancerId;

  // Get projects with pagination
  const projects = await Project.find(query)
    .populate("ownerId", "name email avatar role")
    .populate("assignedFreelancerId", "name email avatar role")
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
      budget: project.budget,
      minBidAmount: project.minBidAmount,
      ownerId: project.ownerId,
      assignedFreelancerId: project.assignedFreelancerId,
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
    .populate("assignedFreelancerId", "name email avatar role")
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
      budget: project.budget,
      minBidAmount: project.minBidAmount,
      ownerId: project.ownerId,
      assignedFreelancerId: project.assignedFreelancerId,
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
  const project = await Project.findById(projectId)
    .populate("ownerId", "name email avatar role")
    .populate("assignedFreelancerId", "name email avatar role");

  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  // Get all milestones for this project, ordered by order field
  const milestones = await Milestone.find({ projectId }).sort({ order: 1, createdAt: 1 }).lean();

  // Get all bids for this project
  const bids = await Bid.find({ projectId })
    .populate("freelancerId", "name email avatar role")
    .lean();

  // Convert project to plain object
  const projectObj = project.toObject ? project.toObject() : project;

  return {
    project: {
      id: projectObj._id || projectObj.id,
      title: projectObj.title,
      description: projectObj.description,
      status: projectObj.status,
      budget: projectObj.budget,
      minBidAmount: projectObj.minBidAmount,
      ownerId: projectObj.ownerId,
      assignedFreelancerId: projectObj.assignedFreelancerId,
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
    bids: bids.map((b) => ({
      id: b._id || b.id,
      projectId: b.projectId,
      freelancerId: b.freelancerId,
      amount: b.amount,
      proposal: b.proposal,
      status: b.status,
      createdAt: b.createdAt,
      updatedAt: b.updatedAt,
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

  // Delete all bids associated with this project
  await Bid.deleteMany({ projectId });

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
  const project = await Project.findById(projectId)
    .populate("ownerId", "name email avatar role")
    .populate("assignedFreelancerId", "name email avatar role");

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

  // Get all bids for this project
  const bids = await Bid.find({ projectId })
    .populate("freelancerId", "name email avatar role")
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
      budget: projectObj.budget,
      minBidAmount: projectObj.minBidAmount,
      ownerId: projectObj.ownerId,
      assignedFreelancerId: projectObj.assignedFreelancerId,
      createdAt: projectObj.createdAt,
      updatedAt: projectObj.updatedAt,
    },
    owner: projectObj.ownerId,
    assignedFreelancer: projectObj.assignedFreelancerId,
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
    bids: bids.map((b) => ({
      id: b._id || b.id,
      projectId: b.projectId,
      freelancerId: b.freelancerId,
      amount: b.amount,
      proposal: b.proposal,
      status: b.status,
      createdAt: b.createdAt,
      updatedAt: b.updatedAt,
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
      totalBids: bids.length,
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

/**
 * Place a bid on a project
 */
const placeBid = async (projectId: string, payload: PlaceBidPayload, freelancerId: string) => {
  const { amount, proposal } = payload;

  // Verify project exists
  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  // Check if project is accepting bids
  if (project.status !== "pending") {
    throw new ApiError(400, "Project is not accepting bids");
  }

  // Check if freelancer has already placed a bid
  const existingBid = await Bid.findOne({ projectId, freelancerId });
  if (existingBid) {
    throw new ApiError(400, "You have already placed a bid on this project");
  }

  // Check if bid meets minimum requirement
  if (project.minBidAmount && amount < project.minBidAmount) {
    throw new ApiError(400, `Bid amount must be at least ${project.minBidAmount}`);
  }

  // Create bid
  const bid = await Bid.create({
    projectId,
    freelancerId,
    amount,
    proposal,
  });

  // Create activity log
  await ActivityLog.create({
    projectId,
    actorId: freelancerId,
    type: "bid_placed",
    payload: {
      bidId: bid._id,
      amount: bid.amount,
    },
  });

  const bidObj = bid.toObject();
  return bidObj;
};

/**
 * Get all bids for a project
 */
const getProjectBids = async (projectId: string) => {
  // Verify project exists
  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  // Get all bids for this project
  const bids = await Bid.find({ projectId })
    .populate("freelancerId", "name email avatar role")
    .lean();

  return bids.map((b) => ({
    id: b._id || b.id,
    projectId: b.projectId,
    freelancerId: b.freelancerId,
    amount: b.amount,
    proposal: b.proposal,
    status: b.status,
    createdAt: b.createdAt,
    updatedAt: b.updatedAt,
  }));
};

/**
 * Accept a bid and assign freelancer to project
 */
const acceptBid = async (projectId: string, bidId: string, ownerId: string) => {
  // Verify project exists and user is the owner
  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  if (project.ownerId.toString() !== ownerId) {
    throw new ApiError(403, "Only project owner can accept bids");
  }

  // Verify bid exists
  const bid = await Bid.findById(bidId).populate("freelancerId");
  if (!bid) {
    throw new ApiError(404, "Bid not found");
  }

  if (bid.projectId.toString() !== projectId) {
    throw new ApiError(400, "Bid does not belong to this project");
  }

  // Update bid status to accepted
  bid.status = "accepted";
  await bid.save();

  // Reject all other bids for this project
  await Bid.updateMany({ projectId, _id: { $ne: bidId } }, { status: "rejected" });

  // Assign freelancer to project
  project.assignedFreelancerId = bid.freelancerId._id;
  project.status = "in_progress";
  await project.save();

  // Create activity logs
  await ActivityLog.create({
    projectId,
    actorId: ownerId,
    type: "bid_accepted",
    payload: {
      bidId: bid._id,
      freelancerId: bid.freelancerId._id,
      amount: bid.amount,
    },
  });

  await ActivityLog.create({
    projectId,
    actorId: ownerId,
    type: "freelancer_assigned",
    payload: {
      freelancerId: bid.freelancerId._id,
      freelancerName: (bid.freelancerId as any).name,
    },
  });

  return {
    message: "Bid accepted and freelancer assigned to project",
    project: project.toObject(),
    bid: bid.toObject(),
  };
};

/**
 * Get freelancer's bids
 */
const getFreelancerBids = async (freelancerId: string) => {
  const bids = await Bid.find({ freelancerId })
    .populate("projectId", "title description status")
    .lean();

  return bids.map((b) => ({
    id: b._id || b.id,
    projectId: b.projectId,
    freelancerId: b.freelancerId,
    amount: b.amount,
    proposal: b.proposal,
    status: b.status,
    createdAt: b.createdAt,
    updatedAt: b.updatedAt,
  }));
};

/**
 * Complete a milestone
 */
const completeMilestone = async (milestoneId: string, actorId: string) => {
  // Verify milestone exists
  const milestone = await Milestone.findById(milestoneId);
  if (!milestone) {
    throw new ApiError(404, "Milestone not found");
  }

  // Update milestone to completed
  milestone.completed = true;
  const updatedMilestone = await milestone.save();

  // Create activity log for milestone completion
  await ActivityLog.create({
    projectId: updatedMilestone.projectId,
    actorId,
    type: "milestone_completed",
    payload: {
      milestoneId: updatedMilestone._id,
      title: updatedMilestone.title,
    },
  });

  const milestoneObj = updatedMilestone.toObject();
  return milestoneObj;
};

/**
 * Approve a project (change status from pending to in_progress)
 */
const approveProject = async (projectId: string, actorId: string) => {
  // Verify project exists
  const project = await Project.findById(projectId);
  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  // Check if project is in pending status
  if (project.status !== "pending") {
    throw new ApiError(400, "Project is not in pending status");
  }

  // Update project status to in_progress
  project.status = "in_progress";
  const updatedProject = await project.save();

  // Create activity log for project approval
  await ActivityLog.create({
    projectId: updatedProject._id,
    actorId,
    type: "project_status_changed",
    payload: {
      title: updatedProject.title,
      oldStatus: "pending",
      newStatus: "in_progress",
    },
  });

  // Send notification to project owner about approval
  try {
    const owner = await User.findById(project.ownerId);
    if (owner) {
      await NotificationServices.createNotification({
        userId: owner._id.toString(),
        senderId: actorId,
        type: "project_updated",
        title: "Project Approved",
        message: `Your project "${project.title}" has been approved and is now in progress.`,
        projectId: project._id.toString(),
      });
    }
  } catch (error) {
    // Log error but don't fail the project approval
    console.error("Failed to send owner notification:", error);
  }

  const projectObj = updatedProject.toObject();
  return projectObj;
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
  placeBid,
  getProjectBids,
  acceptBid,
  getFreelancerBids,
  completeMilestone,
  approveProject,
};
