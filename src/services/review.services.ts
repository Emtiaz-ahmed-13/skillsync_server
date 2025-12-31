import { Project } from "../models/project.model";
import { Review } from "../models/review.model";
import { User } from "../models/user.model";
import ApiError from "../utils/ApiError";

type CreateReviewPayload = {
  projectId: string;
  reviewerId: string;
  revieweeId: string;
  rating: number;
  comment?: string;
  professionalism?: number;
  communication?: number;
  expertise?: number;
  quality?: number;
  punctuality?: number;
};

const createReview = async (payload: CreateReviewPayload) => {
  const project = await Project.findById(payload.projectId);
  if (!project) {
    throw new ApiError(404, "Project not found");
  }
  const reviewer = await User.findById(payload.reviewerId);
  if (!reviewer) {
    throw new ApiError(404, "Reviewer not found");
  }
  const reviewee = await User.findById(payload.revieweeId);
  if (!reviewee) {
    throw new ApiError(404, "Reviewee not found");
  }
  if (payload.reviewerId === payload.revieweeId) {
    throw new ApiError(400, "You cannot review yourself");
  }
  const existingReview = await Review.findOne({
    projectId: payload.projectId,
    reviewerId: payload.reviewerId,
    revieweeId: payload.revieweeId,
  });

  if (existingReview) {
    throw new ApiError(400, "You have already reviewed this user for this project");
  }

  const review = await Review.create(payload);

  const reviewObj = review.toObject();
  return reviewObj;
};

const getReviewById = async (reviewId: string) => {
  const review = await Review.findById(reviewId)
    .populate("projectId", "title")
    .populate("reviewerId", "name email avatar")
    .populate("revieweeId", "name email avatar");

  if (!review) {
    throw new ApiError(404, "Review not found");
  }

  const reviewObj = review.toObject();
  return reviewObj;
};

const getUserReviews = async (userId: string, limit: number = 10, page: number = 1) => {
  const skip = (page - 1) * limit;

  const reviews = await Review.find({ revieweeId: userId })
    .populate("projectId", "title")
    .populate("reviewerId", "name email avatar")
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip)
    .lean();
  const total = await Review.countDocuments({ revieweeId: userId });
  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;

  return {
    reviews: reviews.map((review) => ({
      id: review._id || review.id,
      projectId: review.projectId,
      reviewerId: review.reviewerId,
      revieweeId: review.revieweeId,
      rating: review.rating,
      comment: review.comment,
      professionalism: review.professionalism,
      communication: review.communication,
      expertise: review.expertise,
      quality: review.quality,
      punctuality: review.punctuality,
      createdAt: review.createdAt,
      updatedAt: review.updatedAt,
    })),
    averageRating,
    totalReviews: total,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalReviews: total,
      hasNextPage: page < Math.ceil(total / limit),
      hasPrevPage: page > 1,
    },
  };
};

const getProjectReviews = async (projectId: string) => {
  const reviews = await Review.find({ projectId })
    .populate("reviewerId", "name email avatar")
    .populate("revieweeId", "name email avatar")
    .sort({ createdAt: -1 })
    .lean();
  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  const averageRating = reviews.length > 0 ? totalRating / reviews.length : 0;

  return {
    reviews: reviews.map((review) => ({
      id: review._id || review.id,
      projectId: review.projectId,
      reviewerId: review.reviewerId,
      revieweeId: review.revieweeId,
      rating: review.rating,
      comment: review.comment,
      professionalism: review.professionalism,
      communication: review.communication,
      expertise: review.expertise,
      quality: review.quality,
      punctuality: review.punctuality,
      createdAt: review.createdAt,
      updatedAt: review.updatedAt,
    })),
    averageRating,
    totalReviews: reviews.length,
  };
};

const deleteReview = async (reviewId: string, userId: string) => {
  const review = await Review.findById(reviewId);

  if (!review) {
    throw new ApiError(404, "Review not found");
  }

  if (review.reviewerId.toString() !== userId) {
    throw new ApiError(403, "You can only delete your own reviews");
  }

  await Review.findByIdAndDelete(reviewId);

  return { message: "Review deleted successfully" };
};

export const ReviewServices = {
  createReview,
  getReviewById,
  getUserReviews,
  getProjectReviews,
  deleteReview,
};
