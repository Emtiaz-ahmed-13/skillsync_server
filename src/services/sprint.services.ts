import { Project } from "../models/project.model";
import { Sprint } from "../models/sprint.model";
import { Task } from "../models/task.model";
import ApiError from "../utils/ApiError";

const createSprint = async (payload: any) => {
  const project = await Project.findById(payload.projectId);
  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  const sprint = await Sprint.create(payload);
  return {
    ...sprint.toObject(),
    id: sprint._id.toString(),
  };
};

const getSprintsByProject = async (projectId: string) => {
  const sprints = await Sprint.find({ projectId }).sort({ startDate: 1 }).lean();

  return sprints.map((sprint) => ({
    ...sprint,
    id: sprint._id.toString(),
  }));
};

const getSprintById = async (sprintId: string) => {
  const sprint = await Sprint.findById(sprintId).lean();

  if (!sprint) {
    throw new ApiError(404, "Sprint not found");
  }

  return {
    ...sprint,
    id: sprint._id.toString(),
  };
};

const updateSprint = async (sprintId: string, payload: any) => {
  const sprint = await Sprint.findByIdAndUpdate(
    sprintId,
    { $set: payload },
    { new: true, runValidators: true },
  ).lean();

  if (!sprint) {
    throw new ApiError(404, "Sprint not found");
  }

  return {
    ...sprint,
    id: sprint._id.toString(),
  };
};

const deleteSprint = async (sprintId: string) => {
  // First delete all tasks associated with this sprint
  await Task.deleteMany({ sprintId });

  // Then delete the sprint
  const sprint = await Sprint.findByIdAndDelete(sprintId);

  if (!sprint) {
    throw new ApiError(404, "Sprint not found");
  }

  return { message: "Sprint deleted successfully" };
};

export const SprintServices = {
  createSprint,
  getSprintsByProject,
  getSprintById,
  updateSprint,
  deleteSprint,
};
