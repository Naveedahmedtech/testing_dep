"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.createToken = void 0;
const constants_1 = require("../constants");
const jsonwebtoken_1 = require("jsonwebtoken");
const createToken = async (data, expiry) => {
    return (0, jsonwebtoken_1.sign)({
        id: data.id,
    }, constants_1.ENV.JWT.SECRET, { expiresIn: expiry || "1h" });
};
exports.createToken = createToken;
const verifyToken = async (token) => {
    try {
        const decoded = (0, jsonwebtoken_1.verify)(token, constants_1.ENV.JWT.SECRET);
        return decoded;
    }
    catch (error) {
        throw new Error("Token verification failed");
    }
};
exports.verifyToken = verifyToken;
