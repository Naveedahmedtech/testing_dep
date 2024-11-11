import { IGetUserAuthInfoRequest } from "../types";
import { isDecodedWithId } from "../utils/checkDecoded";
import { sendErrorResponse } from "../utils/responseHandler";
import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ACCESS_CONTROL } from "../constants/routePaths";
// import prisma from "../prisma";
import { ENV } from "../constants";

export const verifyTokenMiddleware = async (
  req: IGetUserAuthInfoRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies?.accessToken;
  console.log("tokentokentoken===-=-=-=-=-=-***", token);
  if (!token) {
    return sendErrorResponse(res, "Access token is not provided.", 401);
  }

  try {
    const decoded = jwt.verify(token, ENV.JWT.SECRET as string);
    next();
    // if (isDecodedWithId(decoded)) {
    //   const user = await prisma.user.findUnique({
    //     where: { id: decoded.id },
    //     include: { role: true },
    //   });
    //   console.log("decoded", decoded, user);

    //   if (!user) {
    //     return sendErrorResponse(
    //       res,
    //       "Account deleted. Your account has been deleted.",
    //       404
    //     );
    //   }

    //   req.user = {
    //     token,
    //     decoded,
    //   };

    //   const userRole = user.role.name;
    //   const endpointKey = `${req.method} ${req.baseUrl}${req.path}`;
    //   const allowedRoles = ACCESS_CONTROL[endpointKey] || [];
    //   console.log(",********",  endpointKey, allowedRoles, userRole);
    //   if (allowedRoles.length && !allowedRoles.includes(userRole)) {
    //     return sendErrorResponse(
    //       res,
    //       "You do not have permission to access this resource.",
    //       403
    //     );
    //   }

    //   next();
    // } else {
    //   return sendErrorResponse(res, "Invalid token format.", 403);
    // }
  } catch (error) {
    console.log("error", error);
    return sendErrorResponse(res, "Access token is expired or invalid.", 403);
  }
};
