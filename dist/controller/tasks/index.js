"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUserTasksForAdmin = exports.getUserTaskCounts = exports.deleteTask = exports.updateTask = exports.getTasks = exports.createTask = void 0;
const CustomError_1 = require("../../utils/CustomError");
const prisma_1 = __importDefault(require("../../prisma"));
const responseHandler_1 = require("../../utils/responseHandler");
const checkDecoded_1 = require("../../utils/checkDecoded");
// Create a new task
const createTask = async (req, res, next) => {
    const { decoded } = req.user || {};
    const { title, description, priority, status, dueDate } = req.body;
    try {
        if ((0, checkDecoded_1.isDecodedWithId)(decoded)) {
            const task = await prisma_1.default.task.create({
                data: {
                    title,
                    description,
                    priority: priority?.toUpperCase() || "MEDIUM",
                    status: status?.toUpperCase() || "PENDING",
                    dueDate: dueDate ? new Date(dueDate) : undefined,
                    user: { connect: { id: decoded.id } },
                },
            });
            return (0, responseHandler_1.sendSuccessResponse)(res, "Task created successfully", task, 201);
        }
    }
    catch (error) {
        next(error);
    }
};
exports.createTask = createTask;
// Get all tasks for a user (with pagination and optional status/priority filtering)
const getTasks = async (req, res, next) => {
    const { page = 1, limit = 10, status, priority, search } = req.query;
    const { decoded } = req.user || {};
    try {
        if ((0, checkDecoded_1.isDecodedWithId)(decoded)) {
            const userId = decoded.id;
            // Build the filter dynamically
            const whereFilter = {
                userId,
            };
            if (status && status !== "null" && status !== "undefined") {
                whereFilter.status = status.toString().toUpperCase();
            }
            if (priority && priority !== "null" && priority !== "undefined") {
                whereFilter.priority = priority.toString().toUpperCase();
            }
            if (search && search !== "null" && search !== "undefined") {
                whereFilter.title = {
                    contains: search.toString(),
                    mode: "insensitive", // Case-insensitive search
                };
            }
            const tasks = await prisma_1.default.task.findMany({
                where: whereFilter,
                skip: (parseInt(page) - 1) * parseInt(limit),
                take: parseInt(limit),
                orderBy: { createdAt: "desc" },
            });
            const totalTasks = await prisma_1.default.task.count({ where: whereFilter });
            const totalPages = Math.ceil(totalTasks / parseInt(limit));
            return (0, responseHandler_1.sendSuccessResponse)(res, "Tasks fetched successfully", {
                pagination: { page, limit, totalPages, totalTasks },
                tasks,
            });
        }
    }
    catch (error) {
        next(error);
    }
};
exports.getTasks = getTasks;
// Update an existing task
const updateTask = async (req, res, next) => {
    const { decoded } = req.user || {};
    const { id } = req.params;
    const { title, description, priority, status, dueDate } = req.body;
    try {
        if ((0, checkDecoded_1.isDecodedWithId)(decoded)) {
            const existingTask = await prisma_1.default.task.findFirst({
                where: { id, userId: decoded.id },
            });
            if (!existingTask) {
                return next(new CustomError_1.CustomError("Task not found or unauthorized access", 404));
            }
            const updatedTask = await prisma_1.default.task.update({
                where: { id },
                data: {
                    title,
                    description,
                    priority: priority?.toUpperCase(),
                    status: status?.toUpperCase(),
                    dueDate: dueDate ? new Date(dueDate) : undefined,
                },
            });
            return (0, responseHandler_1.sendSuccessResponse)(res, "Task updated successfully", updatedTask);
        }
    }
    catch (error) {
        next(error);
    }
};
exports.updateTask = updateTask;
// Delete a task
const deleteTask = async (req, res, next) => {
    const { decoded } = req.user || {};
    const { id } = req.params;
    try {
        if ((0, checkDecoded_1.isDecodedWithId)(decoded)) {
            const existingTask = await prisma_1.default.task.findFirst({
                where: { id, userId: decoded.id },
            });
            if (!existingTask) {
                return next(new CustomError_1.CustomError("Task not found or unauthorized access", 404));
            }
            await prisma_1.default.task.delete({ where: { id } });
            return (0, responseHandler_1.sendSuccessResponse)(res, "Task deleted successfully");
        }
    }
    catch (error) {
        next(error);
    }
};
exports.deleteTask = deleteTask;
const getUserTaskCounts = async (req, res, next) => {
    const { decoded } = req.user || {};
    try {
        if ((0, checkDecoded_1.isDecodedWithId)(decoded)) {
            const userId = decoded.id;
            // Fetch task counts by status for the specified user
            const [totalTasks, completedTasks, pendingTasks, inProgressTasks] = await Promise.all([
                prisma_1.default.task.count({ where: { userId } }),
                prisma_1.default.task.count({ where: { userId, status: "COMPLETED" } }),
                prisma_1.default.task.count({ where: { userId, status: "PENDING" } }),
                prisma_1.default.task.count({ where: { userId, status: "IN_PROGRESS" } }),
            ]);
            return (0, responseHandler_1.sendSuccessResponse)(res, "Task counts retrieved successfully", {
                totalTasks,
                completedTasks,
                pendingTasks,
                inProgressTasks,
            });
        }
    }
    catch (error) {
        next(error);
    }
};
exports.getUserTaskCounts = getUserTaskCounts;
const getAllUserTasksForAdmin = async (req, res, next) => {
    const { page = 1, limit = 10, status, priority, search } = req.query;
    try {
        // Build dynamic filters based on query parameters
        const whereFilter = {
            user: {
                role: {
                    name: "USER", // Restrict to tasks of users with the role 'USER'
                },
            },
        };
        if (status && status !== "null" && status !== "undefined") {
            whereFilter.status = status.toString().toUpperCase();
        }
        if (priority && priority !== "null" && priority !== "undefined") {
            whereFilter.priority = priority.toString().toUpperCase();
        }
        if (search && search !== "null" && search !== "undefined") {
            whereFilter.title = {
                contains: search.toString(),
                mode: "insensitive", // Case-insensitive search
            };
        }
        // Fetch paginated tasks including user details for admin
        const tasks = await prisma_1.default.task.findMany({
            where: whereFilter,
            skip: (parseInt(page) - 1) * parseInt(limit),
            take: parseInt(limit),
            include: {
                user: { select: { id: true, email: true } }, // Include user details
            },
            orderBy: { createdAt: "desc" },
        });
        // Calculate total tasks and pages
        const totalTasks = await prisma_1.default.task.count({ where: whereFilter });
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
                    id: task.user.id,
                    email: task.user.email, // User's email for reference
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
exports.getAllUserTasksForAdmin = getAllUserTasksForAdmin;
