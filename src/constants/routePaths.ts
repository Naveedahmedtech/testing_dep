// Define roles as constants
export const ROLES = {
  ADMIN: "ADMIN",
  USER: "USER",
  MANAGER: "MANAGER",
};

// Define routes as constants
export const ROUTES = {
  APP: {
    ROOT: "/",
    VERSION_1: "/api/v1",
    BY_ID: "/:id",
  },
  AUTH: {
    BASE: "/auth",
    REGISTER: "/register",
    SIGN_IN: "/sign-in",
    LOGOUT: "/logout",
  },
  USERS: {
    BASE: "/users",
    BY_TOKEN: "/by-token",
    OVERSIGHT: "/oversight",
    MANAGER_ASSIGN_TASKS: "/manager/:managerId/tasks",
    GET_DASHBOARD_COUNT: "/dashboard/count"
  },
  ROLES: {
    BASE: "/roles",
    BY_ID: "/roles/:id",
  },
  PERMISSIONS: {
    BASE: "/permissions",
    BY_ID: "/permissions/:id",
  },
  TASK: {
    BASE: "/tasks",
    BY_USER_TASKS_COUNT: "/by-user/count",
    GET_ALL_TASKS: "/all-tasks",
  },
};

// Use role constants in ACCESS_CONTROL
export const ACCESS_CONTROL: Record<string, string[]> = {
  [`GET ${ROUTES.APP.VERSION_1}${ROUTES.USERS.BASE}/`]: [ROLES.ADMIN],
  [`POST ${ROUTES.APP.VERSION_1}${ROUTES.USERS.BASE}/${ROUTES.USERS.OVERSIGHT}`]: [ROLES.ADMIN],
  [`GET ${ROUTES.APP.VERSION_1}${ROUTES.APP.BY_ID}`]: [
    ROLES.ADMIN,
    ROLES.USER,
  ],
  [`GET ${ROUTES.APP.VERSION_1}${ROUTES.USERS.BY_TOKEN}`]: [
    ROLES.ADMIN,
    ROLES.USER,
    ROLES.MANAGER,
  ],
  [`POST ${ROUTES.APP.VERSION_1}${ROUTES.USERS.BASE}${ROUTES.USERS.BASE}`]: [
    ROLES.ADMIN,
  ],
  [`DELETE ${ROUTES.APP.VERSION_1}${ROUTES.APP.BY_ID}`]: [ROLES.ADMIN],
  [`GET ${ROUTES.APP.VERSION_1}${ROUTES.ROLES.BASE}`]: [ROLES.ADMIN],
  [`POST ${ROUTES.APP.VERSION_1}${ROUTES.ROLES.BASE}`]: [ROLES.ADMIN],
  [`GET ${ROUTES.APP.VERSION_1}${ROUTES.PERMISSIONS.BASE}`]: [ROLES.ADMIN],
};
