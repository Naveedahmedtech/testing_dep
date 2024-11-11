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
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)({ origin: "*" }));
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
app.use("/api", routes_1.default);
app.listen(config_1.PORT, () => {
    logger_1.default.info(`Server running in ${config_1.NODE_ENV} mode on port ${config_1.PORT}`);
});
exports.default = app;
