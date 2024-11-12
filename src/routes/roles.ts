import express from "express";

import {
  createRole,
//   deleteRole,
//   getRoleById,
//   getRoles,
//   updateRole,
} from "../controller/roles";
import { ROUTES } from "../constants/routePaths";

const roleRouter = express.Router();

roleRouter.post(ROUTES.APP.ROOT, createRole);
// roleRouter.get(ROUTES.APP.ROOT, getRoles);
// roleRouter.get(ROUTES.ROLES.BY_ID, getRoleById);
// roleRouter.put(ROUTES.ROLES.BY_ID, updateRole);
// roleRouter.delete(ROUTES.ROLES.BY_ID, deleteRole);

export default roleRouter;
