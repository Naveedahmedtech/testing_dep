"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ACCESS_CONTROL = exports.ROUTES = exports.ROLES = void 0;
// Define roles as constants
exports.ROLES = {
    ADMIN: "ADMIN",
    USER: "USER",
    MANAGER: "MANAGER",
};
// Define routes as constants
exports.ROUTES = {
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
exports.ACCESS_CONTROL = {
    [`GET ${exports.ROUTES.APP.VERSION_1}${exports.ROUTES.USERS.BASE}/`]: [exports.ROLES.ADMIN],
    [`POST ${exports.ROUTES.APP.VERSION_1}${exports.ROUTES.USERS.BASE}/${exports.ROUTES.USERS.OVERSIGHT}`]: [exports.ROLES.ADMIN],
    [`GET ${exports.ROUTES.APP.VERSION_1}${exports.ROUTES.APP.BY_ID}`]: [
        exports.ROLES.ADMIN,
        exports.ROLES.USER,
    ],
    [`GET ${exports.ROUTES.APP.VERSION_1}${exports.ROUTES.USERS.BY_TOKEN}`]: [
        exports.ROLES.ADMIN,
        exports.ROLES.USER,
        exports.ROLES.MANAGER,
    ],
    [`POST ${exports.ROUTES.APP.VERSION_1}${exports.ROUTES.USERS.BASE}${exports.ROUTES.USERS.BASE}`]: [
        exports.ROLES.ADMIN,
    ],
    [`DELETE ${exports.ROUTES.APP.VERSION_1}${exports.ROUTES.APP.BY_ID}`]: [exports.ROLES.ADMIN],
    [`GET ${exports.ROUTES.APP.VERSION_1}${exports.ROUTES.ROLES.BASE}`]: [exports.ROLES.ADMIN],
    [`POST ${exports.ROUTES.APP.VERSION_1}${exports.ROUTES.ROLES.BASE}`]: [exports.ROLES.ADMIN],
    [`GET ${exports.ROUTES.APP.VERSION_1}${exports.ROUTES.PERMISSIONS.BASE}`]: [exports.ROLES.ADMIN],
};
