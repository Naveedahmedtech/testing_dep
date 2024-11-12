
import express from "express";

declare global {
  namespace Express {
    export interface Request {
      cookies?: { [key: string]: string };
      user?: {
        token: string;
        decoded: any;
      };
    }
  }
}
