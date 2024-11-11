// types.d.ts
import { Session } from "express-session";
import { Request } from "express";

declare module "express-serve-static-core" {
  interface Request {
    session?: Session & { secret?: string };
  }
}
