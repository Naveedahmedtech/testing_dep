import { NextFunction, Request, Response } from "express";
import { CustomError } from "../utils/CustomError";
import { sendErrorResponse } from "../utils/responseHandler";
import logger from "../config/logger";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode =
    err instanceof CustomError
      ? err.statusCode
      : err.code === "EBADCSRFTOKEN"
      ? 403
      : err.statusCode === 413
      ? 413
      : 500;

  const message =
    err instanceof CustomError
      ? err.message
      : err.code === "EBADCSRFTOKEN"
      ? "Invalid CSRF TOKEN"
      : err.statusCode === 413
      ? "Payload too large. Please reduce file size."
      : "INTERNAL SERVER ERROR!";

  logger.error(message, { statusCode, stack: err.stack });

  let stack = err.stack;
  if (process.env.NODE_ENV === "prod") {
    stack = "";
  }

  sendErrorResponse(res, message, statusCode, stack);
};
