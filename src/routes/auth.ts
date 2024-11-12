import express from "express";

import { loginUser, logout, registerUser } from "../controller/auth";
import { loginSchema, registerSchema } from "../lib//validation/auth";
import { validateRequest } from "../middlewares/validation";
import { ROUTES } from "../constants/routePaths";

const authRouter = express.Router();

authRouter.post(
  ROUTES.AUTH.REGISTER,
  validateRequest(registerSchema),
  registerUser
);

authRouter.post(
  ROUTES.AUTH.SIGN_IN,
  validateRequest(loginSchema),
  loginUser
);

authRouter.post(ROUTES.AUTH.LOGOUT, logout);

export default authRouter;
