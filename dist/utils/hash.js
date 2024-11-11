"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyPassword = exports.getHashPassword = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const getHashPassword = async (password) => {
    const salt = bcryptjs_1.default.genSaltSync(10);
    const hashPassword = bcryptjs_1.default.hashSync(password, salt);
    return hashPassword;
};
exports.getHashPassword = getHashPassword;
const verifyPassword = async (plainPassword, hashedPassword) => {
    if (hashedPassword) {
        return await bcryptjs_1.default.compare(plainPassword, hashedPassword);
    }
    return false;
};
exports.verifyPassword = verifyPassword;
