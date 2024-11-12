import { CustomError } from "../../utils/CustomError";
import prisma from "../../prisma";
import { sendSuccessResponse } from "../../utils/responseHandler";
import { Response, NextFunction, Request } from "express";
import { isDecodedWithId } from "../../utils/checkDecoded";

// Create a new task
export const createTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = (req as any).user;
  const { decoded } = user! || {};
  const { title, description, priority, status, dueDate } = req.body;

  try {
    if (isDecodedWithId(decoded)) {
      const task = await prisma.task.create({
        data: {
          title,
          description,
          priority: priority?.toUpperCase() || "MEDIUM",
          status: status?.toUpperCase() || "PENDING",
          dueDate: dueDate ? new Date(dueDate) : undefined,
          user: { connect: { id: decoded.id } },
        },
      });

      return sendSuccessResponse(res, "Task created successfully", task, 201);
    }
  } catch (error) {
    next(error);
  }
};

// Get all tasks for a user (with pagination and optional status/priority filtering)
export const getTasks = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { page = 1, limit = 10, status, priority, search } = req.query;
  const user = (req as any).user;
  const { decoded } = user! || {};

  try {
    if (isDecodedWithId(decoded)) {
      const userId = decoded.id;

      // Build the filter dynamically
      const whereFilter: any = {
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

      const tasks = await prisma.task.findMany({
        where: whereFilter,
        skip: (parseInt(page as string) - 1) * parseInt(limit as string),
        take: parseInt(limit as string),
        orderBy: { createdAt: "desc" },
      });

      const totalTasks = await prisma.task.count({ where: whereFilter });
      const totalPages = Math.ceil(totalTasks / parseInt(limit as string));

      return sendSuccessResponse(res, "Tasks fetched successfully", {
        pagination: { page, limit, totalPages, totalTasks },
        tasks,
      });
    }
  } catch (error) {
    next(error);
  }
};

// Update an existing task
export const updateTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = (req as any).user;
  const { decoded } = user! || {};
  const { id } = req.params;
  const { title, description, priority, status, dueDate } = req.body;

  try {
    if (isDecodedWithId(decoded)) {
      const existingTask = await prisma.task.findFirst({
        where: { id, userId: decoded.id },
      });

      if (!existingTask) {
        return next(
          new CustomError("Task not found or unauthorized access", 404)
        );
      }

      const updatedTask = await prisma.task.update({
        where: { id },
        data: {
          title,
          description,
          priority: priority?.toUpperCase(),
          status: status?.toUpperCase(),
          dueDate: dueDate ? new Date(dueDate) : undefined,
        },
      });

      return sendSuccessResponse(res, "Task updated successfully", updatedTask);
    }
  } catch (error) {
    next(error);
  }
};

// Delete a task
export const deleteTask = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = (req as any).user;
  const { decoded } = user! || {};

  const { id } = req.params;

  try {
    if (isDecodedWithId(decoded)) {
      const existingTask = await prisma.task.findFirst({
        where: { id, userId: decoded.id },
      });

      if (!existingTask) {
        return next(
          new CustomError("Task not found or unauthorized access", 404)
        );
      }

      await prisma.task.delete({ where: { id } });
      return sendSuccessResponse(res, "Task deleted successfully");
    }
  } catch (error) {
    next(error);
  }
};

export const getUserTaskCounts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = (req as any).user;
  const { decoded } = user! || {};

  try {
    if (isDecodedWithId(decoded)) {
      const userId = decoded.id;

      // Fetch task counts by status for the specified user
      const [totalTasks, completedTasks, pendingTasks, inProgressTasks] =
        await Promise.all([
          prisma.task.count({ where: { userId } }),
          prisma.task.count({ where: { userId, status: "COMPLETED" } }),
          prisma.task.count({ where: { userId, status: "PENDING" } }),
          prisma.task.count({ where: { userId, status: "IN_PROGRESS" } }),
        ]);

      return sendSuccessResponse(res, "Task counts retrieved successfully", {
        totalTasks,
        completedTasks,
        pendingTasks,
        inProgressTasks,
      });
    }
  } catch (error) {
    next(error);
  }
};

export const getAllUserTasksForAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { page = 1, limit = 10, status, priority, search } = req.query;

  try {
    // Build dynamic filters based on query parameters
    const whereFilter: any = {
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
    const tasks = await prisma.task.findMany({
      where: whereFilter,
      skip: (parseInt(page as string) - 1) * parseInt(limit as string),
      take: parseInt(limit as string),
      include: {
        user: { select: { id: true, email: true } }, // Include user details
      },
      orderBy: { createdAt: "desc" },
    });

    // Calculate total tasks and pages
    const totalTasks = await prisma.task.count({ where: whereFilter });
    const totalPages = Math.ceil(totalTasks / parseInt(limit as string));

    return sendSuccessResponse(res, "Tasks fetched successfully", {
      pagination: {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
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
  } catch (error) {
    next(error);
  }
};
