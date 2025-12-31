import { Bid } from "../models/bid.model";
import { Project } from "../models/project.model";
import ApiError from "../utils/ApiError";

const createBid = async (payload: {
  projectId: string;
  freelancerId: string;
  amount: number;
  proposal: string;
}) => {

  const project = await Project.findById(payload.projectId);
  if (!project) {
    throw new ApiError(404, "Project not found");
  }


  if (project.status !== "approved") {
    throw new ApiError(400, "Cannot bid on unapproved projects");
  }

  
  if (project.ownerId.toString() === payload.freelancerId) {
    throw new ApiError(400, "Cannot bid on your own project");
  }

  if (payload.amount < project.minimumBid) {
    throw new ApiError(400, `Bid amount must be at least ${project.minimumBid}`);
  }
  const existingBid = await Bid.findOne({
    projectId: payload.projectId,
    freelancerId: payload.freelancerId,
  });

  if (existingBid) {
    throw new ApiError(400, "You have already placed a bid on this project");
  }
  const bid = await Bid.create(payload);

  const bidObj = bid.toObject();
  return bidObj;
};

const getProjectBids = async (projectId: string) => {
  const bids = await Bid.find({ projectId })
    .populate("freelancerId", "name email")
    .sort({ amount: 1 }) 
    .lean();

  return bids.map((bid) => ({
    _id: bid._id || bid.id,
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
    .sort({ createdAt: -1 })
    .lean();

  return bids.map((bid) => ({
    _id: bid._id || bid.id,
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

  const bid = await Bid.findById(bidId).populate("projectId");
  if (!bid) {
    throw new ApiError(404, "Bid not found");
  }
  const project = bid.projectId as any;
  if (project.ownerId.toString() !== userId) {
    throw new ApiError(403, "Only project owners can update bid status");
  }

  if (status === "accepted") {
    await Bid.updateMany(
      { projectId: bid.projectId, _id: { $ne: bid._id } },
      { status: "rejected" },
    );
     await Project.findByIdAndUpdate(bid.projectId, { status: "in-progress" });
  
  }
  bid.status = status;
  await bid.save();
  try {
      const Notification = (await import("../models/notification.model")).Notification;
      await Notification.create({
          userId: bid.freelancerId, 
          senderId: userId, 
          type: status === "accepted" ? "bid_accepted" : "bid_rejected",
          title: status === "accepted" ? "Bid Accepted" : "Bid Rejected",
          message: status === "accepted" 
            ? `Your bid for project "${project.title}" has been accepted!` 
            : `Your bid for project "${project.title}" has been rejected.`,
          projectId: bid.projectId,
          metadata: {
              bidId: bid._id,
              projectId: bid.projectId
          }
      });
  } catch(error) {
      console.error("Failed to send notification", error);
  }

  const bidObj = bid.toObject();
  return bidObj;
};

const deleteBid = async (bidId: string, userId: string) => {
  const bid = await Bid.findById(bidId);
  if (!bid) {
    throw new ApiError(404, "Bid not found");
  }

  if (bid.freelancerId.toString() !== userId) {
    throw new ApiError(403, "You can only delete your own bids");
  }

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
