/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { ZodError, ZodSchema } from "zod";
import ApiError from "../utils/ApiError";

const validateRequest =
  (schema: ZodSchema) => async (req: Request, res: Response, next: NextFunction) => {
    try {
      const safeParseResult = schema.safeParse({ body: req.body });
      if (safeParseResult.success) {
        const result = safeParseResult.data as { body: any };
        req.body = result.body;
      } else {
        await schema.parseAsync(req.body);
      }
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        const zodError = error as ZodError;
        const errorMessages = zodError.issues.map((issue) => ({
          path: issue.path.join("."),
          message: issue.message,
        }));
        return next(
          new ApiError(400, `Validation Error: ${errorMessages.map((e) => e.message).join(", ")}`),
        );
      }
      next(error);
    }
  };

export default validateRequest;
