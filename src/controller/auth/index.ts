import { CustomError } from "../../utils/CustomError";
import { getHashPassword, verifyPassword } from "../../utils/hash";
import { createToken } from "../../utils/jwt";
import prisma from "../../prisma";
import { sendSuccessResponse } from "../../utils/responseHandler";
import { Request, Response, NextFunction } from "express";

const permissionsStructure: { [role: string]: string[] } = {
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

export const registerUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password, role } = req.body;

  try {
    // Validate if role exists
    const roleKey = role.toUpperCase(); // Use uppercase to match the permissions structure
    const existingRole = await prisma.role.findUnique({
      where: { name: roleKey },
    });

    if (!existingRole) {
      return next(new CustomError(`Role ${role} does not exist`, 404));
    }

    // Check for existing user
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      return next(new CustomError("Email already exists!", 409));
    }

    // Hash password
    const hashedPassword = await getHashPassword(password);

    // Retrieve permissions to assign based on role
    const permissionsToAssign = permissionsStructure[roleKey];
    if (!permissionsToAssign) {
      return next(
        new CustomError(`No permissions defined for role ${role}`, 400)
      );
    }

    // Create the user with the specified role
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        role: { connect: { id: existingRole.id } },
      },
    });

    // Find and assign permissions
    const permissions = await prisma.permission.findMany({
      where: {
        name: {
          in: permissionsToAssign.map((permission) =>
            permission.toUpperCase().replace(/ /g, "_")
          ),
        },
      },
    });

    await prisma.rolePermission.createMany({
      data: permissions.map((permission:any) => ({
        roleId: existingRole.id,
        permissionId: permission.id,
      })),
    });

    // Send a success response
    return sendSuccessResponse(
      res,
      "User registered successfully. Please verify your email to complete registration.",
      { id: user.id, email: user.email, role: roleKey },
      201
    );
  } catch (error) {
    next(error);
  }
};

export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: { role: true },
    });

    if (!user) {
      return next(new CustomError("Invalid email or password", 401));
    }

    const isPasswordValid = await verifyPassword(password, user.password!);
    if (!isPasswordValid) {
      return next(new CustomError("Invalid email or password", 401));
    }

    const accessToken = await createToken({ id: user.id }, "1d");
    const refreshToken = await createToken({ id: user.id }, "7d");

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
    });

    return sendSuccessResponse(res, "Login successful", {
      id: user.id,
      email: user.email,
      role: user.role.name,
    });
  } catch (error) {
    next(error);
  }
};


export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.cookie("accessToken", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      expires: new Date(0), 
    });

    res.cookie("refreshToken", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "none",
      expires: new Date(0), 
    });

    // Respond with success message
    return sendSuccessResponse(res, "Logout Successfully!", {}, 200);
  } catch (error: any) {
    next(error);
  }
};
