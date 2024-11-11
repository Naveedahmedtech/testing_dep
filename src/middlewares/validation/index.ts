import { Schema, ValidationErrorItem } from "joi";
import { sendErrorResponse } from "../../utils/responseHandler";
import { NextFunction, Request, Response } from "express";

export const validateRequest = (schema: Schema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const errors = error.details.map(
        (detail: ValidationErrorItem) => detail.message
      );
      return sendErrorResponse(res, "Validation failed", 400, null, errors);
    }

    next();
  };
};
