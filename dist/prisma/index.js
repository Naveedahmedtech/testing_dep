"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = global.prisma ||
    new client_1.PrismaClient({ log: ["query", "info", "warn", "error"] });
if (process.env.NODE_ENV === "development") {
    global.prisma = prisma;
    console.log("Using cached connection.");
}
exports.default = prisma;
