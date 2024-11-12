"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRole = void 0;
const CustomError_1 = require("../../utils/CustomError");
const prisma_1 = __importDefault(require("../../prisma"));
const responseHandler_1 = require("../../utils/responseHandler");
const createRole = async (req, res, next) => {
    try {
        console.log(req.body);
        const { name, description } = req.body;
        console.log("Creating role with data:", { name, description });
        const newRole = await prisma_1.default.role.create({
            data: { name: name.toUpperCase(), description },
        });
        console.log("Role created successfully:", newRole);
        return (0, responseHandler_1.sendSuccessResponse)(res, "Role created successfully.", newRole, 201);
    }
    catch (error) {
        if (error.code === "P2002") {
            return next(new CustomError_1.CustomError("Role name already exists!", 409));
        }
        console.error("prisma:error", error); // Enhanced error logging
        next(error);
    }
};
exports.createRole = createRole;
