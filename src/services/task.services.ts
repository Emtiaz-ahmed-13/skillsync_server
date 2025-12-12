import { TaskStatus } from "../interfaces/task.interface";
import { Project } from "../models/project.model";
import { Task } from "../models/task.model";
import { User } from "../models/user.model";
import ApiError from "../utils/ApiError";

type CreateTaskPayload = {
  title: string;
  description?: string;
  projectId: string;
  milestoneId?: string;
  assignedTo?: string;
  createdBy: string;
  priority?: "low" | "medium" | "high";
  dueDate?: Date;
  estimatedHours?: number;
  tags?: string[];
};

type UpdateTaskPayload = {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: "low" | "medium" | "high";
  dueDate?: Date;
  estimatedHours?: number;
  loggedHours?: number;
  tags?: string[];
  assignedTo?: string;
};

const createTask = async (payload: CreateTaskPayload) => {
  // Verify project exists
  const project = await Project.findById(payload.projectId);
  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  // Verify assigned user exists (if provided)
  if (payload.assignedTo) {
    const user = await User.findById(payload.assignedTo);
    if (!user) {
      throw new ApiError(404, "Assigned user not found");
    }
  }

  const task = await Task.create(payload);

  const taskObj = task.toObject();
  return taskObj;
};

const getTaskById = async (taskId: string) => {
  const task = await Task.findById(taskId)
    .populate("projectId", "title")
    .populate("milestoneId", "title")
    .populate("assignedTo", "name email avatar")
    .populate("createdBy", "name email avatar");

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  const taskObj = task.toObject();
  return taskObj;
};

const getProjectTasks = async (
  projectId: string,
  filters: any = {},
  limit: number = 10,
  page: number = 1,
) => {
  const skip = (page - 1) * limit;

  // Build query based on filters
  const query: any = { projectId, ...filters };

  const tasks = await Task.find(query)
    .populate("projectId", "title")
    .populate("milestoneId", "title")
    .populate("assignedTo", "name email avatar")
    .populate("createdBy", "name email avatar")
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip)
    .lean();

  const total = await Task.countDocuments(query);

  return {
    tasks: tasks.map((task) => ({
      id: task._id || task.id,
      title: task.title,
      description: task.description,
      projectId: task.projectId,
      milestoneId: task.milestoneId,
      assignedTo: task.assignedTo,
      createdBy: task.createdBy,
      status: task.status,
      priority: task.priority,
      dueDate: task.dueDate,
      estimatedHours: task.estimatedHours,
      loggedHours: task.loggedHours,
      tags: task.tags,
      attachments: task.attachments,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
    })),
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalTasks: total,
      hasNextPage: page < Math.ceil(total / limit),
      hasPrevPage: page > 1,
    },
  };
};

const updateTask = async (taskId: string, payload: UpdateTaskPayload, actorId: string) => {
  // Verify task exists
  const task = await Task.findById(taskId);
  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  // Verify assigned user exists (if provided)
  if (payload.assignedTo) {
    const user = await User.findById(payload.assignedTo);
    if (!user) {
      throw new ApiError(404, "Assigned user not found");
    }
  }

  const updatedTask = await Task.findByIdAndUpdate(
    taskId,
    { $set: payload },
    { new: true, runValidators: true },
  );

  if (!updatedTask) {
    throw new ApiError(500, "Failed to update task");
  }

  const taskObj = updatedTask.toObject();
  return taskObj;
};

const deleteTask = async (taskId: string) => {
  const task = await Task.findByIdAndDelete(taskId);

  if (!task) {
    throw new ApiError(404, "Task not found");
  }

  return { message: "Task deleted successfully" };
};

export const TaskServices = {
  createTask,
  getTaskById,
  getProjectTasks,
  updateTask,
  deleteTask,
};
