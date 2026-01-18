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

const updateTaskOrder = async (taskId: string, newOrder: number, newStatus?: string) => {
  const updateData: any = { order: newOrder };
  if (newStatus) {
    updateData.status = newStatus;
  }

  const task = await Task.findByIdAndUpdate(
    taskId,
    { $set: updateData },
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

const bulkUpdateTasks = async (updates: Array<{ id: string; order: number; status?: string }>) => {
  const bulkOps = updates.map(update => ({
    updateOne: {
      filter: { _id: update.id },
      update: {
        $set: {
          order: update.order,
          ...(update.status && { status: update.status })
        }
      }
    }
  }));

  await Task.bulkWrite(bulkOps);
  return { message: "Tasks updated successfully", count: updates.length };
};

const getTasksByStatus = async (projectId: string, status: string) => {
  const tasks = await Task.find({ projectId, status })
    .populate("assignedTo", "name email avatar")
    .populate("sprintId", "name")
    .sort({ order: 1, createdAt: 1 })
    .lean();

  return tasks.map(task => ({
    ...task,
    id: task._id,
  }));
};

export const TaskServices = {
  createTask,
  getTasksByProject,
  getTasksBySprint,
  getTaskById,
  updateTask,
  deleteTask,
  updateTaskOrder,
  bulkUpdateTasks,
  getTasksByStatus,
};