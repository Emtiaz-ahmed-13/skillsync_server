import { IMilestone } from "../interfaces/milestone.interface";
import { Milestone } from "../models/milestone.model";
import ApiError from "../utils/ApiError";
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
}
const deleteMilestone = async (id: string, userId: string): Promise<boolean> => {
  const result = await Milestone.findByIdAndDelete(id);
  return !!result;
};
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
const createMilestone = async (milestoneData: Partial<IMilestone>): Promise<IMilestone> => {
  const milestone = await Milestone.create(milestoneData);
  return {
    ...milestone.toObject(),
    id: milestone._id.toString(),
  };
};
const getMilestonesByProjectId = async (projectId: string): Promise<IMilestone[]> => {
  const milestones = await Milestone.find({ projectId }).sort({ order: 1, createdAt: 1 }).lean();

  return milestones.map((milestone) => ({
    ...milestone,
    id: milestone._id.toString(),
  }));
};

const approveMilestone = async (
  id: string,
  userId: string,
): Promise<IMilestone | null> => {
  const milestone = await Milestone.findByIdAndUpdate(
    id,
    {
      $set: {
        status: "completed",
        approvedBy: userId,
        approvedAt: new Date(),
      }
    },
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

const requestPayment = async (id: string): Promise<IMilestone | null> => {
  const milestone = await Milestone.findByIdAndUpdate(
    id,
    { $set: { status: "paid" } },
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

export const MilestoneServices = {
  getMilestoneById,
  updateMilestone,
  deleteMilestone,
  completeMilestone,
  createMilestone,
  getMilestonesByProjectId,
  approveMilestone,
  requestPayment,
};
