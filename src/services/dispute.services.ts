import { Dispute } from "../models/dispute.model";
import { Project } from "../models/project.model";
import ApiError from "../utils/ApiError";

const createDispute = async (payload: {
  projectId: string;
  reportedBy: string;
  reason: string;
  againstUser?: string;
}) => {
  const project = await Project.findById(payload.projectId);
  if (!project) throw new ApiError(404, "Project not found");

  const ownerId = project.ownerId.toString();
  if (ownerId !== payload.reportedBy && project.freelancerId?.toString() !== payload.reportedBy) {
    throw new ApiError(403, "You are not part of this project");
  }

  const dispute = await Dispute.create({
    ...payload,
    againstUser:
      payload.againstUser ||
      (ownerId === payload.reportedBy ? project.freelancerId : project.ownerId),
  });

  return dispute.toObject();
};

const getDisputes = async (limit = 10, page = 1, status?: string) => {
  const skip = (page - 1) * limit;
  const query: Record<string, string> = {};
  if (status) query.status = status;

  const [disputes, total] = await Promise.all([
    Dispute.find(query)
      .populate("projectId", "title")
      .populate("reportedBy", "name email")
      .populate("againstUser", "name email")
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .lean(),
    Dispute.countDocuments(query),
  ]);

  return {
    disputes,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalDisputes: total,
    },
  };
};

const resolveDispute = async (
  disputeId: string,
  adminId: string,
  resolution: "resolved" | "dismissed",
  note?: string,
) => {
  const dispute = await Dispute.findByIdAndUpdate(
    disputeId,
    {
      $set: {
        status: resolution,
        resolution: note || resolution,
        resolvedBy: adminId,
        resolvedAt: new Date(),
      },
    },
    { new: true },
  )
    .populate("projectId", "title")
    .populate("reportedBy", "name email")
    .populate("againstUser", "name email");

  if (!dispute) throw new ApiError(404, "Dispute not found");
  return dispute.toObject();
};

export const DisputeServices = { createDispute, getDisputes, resolveDispute };
