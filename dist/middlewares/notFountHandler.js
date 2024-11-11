"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundHandler = void 0;
const CustomError_1 = require("../utils/CustomError");
const logger_1 = __importDefault(require("../config/logger"));
const notFoundHandler = (req, res, next) => {
    const error = new CustomError_1.CustomError("Request not found!", 404);
    logger_1.default.warn(error.message, { statusCode: error.statusCode });
    next(error);
};
exports.notFoundHandler = notFoundHandler;
