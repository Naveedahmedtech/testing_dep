"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const roles_1 = require("../controller/roles");
const routePaths_1 = require("../constants/routePaths");
const roleRouter = express_1.default.Router();
roleRouter.post(routePaths_1.ROUTES.APP.ROOT, roles_1.createRole);
// roleRouter.get(ROUTES.APP.ROOT, getRoles);
// roleRouter.get(ROUTES.ROLES.BY_ID, getRoleById);
// roleRouter.put(ROUTES.ROLES.BY_ID, updateRole);
// roleRouter.delete(ROUTES.ROLES.BY_ID, deleteRole);
exports.default = roleRouter;
