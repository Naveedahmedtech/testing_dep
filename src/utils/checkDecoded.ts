import { CustomError } from "./CustomError";
import { JwtPayload } from "jsonwebtoken";

export const isDecodedWithId = (
  decoded: string | JwtPayload | { id: string }
): decoded is { id: string } => {
  if (typeof decoded === "object" && decoded !== null && "id" in decoded) {
    return true;
  } else {
    throw new CustomError("Invalid JWT payload type received", 400);
  }
};
