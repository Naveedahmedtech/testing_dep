"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.csrfTokenHandler = void 0;
const csrf_1 = __importDefault(require("csrf"));
const CustomError_1 = require("../utils/CustomError");
const tokens = new csrf_1.default();
// CSRF token handler middleware
const csrfTokenHandler = (req, res, next) => {
    const session = req.session;
    if (!session) {
        return next(new Error("Session is not initialized."));
    }
    if (!session.secret) {
        session.secret = tokens.secretSync(); // Store the CSRF secret in the session
    }
    const token = tokens.create(session.secret); // Create CSRF token using session secret
    res.cookie("xsrf-token", token); // Set the token in a cookie
    res.locals.csrfToken = token;
    next();
};
exports.csrfTokenHandler = csrfTokenHandler;
// CSRF protection middleware
const csrfProtection = (req, res, next) => {
    const token = req.cookies["xsrf-token"];
    const session = req.session;
    if (!token || !tokens.verify(session?.secret, token)) {
        // Verify CSRF token using session secret
        const error = new CustomError_1.CustomError("Something went wrong, please refresh the page or contact us", 403);
        return next(error);
    }
    next();
};
exports.default = csrfProtection;
