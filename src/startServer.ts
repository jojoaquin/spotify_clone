import { createTypeOrmConn } from "./utils/createTypeOrmConn";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import express from "express";
import { log } from "./utils/log";
import cors from "cors";
import { genSchema } from "./utils/genSchema";

export const startServer = async () => {
  const schema = await genSchema();
  const server = new ApolloServer({
    schema,
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

  await createTypeOrmConn();

  const port = process.env.NODE_ENV === "test" ? 4001 : process.env.PORT;
  app.listen(port, () => {
    log.info(`NODE_ENV: ${process.env.NODE_ENV}`);
    log.info(`Server is running in http://localhost:${port}/graphql`);
  });
};
