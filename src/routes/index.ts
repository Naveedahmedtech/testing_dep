import express from 'express';
// ** routes
// import roleRouter from "./roles";
// import permissionRouter from "./permissions";
// import authRouter from "./auth";
// import userRouter from "./users";
// import tasksRouter from "./tasks";
import { ROUTES } from "../constants/routePaths";

const router = express.Router();

router.get(ROUTES.AUTH.BASE, (req: any, res: any) => {
  res.send("HELLO WORLD");
});
// router.use(ROUTES.USERS.BASE, userRouter);
// router.use(ROUTES.ROLES.BASE, roleRouter);
// router.use(ROUTES.PERMISSIONS.BASE, permissionRouter);
// router.use(ROUTES.TASK.BASE, tasksRouter);


export default router;
