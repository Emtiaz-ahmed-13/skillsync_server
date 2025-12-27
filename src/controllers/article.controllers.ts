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
  const userId = req.user?.id || req.user?._id || req.user?._doc?._id;

  if (!userId) {
    return sendResponse(res, {
      statusCode: 401,
      success: false,
      message: "Unauthorized: User ID not found",
      data: null,
    });
  }

  const result = await ArticleServices.createArticle(req.body, userId);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Article created successfully",
    data: result,
  });
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
  const { status } = req.body;

  if (!userId) {
    return sendResponse(res, {
      statusCode: 401,
      success: false,
      message: "Unauthorized: User ID not found",
      data: null,
    });
  }

  const result = await ArticleServices.approveArticle(id, status, userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: `Article ${status} successfully`,
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

export const ArticleControllers = {
  createArticle,
  getAllArticles,
  getArticleBySlug,
  updateArticle,
  deleteArticle,
  approveArticle,
  getPendingArticles,
};
