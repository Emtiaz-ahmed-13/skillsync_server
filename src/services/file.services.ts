import { File } from "../models/file.model";
import ApiError from "../utils/ApiError";

type CreateFilePayload = {
  name: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  projectId: string;
  milestoneId?: string;
  uploadedBy: string;
  folder?: string;
};

const createFile = async (payload: CreateFilePayload) => {
  const file = await File.create(payload);

  const fileObj = file.toObject();
  return fileObj;
};

const getFileById = async (fileId: string) => {
  const file = await File.findById(fileId);

  if (!file) {
    throw new ApiError(404, "File not found");
  }

  const fileObj = file.toObject();
  return fileObj;
};

const getProjectFiles = async (projectId: string, limit: number = 10, page: number = 1) => {
  const skip = (page - 1) * limit;

  const files = await File.find({ projectId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip)
    .lean();

  const total = await File.countDocuments({ projectId });

  return {
    files: files.map((file) => ({
      id: file._id || file.id,
      name: file.name,
      originalName: file.originalName,
      mimeType: file.mimeType,
      size: file.size,
      url: file.url,
      projectId: file.projectId,
      milestoneId: file.milestoneId,
      uploadedBy: file.uploadedBy,
      folder: file.folder,
      createdAt: file.createdAt,
      updatedAt: file.updatedAt,
    })),
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalFiles: total,
      hasNextPage: page < Math.ceil(total / limit),
      hasPrevPage: page > 1,
    },
  };
};

const deleteFile = async (fileId: string) => {
  const file = await File.findByIdAndDelete(fileId);

  if (!file) {
    throw new ApiError(404, "File not found");
  }

  return { message: "File deleted successfully" };
};

export const FileServices = {
  createFile,
  getFileById,
  getProjectFiles,
  deleteFile,
};
