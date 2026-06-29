import { NextFunction, Request, Response } from "express";
import connectDB from "../config/database";

export const connectDbMiddleware = async (
  _req: Request,
  _res: Response,
  next: NextFunction,
) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    next(error);
  }
};
