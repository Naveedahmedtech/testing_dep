"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// ** routes
const roles_1 = __importDefault(require("./roles"));
const permissions_1 = __importDefault(require("./permissions"));
const auth_1 = __importDefault(require("./auth"));
const users_1 = __importDefault(require("./users"));
const tasks_1 = __importDefault(require("./tasks"));
const routePaths_1 = require("../constants/routePaths");
const router = express_1.default.Router();
router.use(routePaths_1.ROUTES.AUTH.BASE, auth_1.default);
router.use(routePaths_1.ROUTES.USERS.BASE, users_1.default);
router.use(routePaths_1.ROUTES.ROLES.BASE, roles_1.default);
router.use(routePaths_1.ROUTES.PERMISSIONS.BASE, permissions_1.default);
router.use(routePaths_1.ROUTES.TASK.BASE, tasks_1.default);
exports.default = router;
