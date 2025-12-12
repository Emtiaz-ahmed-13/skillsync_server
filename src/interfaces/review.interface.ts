import { Types } from "mongoose";

export interface IReview {
  _id?: Types.ObjectId;
  id?: string;
  projectId: Types.ObjectId;
  reviewerId: Types.ObjectId;
  revieweeId: Types.ObjectId;
  rating: number; // 1-5 stars
  comment?: string;
  professionalism?: number; // 1-5 stars
  communication?: number; // 1-5 stars
  expertise?: number; // 1-5 stars
  quality?: number; // 1-5 stars
  punctuality?: number; // 1-5 stars
  createdAt?: Date;
  updatedAt?: Date;
}
