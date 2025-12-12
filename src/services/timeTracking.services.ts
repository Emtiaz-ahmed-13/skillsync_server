import { Project } from "../models/project.model";
import { Task } from "../models/task.model";
import { TimeTracking } from "../models/timeTracking.model";
import ApiError from "../utils/ApiError";

type CreateTimeTrackingPayload = {
  taskId?: string;
  projectId: string;
  milestoneId?: string;
  userId: string;
  startTime: Date;
  endTime?: Date;
  duration?: number;
  description?: string;
  isManual: boolean;
};

type UpdateTimeTrackingPayload = {
  endTime?: Date;
  duration?: number;
  description?: string;
};

const createTimeTracking = async (payload: CreateTimeTrackingPayload) => {
  // Verify project exists
  const project = await Project.findById(payload.projectId);
  if (!project) {
    throw new ApiError(404, "Project not found");
  }

  // Verify task exists (if provided)
  if (payload.taskId) {
    const task = await Task.findById(payload.taskId);
    if (!task) {
      throw new ApiError(404, "Task not found");
    }
  }

  // Auto-calculate duration if start and end times are provided
  let duration = payload.duration;
  if (payload.startTime && payload.endTime && !duration) {
    const diffMs = payload.endTime.getTime() - payload.startTime.getTime();
    duration = Math.floor(diffMs / 60000); // Convert to minutes
  }

  const timeTracking = await TimeTracking.create({
    ...payload,
    duration,
  });

  const timeTrackingObj = timeTracking.toObject();
  return timeTrackingObj;
};

const getTimeTrackingById = async (timeTrackingId: string) => {
  const timeTracking = await TimeTracking.findById(timeTrackingId)
    .populate("taskId", "title")
    .populate("projectId", "title")
    .populate("milestoneId", "title")
    .populate("userId", "name email avatar");

  if (!timeTracking) {
    throw new ApiError(404, "Time tracking record not found");
  }

  const timeTrackingObj = timeTracking.toObject();
  return timeTrackingObj;
};

const getUserTimeTracking = async (
  userId: string,
  filters: any = {},
  limit: number = 10,
  page: number = 1,
) => {
  const skip = (page - 1) * limit;

  // Build query based on filters
  const query: any = { userId, ...filters };

  const timeTrackings = await TimeTracking.find(query)
    .populate("taskId", "title")
    .populate("projectId", "title")
    .populate("milestoneId", "title")
    .sort({ startTime: -1 })
    .limit(limit)
    .skip(skip)
    .lean();

  const total = await TimeTracking.countDocuments(query);

  // Calculate total tracked time
  const totalTime = timeTrackings.reduce((sum, record) => sum + (record.duration || 0), 0);

  return {
    timeTrackings: timeTrackings.map((record) => ({
      id: record._id || record.id,
      taskId: record.taskId,
      projectId: record.projectId,
      milestoneId: record.milestoneId,
      userId: record.userId,
      startTime: record.startTime,
      endTime: record.endTime,
      duration: record.duration,
      description: record.description,
      isManual: record.isManual,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    })),
    totalTimeMinutes: totalTime,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalRecords: total,
      hasNextPage: page < Math.ceil(total / limit),
      hasPrevPage: page > 1,
    },
  };
};

const updateTimeTracking = async (timeTrackingId: string, payload: UpdateTimeTrackingPayload) => {
  // Verify time tracking record exists
  const timeTracking = await TimeTracking.findById(timeTrackingId);
  if (!timeTracking) {
    throw new ApiError(404, "Time tracking record not found");
  }

  // Auto-calculate duration if start and end times are provided
  let duration = payload.duration;
  if (timeTracking.startTime && payload.endTime && !duration) {
    const diffMs = payload.endTime.getTime() - timeTracking.startTime.getTime();
    duration = Math.floor(diffMs / 60000); // Convert to minutes
  }

  const updatedTimeTracking = await TimeTracking.findByIdAndUpdate(
    timeTrackingId,
    { $set: { ...payload, duration } },
    { new: true, runValidators: true },
  );

  if (!updatedTimeTracking) {
    throw new ApiError(500, "Failed to update time tracking record");
  }

  const timeTrackingObj = updatedTimeTracking.toObject();
  return timeTrackingObj;
};

const deleteTimeTracking = async (timeTrackingId: string) => {
  const timeTracking = await TimeTracking.findByIdAndDelete(timeTrackingId);

  if (!timeTracking) {
    throw new ApiError(404, "Time tracking record not found");
  }

  return { message: "Time tracking record deleted successfully" };
};

export const TimeTrackingServices = {
  createTimeTracking,
  getTimeTrackingById,
  getUserTimeTracking,
  updateTimeTracking,
  deleteTimeTracking,
};
