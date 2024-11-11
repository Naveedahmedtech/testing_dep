"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// ** configs
const logger_1 = __importDefault(require("./config/logger"));
const config_1 = require("./config");
// ** routes
const routes_1 = __importDefault(require("./routes"));
// ** external middlewares
const cors_1 = __importDefault(require("cors"));
const express_session_1 = __importDefault(require("express-session"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
// ** middlewares
const requestLogger_1 = require("./middlewares/requestLogger");
const notFountHandler_1 = require("./middlewares/notFountHandler");
const errorHandler_1 = require("./middlewares/errorHandler");
const rateLimit_1 = require("./middlewares/rateLimit");
const routePaths_1 = require("./constants/routePaths");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: [
        "*",
        "http://localhost:5173",
        "https://naveed-task-manager.netlify.app",
    ],
    credentials: true,
}));
app.use(requestLogger_1.requestLogger);
app.use((0, express_session_1.default)({
    secret: "session-secret-key",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
}));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.static("public"));
app.use((0, helmet_1.default)());
app.use((0, compression_1.default)());
app.use(rateLimit_1.rateLimiterMiddleware);
app.use(routePaths_1.ROUTES.APP.VERSION_1, routes_1.default);
app.use(notFountHandler_1.notFoundHandler);
app.use(errorHandler_1.errorHandler);
app.listen(config_1.PORT, () => {
    logger_1.default.info(`Server running in ${config_1.NODE_ENV} mode on port ${config_1.PORT}`);
});
exports.default = app;
