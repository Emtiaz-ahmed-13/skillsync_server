/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { ZodError, ZodSchema } from "zod";
import ApiError from "../utils/ApiError";

const validateRequest =
  (schema: ZodSchema) => async (req: Request, res: Response, next: NextFunction) => {
    try {
      // For params validation, validate directly against req.params
      if ((schema as any).shape && (schema as any).shape.params) {
        const safeParseResult = schema.safeParse({ params: req.params });
        if (!safeParseResult.success) {
          throw safeParseResult.error;
        }
        // Update req.params with validated data if needed
        req.params = (safeParseResult.data as any).params;
      } else {
        // For body validation, wrap the request body in an object with a body property for validation
        const safeParseResult = schema.safeParse({ body: req.body });
        if (safeParseResult.success) {
          // If validation passes, extract the body property to req.body
          req.body = (safeParseResult.data as { body: any }).body;
        } else {
          // If validation fails, throw the error
          throw safeParseResult.error;
        }
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
