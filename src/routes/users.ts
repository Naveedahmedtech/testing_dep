import express from "express";
import { assignManagerToUsers, getAdminDashboardCounts, getManagerAssignedTasks, getUserByToken, getUsers } from "../controller/users";
import { verifyTokenMiddleware } from "../middlewares/verifyTokenMiddleware";
import { ROUTES } from "../constants/routePaths";

const userRouter = express.Router();

userRouter.get(ROUTES.APP.ROOT, verifyTokenMiddleware, getUsers);
userRouter.get(ROUTES.USERS.BY_TOKEN, verifyTokenMiddleware, getUserByToken);
userRouter.post(ROUTES.USERS.OVERSIGHT, verifyTokenMiddleware, assignManagerToUsers);
userRouter.get(
  ROUTES.USERS.MANAGER_ASSIGN_TASKS,
  verifyTokenMiddleware,
  getManagerAssignedTasks
);
userRouter.get(
  ROUTES.USERS.GET_DASHBOARD_COUNT,
  verifyTokenMiddleware,
  getAdminDashboardCounts
);

export default userRouter
