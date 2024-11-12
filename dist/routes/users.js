"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const users_1 = require("../controller/users");
const verifyTokenMiddleware_1 = require("../middlewares/verifyTokenMiddleware");
const routePaths_1 = require("../constants/routePaths");
const userRouter = express_1.default.Router();
userRouter.get(routePaths_1.ROUTES.APP.ROOT, verifyTokenMiddleware_1.verifyTokenMiddleware, users_1.getUsers);
userRouter.get(routePaths_1.ROUTES.USERS.BY_TOKEN, verifyTokenMiddleware_1.verifyTokenMiddleware, users_1.getUserByToken);
userRouter.post(routePaths_1.ROUTES.USERS.OVERSIGHT, verifyTokenMiddleware_1.verifyTokenMiddleware, users_1.assignManagerToUsers);
userRouter.get(routePaths_1.ROUTES.USERS.MANAGER_ASSIGN_TASKS, verifyTokenMiddleware_1.verifyTokenMiddleware, users_1.getManagerAssignedTasks);
userRouter.get(routePaths_1.ROUTES.USERS.GET_DASHBOARD_COUNT, verifyTokenMiddleware_1.verifyTokenMiddleware, users_1.getAdminDashboardCounts);
exports.default = userRouter;
