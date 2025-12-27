import { IMilestone } from "../interfaces/milestone.interface";
import { Milestone } from "../models/milestone.model";
import ApiError from "../utils/ApiError";

/**
 * Get milestone by ID
 */
const getMilestoneById = async (id: string): Promise<IMilestone | null> => {
  const milestone = await Milestone.findById(id).lean();
  if (!milestone) {
    return null;
  }
  return {
    ...milestone,
    id: milestone._id.toString(),
  };
};

/**
 * Update milestone by ID
 */
const updateMilestone = async (
  id: string,
  updateData: Partial<IMilestone>,
  userId: string,
): Promise<IMilestone | null> => {
  const milestone = await Milestone.findByIdAndUpdate(
    id,
    { $set: updateData },
    { new: true, runValidators: true },
  ).lean();

  if (!milestone) {
    throw new ApiError(404, "Milestone not found");
  }

  return {
    ...milestone,
    id: milestone._id.toString(),
  };
};

/**
 * Delete milestone by ID
 */
const deleteMilestone = async (id: string, userId: string): Promise<boolean> => {
  const result = await Milestone.findByIdAndDelete(id);
  return !!result;
};

/**
 * Complete milestone by ID
 */
const completeMilestone = async (id: string, userId: string): Promise<IMilestone | null> => {
  const milestone = await Milestone.findByIdAndUpdate(
    id,
    { $set: { completed: true, completedAt: new Date() } },
    { new: true, runValidators: true },
  ).lean();

  if (!milestone) {
    throw new ApiError(404, "Milestone not found");
  }

  return {
    ...milestone,
    id: milestone._id.toString(),
  };
};

/**
 * Create milestone
 */
const createMilestone = async (milestoneData: Partial<IMilestone>): Promise<IMilestone> => {
  const milestone = await Milestone.create(milestoneData);
  return {
    ...milestone.toObject(),
    id: milestone._id.toString(),
  };
};

/**
 * Get milestones by project ID
 */
const getMilestonesByProjectId = async (projectId: string): Promise<IMilestone[]> => {
  const milestones = await Milestone.find({ projectId }).sort({ order: 1, createdAt: 1 }).lean();

  return milestones.map((milestone) => ({
    ...milestone,
    id: milestone._id.toString(),
  }));
};

export const MilestoneServices = {
  getMilestoneById,
  updateMilestone,
  deleteMilestone,
  completeMilestone,
  createMilestone,
  getMilestonesByProjectId,
};
