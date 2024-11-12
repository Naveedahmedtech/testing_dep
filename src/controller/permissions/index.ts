import { CustomError } from "../../utils/CustomError";
import prisma from "../../prisma";
import { sendSuccessResponse } from "../../utils/responseHandler";
import { Request, Response, NextFunction } from "express";

export const createPermission = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, description } = req.body;

    const newPermission = await prisma.permission.create({
      data: { name, description },
    });

    return sendSuccessResponse(
      res,
      "Permission created successfully.",
      newPermission,
      201
    );
  } catch (error: any) {
    if (error.code === "P2002") {
      return next(new CustomError("Permission name already exists!", 409));
    }
    next(error);
  }
};
