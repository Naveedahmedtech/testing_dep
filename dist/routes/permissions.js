"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const permissions_1 = require("../controller/permissions");
const routePaths_1 = require("../constants/routePaths");
const permissionRouter = express_1.default.Router();
permissionRouter.post(routePaths_1.ROUTES.APP.ROOT, permissions_1.createPermission);
// permissionRouter.get(ROUTES.APP.ROOT, getPermissions);
// permissionRouter.get(ROUTES.PERMISSIONS.BY_ID, getPermissionById);
// permissionRouter.put(ROUTES.PERMISSIONS.BY_ID, updatePermission);
// permissionRouter.delete(ROUTES.PERMISSIONS.BY_ID, deletePermission);
exports.default = permissionRouter;
