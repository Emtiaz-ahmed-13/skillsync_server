import { Types } from "mongoose";

export type UserRole = "client" | "freelancer" | "admin";

export interface IFreelancerProfile {
  hourlyRate?: number;
  skills?: string[];
  portfolio?: string[];
  bio?: string;
  experience?: string;
  availability?: "available" | "busy" | "unavailable";
}

export interface IClientProfile {
  companyName?: string;
  companyWebsite?: string;
  industry?: string;
}

export interface IUser {
  _id?: Types.ObjectId;
  id?: string;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
  freelancerProfile?: IFreelancerProfile;
  clientProfile?: IClientProfile;
  isEmailVerified?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
