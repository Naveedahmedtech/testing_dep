import express from "express";
import { verifyTokenMiddleware } from "../middlewares/verifyTokenMiddleware";
import { ROUTES } from "../constants/routePaths";
import { createTask, getAllUserTasksForAdmin, getTasks, getUserTaskCounts, updateTask } from "../controller/tasks";

const tasksRouter = express.Router();

tasksRouter.post(ROUTES.APP.ROOT, verifyTokenMiddleware, createTask);
tasksRouter.get(ROUTES.APP.ROOT, verifyTokenMiddleware, getTasks);
tasksRouter.get(
  ROUTES.TASK.GET_ALL_TASKS,
  verifyTokenMiddleware,
  getAllUserTasksForAdmin
);
tasksRouter.put(ROUTES.APP.BY_ID, verifyTokenMiddleware, updateTask);
tasksRouter.get(
  ROUTES.TASK.BY_USER_TASKS_COUNT,
  verifyTokenMiddleware,
  getUserTaskCounts
);

export default tasksRouter;
 