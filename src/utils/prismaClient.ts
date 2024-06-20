import { PrismaClient as PrismaClientDev } from "./../../prisma/generated/prisma-dev";
import { PrismaClient as PrismaClientTest } from "./../../prisma/generated/prisma-test";

export const prisma =
  process.env.NODE_ENV === "development"
    ? new PrismaClientDev({
        log: [
          {
            emit: "stdout",
            level: "query",
          },
          {
            emit: "stdout",
            level: "error",
          },
          {
            emit: "stdout",
            level: "info",
          },
          {
            emit: "stdout",
            level: "warn",
          },
        ],
      })
    : new PrismaClientTest();
