"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../controller/auth");
const auth_2 = require("../lib//validation/auth");
const validation_1 = require("../middlewares/validation");
const routePaths_1 = require("../constants/routePaths");
const authRouter = express_1.default.Router();
authRouter.post(routePaths_1.ROUTES.AUTH.REGISTER, (0, validation_1.validateRequest)(auth_2.registerSchema), auth_1.registerUser);
authRouter.post(routePaths_1.ROUTES.AUTH.SIGN_IN, (0, validation_1.validateRequest)(auth_2.loginSchema), auth_1.loginUser);
authRouter.post(routePaths_1.ROUTES.AUTH.LOGOUT, auth_1.logout);
exports.default = authRouter;
