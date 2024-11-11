"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const CustomError_1 = require("../utils/CustomError");
const responseHandler_1 = require("../utils/responseHandler");
const logger_1 = __importDefault(require("../config/logger"));
const errorHandler = (err, req, res, next) => {
    const statusCode = err instanceof CustomError_1.CustomError
        ? err.statusCode
        : err.code === "EBADCSRFTOKEN"
            ? 403
            : err.statusCode === 413
                ? 413
                : 500;
    const message = err instanceof CustomError_1.CustomError
        ? err.message
        : err.code === "EBADCSRFTOKEN"
            ? "Invalid CSRF TOKEN"
            : err.statusCode === 413
                ? "Payload too large. Please reduce file size."
                : "INTERNAL SERVER ERROR!";
    logger_1.default.error(message, { statusCode, stack: err.stack });
    let stack = err.stack;
    if (process.env.NODE_ENV === "prod") {
        stack = "";
    }
    (0, responseHandler_1.sendErrorResponse)(res, message, statusCode, stack);
};
exports.errorHandler = errorHandler;
