import { NextFunction, Request, Response } from "express";
import { CustomError } from "../utils/CustomError";
import logger from "../config/logger";

export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  const error = new CustomError("Request not found!", 404);

  logger.warn(error.message, { statusCode: error.statusCode });

  next(error);
};
