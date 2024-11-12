"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = exports.registerSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.registerSchema = joi_1.default.object({
    email: joi_1.default.string().trim().email().required().messages({
        "string.email": "Please enter a valid email address",
        "any.required": "Email is required",
    }),
    password: joi_1.default.string().trim().required(),
    role: joi_1.default.string().required()
});
exports.loginSchema = joi_1.default.object({
    email: joi_1.default.string().trim().required(),
    password: joi_1.default.string().trim().required(),
});
