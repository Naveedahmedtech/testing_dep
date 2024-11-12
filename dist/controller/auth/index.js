"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.loginUser = exports.registerUser = void 0;
const CustomError_1 = require("../../utils/CustomError");
const hash_1 = require("../../utils/hash");
const jwt_1 = require("../../utils/jwt");
const prisma_1 = __importDefault(require("../../prisma"));
const responseHandler_1 = require("../../utils/responseHandler");
const permissionsStructure = {
    ADMIN: [
        "Manage Users",
        "Manage Roles",
        "Manage Permissions",
        "Full Task Access",
    ],
    MANAGER: [
        "View Assigned Users",
        "Manage Own Tasks",
        "Manage Assigned User Tasks",
    ],
    USER: ["Manage Own Tasks"],
};
const registerUser = async (req, res, next) => {
    const { email, password, role } = req.body;
    try {
        // Validate if role exists
        const roleKey = role.toUpperCase(); // Use uppercase to match the permissions structure
        const existingRole = await prisma_1.default.role.findUnique({
            where: { name: roleKey },
        });
        if (!existingRole) {
            return next(new CustomError_1.CustomError(`Role ${role} does not exist`, 404));
        }
        // Check for existing user
        const existingUser = await prisma_1.default.user.findUnique({
            where: { email },
        });
        if (existingUser) {
            return next(new CustomError_1.CustomError("Email already exists!", 409));
        }
        // Hash password
        const hashedPassword = await (0, hash_1.getHashPassword)(password);
        // Retrieve permissions to assign based on role
        const permissionsToAssign = permissionsStructure[roleKey];
        if (!permissionsToAssign) {
            return next(new CustomError_1.CustomError(`No permissions defined for role ${role}`, 400));
        }
        // Create the user with the specified role
        const user = await prisma_1.default.user.create({
            data: {
                email,
                password: hashedPassword,
                role: { connect: { id: existingRole.id } },
            },
        });
        // Find and assign permissions
        const permissions = await prisma_1.default.permission.findMany({
            where: {
                name: {
                    in: permissionsToAssign.map((permission) => permission.toUpperCase().replace(/ /g, "_")),
                },
            },
        });
        await prisma_1.default.rolePermission.createMany({
            data: permissions.map((permission) => ({
                roleId: existingRole.id,
                permissionId: permission.id,
            })),
        });
        // Send a success response
        return (0, responseHandler_1.sendSuccessResponse)(res, "User registered successfully. Please verify your email to complete registration.", { id: user.id, email: user.email, role: roleKey }, 201);
    }
    catch (error) {
        next(error);
    }
};
exports.registerUser = registerUser;
const loginUser = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const user = await prisma_1.default.user.findUnique({
            where: { email },
            include: { role: true },
        });
        if (!user) {
            return next(new CustomError_1.CustomError("Invalid email or password", 401));
        }
        const isPasswordValid = await (0, hash_1.verifyPassword)(password, user.password);
        if (!isPasswordValid) {
            return next(new CustomError_1.CustomError("Invalid email or password", 401));
        }
        const accessToken = await (0, jwt_1.createToken)({ id: user.id }, "1d");
        const refreshToken = await (0, jwt_1.createToken)({ id: user.id }, "7d");
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
        });
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax",
        });
        return (0, responseHandler_1.sendSuccessResponse)(res, "Login successful", {
            id: user.id,
            email: user.email,
            role: user.role.name,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.loginUser = loginUser;
const logout = async (req, res, next) => {
    try {
        res.cookie("accessToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production" ? true : false,
            sameSite: false,
        });
        res.cookie("refreshToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production" ? true : false,
            sameSite: false,
        });
        // Respond with success message and token
        return (0, responseHandler_1.sendSuccessResponse)(res, "Logout Successfully!", {}, 200);
    }
    catch (error) {
        next(error);
    }
};
exports.logout = logout;
