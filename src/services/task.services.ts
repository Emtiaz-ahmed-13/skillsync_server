import { Task } from "../models/task.model";
import ApiError from "../utils/ApiError";

const createTask = async (payload: any) => {
  const task = await Task.create(payload);
  return task.toObject();
};

const getTasksByProject = async (projectId: string) => {
  const tasks = await Task.find({ projectId })
    .populate("assignedTo", "name email")
    .populate("sprintId", "name")
    .sort({ createdAt: 1 })
    .lean();
  
  return tasks.map(task => ({
    ...task,
    id: task._id,
  }));
};

const getTasksBySprint = async (sprintId: string) => {
  const tasks = await Task.find({ sprintId })
    .populate("assignedTo", "name email")
    .sort({ createdAt: 1 })
    .lean();
  
  return tasks.map(task => ({
    ...task,
    id: task._id,
  }));
};

const getTaskById = async (taskId: string) => {
  const task = await Task.findById(taskId)
    .populate("assignedTo", "name email")
    .populate("sprintId", "name")
    .lean();
  
  if (!task) {
    throw new ApiError(404, "Task not found");
  }
  
  return {
    ...task,
    id: task._id,
  };
};

const updateTask = async (taskId: string, payload: any) => {
  const task = await Task.findByIdAndUpdate(
    taskId,
    { $set: payload },
    { new: true, runValidators: true }
  )
    .populate("assignedTo", "name email")
    .populate("sprintId", "name")
    .lean();
  
  if (!task) {
    throw new ApiError(404, "Task not found");
  }
  
  return {
    ...task,
    id: task._id,
  };
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
  getTasksByProject,
  getTasksBySprint,
  getTaskById,
  updateTask,
  deleteTask,
};