import { PrismaClient as PrismaClientDev } from "./../../prisma/generated/prisma-dev";
import { PrismaClient as PrismaClientTest } from "./../../prisma/generated/prisma-test";
import { log } from "./log";

const isDevelopment = process.env.NODE_ENV === "development";

export const prisma = isDevelopment
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

const dropSchema = async (option: { active: boolean }) => {
  if (option.active) {
    const tables: Array<{ Tables_in_spotify_clone: string }> =
      await prisma.$queryRaw`SHOW TABLES;`;

    for await (const table of tables) {
      await prisma.$executeRawUnsafe(
        `DELETE FROM ${table.Tables_in_spotify_clone};`
      );

      await prisma.$executeRawUnsafe(
        `ALTER TABLE ${table.Tables_in_spotify_clone} AUTO_INCREMENT = 1;`
      );
    }

    log.info("Data deletion completed successfully");
  } else {
    log.info("No drop schema");
  }
};

if (process.env.NODE_ENV === "development") {
  dropSchema({ active: true });
}
