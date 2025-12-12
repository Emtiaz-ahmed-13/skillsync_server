import { Types } from "mongoose";
import { IArticle } from "../interfaces/article.interface";
import { Article } from "../models/article.model";
import { User } from "../models/user.model";
import ApiError from "../utils/ApiError";

const createArticle = async (payload: Partial<IArticle>, userId: string) => {
  // Check if user exists
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Generate slug from title
  const slug =
    payload.title
      ?.toLowerCase()
      .replace(/[^a-zA-Z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "";

  // Check if slug already exists
  const existingArticle = await Article.findOne({ slug });
  if (existingArticle) {
    throw new ApiError(
      400,
      "An article with this title already exists. Please use a different title.",
    );
  }

  // Create article
  const articleData = {
    ...payload,
    author: new Types.ObjectId(userId),
    slug,
  };

  const article = await Article.create(articleData);
  return article;
};

const getAllArticles = async (
  page: number = 1,
  limit: number = 10,
  status: string = "published",
  authorId?: string,
) => {
  const skip = (page - 1) * limit;

  // Build filter
  const filter: any = {};

  // Only show published articles to non-admin users
  if (status) {
    filter.status = status;
  }

  if (authorId) {
    filter.author = new Types.ObjectId(authorId);
  }

  const articles = await Article.find(filter)
    .populate("author", "name email avatar")
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip)
    .lean();

  const total = await Article.countDocuments(filter);

  return {
    articles,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

const getArticleBySlug = async (slug: string) => {
  const article = await Article.findOne({ slug, status: "published" })
    .populate("author", "name email avatar")
    .lean();

  if (!article) {
    throw new ApiError(404, "Article not found");
  }

  // Increment view count
  await Article.updateOne({ _id: article._id }, { $inc: { views: 1 } });

  return article;
};

const getArticleById = async (id: string) => {
  const article = await Article.findById(id).populate("author", "name email avatar").lean();

  if (!article) {
    throw new ApiError(404, "Article not found");
  }

  return article;
};

const updateArticle = async (articleId: string, payload: Partial<IArticle>, userId: string) => {
  // Check if article exists
  const article = await Article.findById(articleId);
  if (!article) {
    throw new ApiError(404, "Article not found");
  }

  // Check if user is the author
  if (article.author.toString() !== userId) {
    throw new ApiError(403, "You are not authorized to update this article");
  }

  // If title is being updated, regenerate slug
  if (payload.title && payload.title !== article.title) {
    const slug = payload.title
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    // Check if new slug already exists (excluding current article)
    const existingArticle = await Article.findOne({ slug, _id: { $ne: articleId } });
    if (existingArticle) {
      throw new ApiError(
        400,
        "An article with this title already exists. Please use a different title.",
      );
    }

    payload.slug = slug;
  }

  // Update article
  const updatedArticle = await Article.findByIdAndUpdate(
    articleId,
    { $set: payload },
    { new: true, runValidators: true },
  ).lean();

  return updatedArticle;
};

const deleteArticle = async (articleId: string, userId: string) => {
  // Check if article exists
  const article = await Article.findById(articleId);
  if (!article) {
    throw new ApiError(404, "Article not found");
  }

  // Check if user is the author or admin
  if (article.author.toString() !== userId) {
    const user = await User.findById(userId);
    if (!user || user.role !== "admin") {
      throw new ApiError(403, "You are not authorized to delete this article");
    }
  }

  // Delete article
  await Article.findByIdAndDelete(articleId);

  return { message: "Article deleted successfully" };
};

const approveArticle = async (
  articleId: string,
  status: "published" | "rejected",
  adminId: string,
) => {
  // Check if article exists
  const article = await Article.findById(articleId);
  if (!article) {
    throw new ApiError(404, "Article not found");
  }

  // Check if user is admin
  const admin = await User.findById(adminId);
  if (!admin || admin.role !== "admin") {
    throw new ApiError(403, "You are not authorized to approve articles");
  }

  // Update article status
  const updatedArticle = await Article.findByIdAndUpdate(
    articleId,
    {
      $set: {
        status,
        ...(status === "published" && !article.publishedAt ? { publishedAt: new Date() } : {}),
      },
    },
    { new: true, runValidators: true },
  ).lean();

  return updatedArticle;
};

const getPendingArticles = async (page: number = 1, limit: number = 10) => {
  const skip = (page - 1) * limit;

  const articles = await Article.find({ status: "pending" })
    .populate("author", "name email avatar")
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip)
    .lean();

  const total = await Article.countDocuments({ status: "pending" });

  return {
    articles,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  };
};

export const ArticleServices = {
  createArticle,
  getAllArticles,
  getArticleBySlug,
  getArticleById,
  updateArticle,
  deleteArticle,
  approveArticle,
  getPendingArticles,
};
