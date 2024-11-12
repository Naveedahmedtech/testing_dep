import { CustomError } from "../../utils/CustomError";
import prisma from "../../prisma";
import { sendSuccessResponse } from "../../utils/responseHandler";
import { Request, Response, NextFunction } from "express";

export const createRole = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log(req.body);
    const { name, description } = req.body;

    console.log("Creating role with data:", { name, description });
    const newRole = await prisma.role.create({
      data: { name: name.toUpperCase(), description },
    });
    console.log("Role created successfully:", newRole);

    return sendSuccessResponse(res, "Role created successfully.", newRole, 201);
  } catch (error: any) {
    if (error.code === "P2002") {
      return next(new CustomError("Role name already exists!", 409));
    }
    console.error("prisma:error", error); // Enhanced error logging
    next(error);
  }
};
