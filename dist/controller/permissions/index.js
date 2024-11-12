"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPermission = void 0;
const CustomError_1 = require("../../utils/CustomError");
const prisma_1 = __importDefault(require("../../prisma"));
const responseHandler_1 = require("../../utils/responseHandler");
const createPermission = async (req, res, next) => {
    try {
        const { name, description } = req.body;
        const newPermission = await prisma_1.default.permission.create({
            data: { name, description },
        });
        return (0, responseHandler_1.sendSuccessResponse)(res, "Permission created successfully.", newPermission, 201);
    }
    catch (error) {
        if (error.code === "P2002") {
            return next(new CustomError_1.CustomError("Permission name already exists!", 409));
        }
        next(error);
    }
};
exports.createPermission = createPermission;
