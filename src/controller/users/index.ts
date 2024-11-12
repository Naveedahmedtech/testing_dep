import { ROLES } from "../../constants/routePaths";
import prisma from "../../prisma";
import { isDecodedWithId } from "../../utils/checkDecoded";
import { CustomError } from "../../utils/CustomError";
import { sendSuccessResponse } from "../../utils/responseHandler";
import { NextFunction, Request, Response } from "express";

export const getUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const roleFilter = req.query.role as string;

    const allowedRoles = [ROLES.USER, ROLES.MANAGER];
    if (roleFilter && !allowedRoles.includes(roleFilter.toUpperCase())) {
      return next(new CustomError("Invalid role filter", 400));
    }

    const whereFilter: any = {
      role: { name: { not: "ADMIN" } },
    };

    if (roleFilter) {
      whereFilter.role.name = roleFilter.toUpperCase();
    }

    const users = await prisma.user.findMany({
      where: whereFilter,
      skip: (page - 1) * limit,
      take: limit,
      include: { role: true }, // Include role details
    });

    const totalUsers = await prisma.user.count({
      where: whereFilter,
    });

    const totalPages = Math.ceil(totalUsers / limit);

    return sendSuccessResponse(res, "Users fetched successfully", {
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
  } catch (error) {
    next(error);
  }
};

export const getUserByToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = (req as any).user;
  const { decoded } = user! || {};
  console.log("decoded A BI YAAR 🤐😭", decoded);
  try {
    if (isDecodedWithId(decoded)) {
      const user = await prisma.user.findUnique({
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
        return next(new CustomError("User not found", 404));
      }

      // Format the response to include roles and permissions
      const formattedPermissions = user.role.permissions.map(
        (permissionRelation) => ({
          name: permissionRelation.permission.name,
          description: permissionRelation.permission.description,
        })
      );

      return sendSuccessResponse(res, "User fetched successfully", {
        id: user.id,
        email: user.email,
        role: user.role.name,
        permissions: formattedPermissions,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      });
    } else {
      return next(new CustomError("Invalid token format", 403));
    }
  } catch (error) {
    next(error);
  }
};



export const assignManagerToUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { managerId, userIds } = req.body; // `userIds` is now an array of user IDs

  try {
    // Validate if the manager exists and has the correct role
    const manager = await prisma.user.findUnique({
      where: { id: managerId },
      include: { role: true },
    });

    if (!manager || manager.role.name !== "MANAGER") {
      return next(new CustomError("Invalid manager ID or role", 400));
    }

    // Validate each user ID in the array and filter out invalid ones
    const validUsers = await prisma.user.findMany({
      where: {
        id: { in: userIds },
        role: { name: "USER" },
      },
    });

    const validUserIds = validUsers.map((user) => user.id);
    const invalidUserIds = userIds.filter((id:string) => !validUserIds.includes(id));

    if (invalidUserIds.length > 0) {
      return next(
        new CustomError(
          `Some user IDs are invalid or do not have the USER role: ${invalidUserIds.join(
            ", "
          )}`,
          400
        )
      );
    }

    // Check if any oversight relationships already exist for this manager and these users
    const existingOversights = await prisma.oversight.findMany({
      where: {
        managerId,
        userId: { in: validUserIds },
      },
    });

    const existingUserIds = new Set(existingOversights.map((o) => o.userId));
    const newUserIds = validUserIds.filter((id) => !existingUserIds.has(id));

    // If no new user IDs to assign, return a conflict error
    if (newUserIds.length === 0) {
      return next(
        new CustomError(
          "All specified users are already overseen by this manager",
          409
        )
      );
    }

    // Create oversight relationships for new users
    const oversightData = newUserIds.map((userId) => ({
      managerId,
      userId,
    }));

    const newOversights = await prisma.oversight.createMany({
      data: oversightData,
    });

    return sendSuccessResponse(res, "Manager assigned to users successfully", {
      assignedUsers: newUserIds,
      existingAssignments: Array.from(existingUserIds),
      newOversights,
    });
  } catch (error) {
    next(error);
  }
};



export const getManagerAssignedTasks = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { managerId } = req.params; 
  const { page = 1, limit = 10 } = req.query; 

  try {
    const manager = await prisma.user.findUnique({
      where: { id: managerId },
      include: { role: true },
    });

    if (!manager || manager.role.name !== "MANAGER") {
      return next(new CustomError("Invalid manager ID or role", 400));
    }

    const overseenUsers = await prisma.oversight.findMany({
      where: { managerId },
      select: { userId: true },
    });

    const userIds = overseenUsers.map((oversight) => oversight.userId);

    if (userIds.length === 0) {
      return sendSuccessResponse(res, "No users overseen by this manager", {
        tasks: [],
      });
    }

    const tasks = await prisma.task.findMany({
      where: {
        userId: { in: userIds },
      },
      skip: (parseInt(page as string) - 1) * parseInt(limit as string),
      take: parseInt(limit as string),
      include: {
        user: { select: { email: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    const totalTasks = await prisma.task.count({
      where: { userId: { in: userIds } },
    });
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
          id: task.userId,
          email: task.user.email, 
        },
        createdAt: task.createdAt,
        updatedAt: task.updatedAt,
      })),
    });
  } catch (error) {
    next(error);
  }
};



export const getAdminDashboardCounts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Fetch counts in parallel to improve efficiency
    const [totalTasks, totalCompletedTasks, totalUsers, totalManagers] =
      await Promise.all([
        prisma.task.count(),
        prisma.task.count({ where: { status: "COMPLETED" } }),
        prisma.user.count({ where: { role: { name: "USER" } } }),
        prisma.user.count({ where: { role: { name: "MANAGER" } } }),
      ]);

    return sendSuccessResponse(res, "Dashboard counts fetched successfully", {
      totalTasks,
      totalCompletedTasks,
      totalUsers,
      totalManagers,
    });
  } catch (error) {
    next(error);
  }
};
