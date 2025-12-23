import { Bid } from "../models/bid.model";
import { Project } from "../models/project.model";
import ApiError from "../utils/ApiError";

const createBid = async (payload: {
  projectId: string;
  freelancerId: string;
  amount: number;
  proposal: string;
}) => {
  // Check if project exists
  const project = await Project.findById(payload.projectId);
  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  // Check if project is approved
  if (project.status !== "approved") {
    throw new ApiError(400, "Cannot bid on unapproved projects");
  }

  // Check if freelancer is trying to bid on their own project
  if (project.ownerId.toString() === payload.freelancerId) {
    throw new ApiError(400, "Cannot bid on your own project");
  }

  // Check if bid amount meets minimum requirement
  if (payload.amount < project.minimumBid) {
    throw new ApiError(400, `Bid amount must be at least ${project.minimumBid}`);
  }

  // Check if freelancer has already bid on this project
  const existingBid = await Bid.findOne({
    projectId: payload.projectId,
    freelancerId: payload.freelancerId,
  });

  if (existingBid) {
    throw new ApiError(400, "You have already placed a bid on this project");
  }

  // Create the bid
  const bid = await Bid.create(payload);

  const bidObj = bid.toObject();
  return bidObj;
};

const getProjectBids = async (projectId: string) => {
  const bids = await Bid.find({ projectId })
    .populate("freelancerId", "name email")
    .sort({ amount: 1 }) // Sort by amount ascending
    .lean();

  return bids.map((bid) => ({
    id: bid._id || bid.id,
    projectId: bid.projectId,
    freelancerId: bid.freelancerId,
    amount: bid.amount,
    proposal: bid.proposal,
    status: bid.status,
    createdAt: bid.createdAt,
    updatedAt: bid.updatedAt,
  }));
};

const getUserBids = async (freelancerId: string) => {
  const bids = await Bid.find({ freelancerId })
    .populate("projectId", "title description budget")
    .sort({ createdAt: -1 }) // Sort by date descending
    .lean();

  return bids.map((bid) => ({
    id: bid._id || bid.id,
    projectId: bid.projectId,
    freelancerId: bid.freelancerId,
    amount: bid.amount,
    proposal: bid.proposal,
    status: bid.status,
    createdAt: bid.createdAt,
    updatedAt: bid.updatedAt,
  }));
};

const updateBidStatus = async (bidId: string, status: "accepted" | "rejected", userId: string) => {
  // Find the bid
  const bid = await Bid.findById(bidId).populate("projectId");
  if (!bid) {
    throw new ApiError(404, "Bid not found");
  }

  // Check if user is the project owner
  const project = bid.projectId as any;
  if (project.ownerId.toString() !== userId) {
    throw new ApiError(403, "Only project owners can update bid status");
  }

  // If accepting a bid, reject all other bids for this project
  if (status === "accepted") {
    await Bid.updateMany(
      { projectId: bid.projectId, _id: { $ne: bid._id } },
      { status: "rejected" },
    );
  }

  // Update bid status
  bid.status = status;
  await bid.save();

  const bidObj = bid.toObject();
  return bidObj;
};

const deleteBid = async (bidId: string, userId: string) => {
  const bid = await Bid.findById(bidId);
  if (!bid) {
    throw new ApiError(404, "Bid not found");
  }

  // Check if user is the bidder
  if (bid.freelancerId.toString() !== userId) {
    throw new ApiError(403, "You can only delete your own bids");
  }

  // Check if bid is already accepted
  if (bid.status === "accepted") {
    throw new ApiError(400, "Cannot delete an accepted bid");
  }

  await Bid.findByIdAndDelete(bidId);
  return { message: "Bid deleted successfully" };
};

export const BidServices = {
  createBid,
  getProjectBids,
  getUserBids,
  updateBidStatus,
  deleteBid,
};
