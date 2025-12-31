import { Request, Response } from "express";
import { ArticleServices } from "../services/article.services";
import catchAsync from "../utils/catchAsync";
import sendResponse from "../utils/sendResponse";

interface CustomRequest extends Request {
  user?: {
    id?: string;
    _id?: string;
    role?: string;
    iat?: number;
    exp?: number;
    _doc?: {
      _id?: string;
    };
    $__?: {
      activePaths?: {
        paths?: {
          _id?: boolean;
        };
      };
    };
  };
}

const createArticle = catchAsync(async (req: CustomRequest, res: Response) => {
  console.log("=== CREATE ARTICLE CALLED ===");
  console.log("Request body:", req.body);
  console.log("Request file:", (req as any).file);
  
  const userId = req.user?.id || req.user?._id || req.user?._doc?._id;
  console.log("User ID:", userId);

  if (!userId) {
    console.log("No user ID found!");
    return sendResponse(res, {
      statusCode: 401,
      success: false,
      message: "Unauthorized: User ID not found",
      data: null,
    });
  }
  let featuredImageUrl = req.body.featuredImage;
  
  if ((req as any).file) {
    console.log("Uploading image to ImageKit...");
    try {
      const { ImageKitUtils } = await import("../utils/imagekit.utils");
      const uploadResult = await ImageKitUtils.uploadFile(
        (req as any).file.buffer,
        `article-${Date.now()}-${(req as any).file.originalname}`,
        "/articles"
      );
      featuredImageUrl = uploadResult.url;
      console.log("Image uploaded:", featuredImageUrl);
    } catch (error) {
      console.error("Image upload error:", error);
    }
  }

  let tags = req.body.tags;
  if (typeof tags === 'string') {
    try {
      tags = JSON.parse(tags);
    } catch (e) {
      tags = [];
    }
  }

  const articleData = {
    ...req.body,
    tags,
    featuredImage: featuredImageUrl,
    status: req.body.status || "pending", 
  };
  
  console.log("Article data to create:", articleData);

  try {
    const result = await ArticleServices.createArticle(articleData, userId);
    console.log("Article created successfully:", result._id);

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Article created successfully",
      data: result,
    });
  } catch (error) {
    console.error("=== ERROR CREATING ARTICLE ===");
    console.error("Error:", error);
    console.error("Error stack:", error instanceof Error ? error.stack : "No stack trace");
    throw error; 
  }
});

const getAllArticles = catchAsync(async (req: CustomRequest, res: Response) => {
  const { page, limit, status, authorId } = req.query;

  const result = await ArticleServices.getAllArticles(
    parseInt(page as string) || 1,
    parseInt(limit as string) || 10,
    status as string,
    authorId as string,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Articles retrieved successfully",
    data: result,
  });
});

const getArticleBySlug = catchAsync(async (req: CustomRequest, res: Response) => {
  const { slug } = req.params;
  const result = await ArticleServices.getArticleBySlug(slug);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Article retrieved successfully",
    data: result,
  });
});

const updateArticle = catchAsync(async (req: CustomRequest, res: Response) => {
  const userId = req.user?.id || req.user?._id || req.user?._doc?._id;
  const { id } = req.params;

  if (!userId) {
    return sendResponse(res, {
      statusCode: 401,
      success: false,
      message: "Unauthorized: User ID not found",
      data: null,
    });
  }

  const result = await ArticleServices.updateArticle(id, req.body, userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Article updated successfully",
    data: result,
  });
});

const deleteArticle = catchAsync(async (req: CustomRequest, res: Response) => {
  const userId = req.user?.id || req.user?._id || req.user?._doc?._id;
  const { id } = req.params;

  if (!userId) {
    return sendResponse(res, {
      statusCode: 401,
      success: false,
      message: "Unauthorized: User ID not found",
      data: null,
    });
  }

  const result = await ArticleServices.deleteArticle(id, userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Article deleted successfully",
    data: result,
  });
});

const approveArticle = catchAsync(async (req: CustomRequest, res: Response) => {
  const userId = req.user?.id || req.user?._id || req.user?._doc?._id;
  const { id } = req.params;

  if (!userId) {
    return sendResponse(res, {
      statusCode: 401,
      success: false,
      message: "Unauthorized: User ID not found",
      data: null,
    });
  }

  const result = await ArticleServices.approveArticle(id, userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Article approved successfully",
    data: result,
  });
});

const getPendingArticles = catchAsync(async (req: CustomRequest, res: Response) => {
  const { page, limit } = req.query;

  const result = await ArticleServices.getPendingArticles(
    parseInt(page as string) || 1,
    parseInt(limit as string) || 10,
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Pending articles retrieved successfully",
    data: result,
  });
});

const rejectArticle = catchAsync(async (req: CustomRequest, res: Response) => {
  const userId = req.user?.id || req.user?._id || req.user?._doc?._id;
  const { id } = req.params;
  const { rejectionReason } = req.body;

  if (!userId) {
    return sendResponse(res, {
      statusCode: 401,
      success: false,
      message: "Unauthorized: User ID not found",
      data: null,
    });
  }

  const result = await ArticleServices.rejectArticle(id, userId, rejectionReason);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Article rejected successfully",
    data: result,
  });
});

export const ArticleControllers = {
  createArticle,
  getAllArticles,
  getArticleBySlug,
  updateArticle,
  deleteArticle,
  approveArticle,
  rejectArticle,
  getPendingArticles,
};
