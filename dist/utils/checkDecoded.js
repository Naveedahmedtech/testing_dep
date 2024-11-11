"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDecodedWithId = void 0;
const CustomError_1 = require("./CustomError");
const isDecodedWithId = (decoded) => {
    if (typeof decoded === "object" && decoded !== null && "id" in decoded) {
        return true;
    }
    else {
        throw new CustomError_1.CustomError("Invalid JWT payload type received", 400);
    }
};
exports.isDecodedWithId = isDecodedWithId;
