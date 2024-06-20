import { PrismaClient as PrismaClientDev } from "./../../prisma/generated/prisma-dev";
import { PrismaClient as PrismaClientTest } from "./../../prisma/generated/prisma-test";
import { log } from "./log";

export const prisma = new PrismaClientDev({
  log: [
    {
      emit: "event",
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
});

prisma.$on("query", (e: any) => {
  log.info(e.query);
});

export const testClient = new PrismaClientTest();
