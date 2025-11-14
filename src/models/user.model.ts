import bcrypt from "bcrypt";
import { Schema, model } from "mongoose";
import { IUser, UserRole } from "../interfaces/user.interface";

const freelancerProfileSchema = new Schema(
  {
    hourlyRate: Number,
    skills: [String],
    portfolio: [String],
    bio: String,
    experience: String,
    availability: {
      type: String,
      enum: ["available", "busy", "unavailable"],
      default: "available",
    },
  },
  { _id: false },
);

const clientProfileSchema = new Schema(
  {
    companyName: String,
    companyWebsite: String,
    industry: String,
  },
  { _id: false },
);

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true, minlength: 6, select: false },
    role: {
      type: String,
      enum: ["client", "freelancer", "admin"] as UserRole[],
      default: "client",
    },
    phone: String,
    avatar: String,
    freelancerProfile: freelancerProfileSchema,
    clientProfile: clientProfileSchema,
    isEmailVerified: { type: Boolean, default: false },
  },
  { timestamps: true },
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

export const User = model<IUser>("User", userSchema);
