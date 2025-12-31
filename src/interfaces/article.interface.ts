import { Types } from "mongoose";

export interface IArticle {
  _id?: Types.ObjectId;
  title: string;
  content: string;
  excerpt?: string;
  author: Types.ObjectId; 
  status: "draft" | "pending" | "published" | "rejected";
  featuredImage?: string;
  tags?: string[];
  category?: string;
  slug: string;
  views?: number;
  likes?: number;
  publishedAt?: Date;
  rejectionReason?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
