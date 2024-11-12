"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAdminDashboardCounts = exports.getManagerAssignedTasks = exports.assignManagerToUsers = exports.getUserByToken = exports.getUsers = void 0;
const routePaths_1 = require("../../constants/routePaths");
const prisma_1 = __importDefault(require("../../prisma"));
const checkDecoded_1 = require("../../utils/checkDecoded");
const CustomError_1 = require("../../utils/CustomError");
const responseHandler_1 = require("../../utils/responseHandler");
const getUsers = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const roleFilter = req.query.role;
        const allowedRoles = [routePaths_1.ROLES.USER, routePaths_1.ROLES.MANAGER];
        if (roleFilter && !allowedRoles.includes(roleFilter.toUpperCase())) {
            return next(new CustomError_1.CustomError("Invalid role filter", 400));
        }
        const whereFilter = {
            role: { name: { not: "ADMIN" } },
        };
        if (roleFilter) {
            whereFilter.role.name = roleFilter.toUpperCase();
        }
        const users = await prisma_1.default.user.findMany({
            where: whereFilter,
            skip: (page - 1) * limit,
            take: limit,
            include: { role: true }, // Include role details
        });
        const totalUsers = await prisma_1.default.user.count({
            where: whereFilter,
        });
        const totalPages = Math.ceil(totalUsers / limit);
        return (0, responseHandler_1.sendSuccessResponse)(res, "Users fetched successfully", {
            pagination: {
                page,
                limit,
                totalPages,
                totalUsers,
            },
            users: users.map((user) => ({
                id: user.id,
                email: user.email,
                role: user.role.name,
                createdAt: user.createdAt,
            })),
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getUsers = getUsers;
const getUserByToken = async (req, res, next) => {
    const { decoded } = req.user || {};
    try {
        if ((0, checkDecoded_1.isDecodedWithId)(decoded)) {
            const user = await prisma_1.default.user.findUnique({
                where: { id: decoded.id },
                include: {
                    role: {
                        include: {
                            permissions: {
                                select: {
                                    permission: {
                                        select: {
                                            name: true,
                                            description: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            });
            if (!user) {
                return next(new CustomError_1.CustomError("User not found", 404));
            }
            // Format the response to include roles and permissions
            const formattedPermissions = user.role.permissions.map((permissionRelation) => ({
                name: permissionRelation.permission.name,
                description: permissionRelation.permission.description,
            }));
            return (0, responseHandler_1.sendSuccessResponse)(res, "User fetched successfully", {
                id: user.id,
                email: user.email,
                role: user.role.name,
                permissions: formattedPermissions,
                createdAt: user.createdAt,
                updatedAt: user.updatedAt,
            });
        }
        else {
            return next(new CustomError_1.CustomError("Invalid token format", 403));
        }
    }
    catch (error) {
        next(error);
    }
};
exports.getUserByToken = getUserByToken;
const assignManagerToUsers = async (req, res, next) => {
    const { managerId, userIds } = req.body; // `userIds` is now an array of user IDs
    try {
        // Validate if the manager exists and has the correct role
        const manager = await prisma_1.default.user.findUnique({
            where: { id: managerId },
            include: { role: true },
        });
        if (!manager || manager.role.name !== "MANAGER") {
            return next(new CustomError_1.CustomError("Invalid manager ID or role", 400));
        }
        // Validate each user ID in the array and filter out invalid ones
        const validUsers = await prisma_1.default.user.findMany({
            where: {
                id: { in: userIds },
                role: { name: "USER" },
            },
        });
        const validUserIds = validUsers.map((user) => user.id);
        const invalidUserIds = userIds.filter((id) => !validUserIds.includes(id));
        if (invalidUserIds.length > 0) {
            return next(new CustomError_1.CustomError(`Some user IDs are invalid or do not have the USER role: ${invalidUserIds.join(", ")}`, 400));
        }
        // Check if any oversight relationships already exist for this manager and these users
        const existingOversights = await prisma_1.default.oversight.findMany({
            where: {
                managerId,
                userId: { in: validUserIds },
            },
        });
        const existingUserIds = new Set(existingOversights.map((o) => o.userId));
        const newUserIds = validUserIds.filter((id) => !existingUserIds.has(id));
        // If no new user IDs to assign, return a conflict error
        if (newUserIds.length === 0) {
            return next(new CustomError_1.CustomError("All specified users are already overseen by this manager", 409));
        }
        // Create oversight relationships for new users
        const oversightData = newUserIds.map((userId) => ({
            managerId,
            userId,
        }));
        const newOversights = await prisma_1.default.oversight.createMany({
            data: oversightData,
        });
        return (0, responseHandler_1.sendSuccessResponse)(res, "Manager assigned to users successfully", {
            assignedUsers: newUserIds,
            existingAssignments: Array.from(existingUserIds),
            newOversights,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.assignManagerToUsers = assignManagerToUsers;
const getManagerAssignedTasks = async (req, res, next) => {
    const { managerId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    try {
        const manager = await prisma_1.default.user.findUnique({
            where: { id: managerId },
            include: { role: true },
        });
        if (!manager || manager.role.name !== "MANAGER") {
            return next(new CustomError_1.CustomError("Invalid manager ID or role", 400));
        }
        const overseenUsers = await prisma_1.default.oversight.findMany({
            where: { managerId },
            select: { userId: true },
        });
        const userIds = overseenUsers.map((oversight) => oversight.userId);
        if (userIds.length === 0) {
            return (0, responseHandler_1.sendSuccessResponse)(res, "No users overseen by this manager", {
                tasks: [],
            });
        }
        const tasks = await prisma_1.default.task.findMany({
            where: {
                userId: { in: userIds },
            },
            skip: (parseInt(page) - 1) * parseInt(limit),
            take: parseInt(limit),
            include: {
                user: { select: { email: true } },
            },
            orderBy: { createdAt: "desc" },
        });
        const totalTasks = await prisma_1.default.task.count({
            where: { userId: { in: userIds } },
        });
        const totalPages = Math.ceil(totalTasks / parseInt(limit));
        return (0, responseHandler_1.sendSuccessResponse)(res, "Tasks fetched successfully", {
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                totalPages,
                totalTasks,
            },
            tasks: tasks.map((task) => ({
                taskId: task.id,
                title: task.title,
                description: task.description,
                priority: task.priority,
                status: task.status,
                dueDate: task.dueDate,
                assignedUser: {
                    id: task.userId,
                    email: task.user.email,
                },
                createdAt: task.createdAt,
                updatedAt: task.updatedAt,
            })),
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getManagerAssignedTasks = getManagerAssignedTasks;
const getAdminDashboardCounts = async (req, res, next) => {
    try {
        // Fetch counts in parallel to improve efficiency
        const [totalTasks, totalCompletedTasks, totalUsers, totalManagers] = await Promise.all([
            prisma_1.default.task.count(),
            prisma_1.default.task.count({ where: { status: "COMPLETED" } }),
            prisma_1.default.user.count({ where: { role: { name: "USER" } } }),
            prisma_1.default.user.count({ where: { role: { name: "MANAGER" } } }),
        ]);
        return (0, responseHandler_1.sendSuccessResponse)(res, "Dashboard counts fetched successfully", {
            totalTasks,
            totalCompletedTasks,
            totalUsers,
            totalManagers,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getAdminDashboardCounts = getAdminDashboardCounts;
