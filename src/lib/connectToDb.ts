import { PrismaClient } from "@prisma/client";

// Extend global object to include Prisma in development mode
declare global {
    var prisma: PrismaClient | undefined;
}

let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") {
    // In production, always create a new PrismaClient instance
    prisma = new PrismaClient();
} else {
    // In development, reuse PrismaClient across hot reloads to prevent multiple instances
    if (!global.prisma) {
        global.prisma = new PrismaClient();
    }
    prisma = global.prisma;
}

export default prisma;
