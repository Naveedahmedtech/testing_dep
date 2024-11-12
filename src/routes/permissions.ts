import express from "express";
import {
  createPermission,
//   deletePermission,
//   getPermissionById,
//   getPermissions,
//   updatePermission,
} from "../controller/permissions";
import { ROUTES } from "../constants/routePaths";

const permissionRouter = express.Router();

permissionRouter.post(ROUTES.APP.ROOT, createPermission);
// permissionRouter.get(ROUTES.APP.ROOT, getPermissions);
// permissionRouter.get(ROUTES.PERMISSIONS.BY_ID, getPermissionById);
// permissionRouter.put(ROUTES.PERMISSIONS.BY_ID, updatePermission);
// permissionRouter.delete(ROUTES.PERMISSIONS.BY_ID, deletePermission);

export default permissionRouter;
