import { Types } from "mongoose";

export interface IArticle {
  _id?: Types.ObjectId;
  title: string;
  content: string;
  excerpt?: string;
  author: Types.ObjectId; // Reference to User
  status: "draft" | "pending" | "published" | "rejected";
  featuredImage?: string;
  tags?: string[];
  slug: string;
  views?: number;
  likes?: number;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
