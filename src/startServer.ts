import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import express, { Request, Response } from "express";
import { log } from "./utils/log";
import cors from "cors";
import { genSchema } from "./utils/genSchema";
import { prisma } from "./utils/prismaClient";

export const startServer = async () => {
  const server = new ApolloServer({
    schema: await genSchema(),
  });

  await server.start();

  const app = express();

  app.use(
    cors({
      credentials: true,
      origin: "*",
    })
  );

  app.use(
    "/graphql",
    express.json(),
    expressMiddleware(server, {
      context: async ({ req, res }) => ({
        req,
        res,
      }),
    })
  );

  app.get("/test", async (_req: Request, res: Response) => {
    await prisma.test.create({
      data: {
        name: "lolll",
      },
    });
    res.send("Hello");
  });

  const port = process.env.PORT ?? 4000;
  app.listen(port, () => {
    log.info(`Server is running in http://localhost:${port}/graphql`);
  });
};
