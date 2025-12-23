import multer from "multer";

// Configure multer storage
const storage = multer.memoryStorage();

// File filter to allow only certain file types
const fileFilter = (req: any, file: any, cb: any) => {
  // Allowed file types
  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/gif",
    "application/pdf",
    "text/plain",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Invalid file type. Only JPEG, PNG, GIF, PDF, TXT, DOC, DOCX, XLS, XLSX files are allowed.",
      ),
      false,
    );
  }
};

// Multer upload configuration
export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
});

// Single file upload middleware
export const uploadSingle = upload.single("file");

// Multiple files upload middleware
export const uploadMultiple = upload.array("files", 10);
