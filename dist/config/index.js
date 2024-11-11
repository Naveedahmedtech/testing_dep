"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NODE_ENV = exports.PORT = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env';
dotenv_1.default.config({ path: envFile });
exports.PORT = process.env.PORT || 3000;
exports.NODE_ENV = process.env.NODE_ENV || 'development';
