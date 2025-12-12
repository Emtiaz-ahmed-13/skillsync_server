import dotenv from "dotenv";
import ImageKit from "imagekit";

dotenv.config();

// Initialize ImageKit
const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY || "",
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY || "",
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || "",
});

/**
 * Upload file to ImageKit
 */
const uploadFile = async (fileBuffer: Buffer, fileName: string, folderPath: string = "/") => {
  try {
    const response = await imagekit.upload({
      file: fileBuffer,
      fileName: fileName,
      folder: folderPath,
    });

    return {
      fileId: response.fileId,
      url: response.url,
      thumbnailUrl: response.thumbnailUrl,
      name: response.name,
      size: response.size,
      mimeType: (response as any).mime,
    };
  } catch (error: any) {
    throw new Error(`Failed to upload file: ${error.message}`);
  }
};

/**
 * Delete file from ImageKit
 */
const deleteFile = async (fileId: string) => {
  try {
    await imagekit.deleteFile(fileId);
    return { success: true, message: "File deleted successfully" };
  } catch (error: any) {
    throw new Error(`Failed to delete file: ${error.message}`);
  }
};

/**
 * Get file metadata from ImageKit
 */
const getFileMetadata = async (fileId: string) => {
  try {
    const response = await imagekit.getFileDetails(fileId);
    return response;
  } catch (error: any) {
    throw new Error(`Failed to get file metadata: ${error.message}`);
  }
};

/**
 * Generate signed URL for private files
 */
const generateSignedUrl = async (path: string, expiresIn: number = 3600) => {
  try {
    const response = await imagekit.getAuthenticationParameters(path, expiresIn);
    return response;
  } catch (error: any) {
    throw new Error(`Failed to generate signed URL: ${error.message}`);
  }
};

export const ImageKitUtils = {
  uploadFile,
  deleteFile,
  getFileMetadata,
  generateSignedUrl,
};
