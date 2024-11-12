"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const verifyTokenMiddleware_1 = require("../middlewares/verifyTokenMiddleware");
const routePaths_1 = require("../constants/routePaths");
const tasks_1 = require("../controller/tasks");
const tasksRouter = express_1.default.Router();
tasksRouter.post(routePaths_1.ROUTES.APP.ROOT, verifyTokenMiddleware_1.verifyTokenMiddleware, tasks_1.createTask);
tasksRouter.get(routePaths_1.ROUTES.APP.ROOT, verifyTokenMiddleware_1.verifyTokenMiddleware, tasks_1.getTasks);
tasksRouter.get(routePaths_1.ROUTES.TASK.GET_ALL_TASKS, verifyTokenMiddleware_1.verifyTokenMiddleware, tasks_1.getAllUserTasksForAdmin);
tasksRouter.put(routePaths_1.ROUTES.APP.BY_ID, verifyTokenMiddleware_1.verifyTokenMiddleware, tasks_1.updateTask);
tasksRouter.get(routePaths_1.ROUTES.TASK.BY_USER_TASKS_COUNT, verifyTokenMiddleware_1.verifyTokenMiddleware, tasks_1.getUserTaskCounts);
exports.default = tasksRouter;
