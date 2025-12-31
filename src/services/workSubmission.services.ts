import { Project } from "../models/project.model";
import { Sprint } from "../models/sprint.model";
import { User } from "../models/user.model";
import { WorkSubmission } from "../models/workSubmission.model";
import ApiError from "../utils/ApiError";

const createWorkSubmission = async (payload: any) => {
  const project = await Project.findById(payload.projectId);
  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  const sprint = await Sprint.findById(payload.sprintId);
  if (!sprint) {
    throw new ApiError(404, "Sprint not found");
  }

  const freelancer = await User.findById(payload.freelancerId);
  if (!freelancer) {
    throw new ApiError(404, "Freelancer not found");
  }

  const workSubmission = await WorkSubmission.create(payload);
  return {
    ...workSubmission.toObject(),
    id: workSubmission._id,
  };
};

const getWorkSubmissionsByProject = async (projectId: string) => {
  const workSubmissions = await WorkSubmission.find({ projectId })
    .populate("sprintId", "title")
    .populate("freelancerId", "name email")
    .sort({ createdAt: -1 })
    .lean();

  return workSubmissions.map((workSubmission) => ({
    ...workSubmission,
    id: workSubmission._id.toString(),
  }));
};

const getWorkSubmissionsBySprint = async (sprintId: string) => {
  const workSubmissions = await WorkSubmission.find({ sprintId })
    .populate("projectId", "title")
    .populate("freelancerId", "name email")
    .sort({ createdAt: -1 })
    .lean();

  return workSubmissions.map((workSubmission) => ({
    ...workSubmission,
    id: workSubmission._id.toString(),
  }));
};

const getWorkSubmissionsByFreelancer = async (freelancerId: string) => {
  const workSubmissions = await WorkSubmission.find({ freelancerId })
    .populate("projectId", "title")
    .populate("sprintId", "title")
    .sort({ createdAt: -1 })
    .lean();

  return workSubmissions.map((workSubmission) => ({
    ...workSubmission,
    id: workSubmission._id.toString(),
  }));
};

const getWorkSubmissionById = async (workSubmissionId: string) => {
  const workSubmission = await WorkSubmission.findById(workSubmissionId)
    .populate("projectId", "title")
    .populate("sprintId", "title")
    .populate("freelancerId", "name email")
    .lean();

  if (!workSubmission) {
    throw new ApiError(404, "Work submission not found");
  }

  return {
    ...workSubmission,
    id: workSubmission._id.toString(),
  };
};

const updateWorkSubmission = async (workSubmissionId: string, payload: any) => {
  const workSubmission = await WorkSubmission.findByIdAndUpdate(
    workSubmissionId,
    { $set: payload },
    { new: true, runValidators: true },
  )
    .populate("projectId", "title")
    .populate("sprintId", "title")
    .populate("freelancerId", "name email")
    .lean();

  if (!workSubmission) {
    throw new ApiError(404, "Work submission not found");
  }

  return {
    ...workSubmission,
    id: workSubmission._id.toString(),
  };
};

const updateWorkSubmissionStatus = async (workSubmissionId: string, status: string) => {
  const validStatuses = ["pending", "review", "approved", "rejected"];
  if (!validStatuses.includes(status)) {
    throw new ApiError(400, "Invalid status value");
  }

  const workSubmission = await WorkSubmission.findByIdAndUpdate(
    workSubmissionId,
    { status },
    { new: true, runValidators: true },
  )
    .populate("projectId", "title")
    .populate("sprintId", "title")
    .populate("freelancerId", "name email")
    .lean();

  if (!workSubmission) {
    throw new ApiError(404, "Work submission not found");
  }

  return {
    ...workSubmission,
    id: workSubmission._id.toString(),
  };
};

const deleteWorkSubmission = async (workSubmissionId: string) => {
  const workSubmission = await WorkSubmission.findByIdAndDelete(workSubmissionId);

  if (!workSubmission) {
    throw new ApiError(404, "Work submission not found");
  }

  return { message: "Work submission deleted successfully" };
};

export const WorkSubmissionServices = {
  createWorkSubmission,
  getWorkSubmissionsByProject,
  getWorkSubmissionsBySprint,
  getWorkSubmissionsByFreelancer,
  getWorkSubmissionById,
  updateWorkSubmission,
  updateWorkSubmissionStatus,
  deleteWorkSubmission,
};
