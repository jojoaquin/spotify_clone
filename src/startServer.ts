import dotenv from "dotenv";
import { isAuthMiddleware } from "./middleware";
import { redisSessionPrefix } from "./constants";
import { createTypeOrmConn } from "./utils/createTypeOrmConn";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import express from "express";
import { log } from "./utils/log";
import cors from "cors";
import { genSchema } from "./utils/genSchema";
import session from "express-session";
import RedisStore from "connect-redis";
import { redis } from "./redis";
import { applyMiddleware } from "graphql-middleware";
import { googleAuth } from "./modules/auth/shared/googleAuth";

dotenv.config();

export const startServer = async () => {
  const schema = await genSchema();

  const schemaMiddleware = applyMiddleware(schema, isAuthMiddleware);
  const server = new ApolloServer({
    schema: schemaMiddleware,
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
    session({
      store: new RedisStore({
        client: redis as any,
        prefix: redisSessionPrefix,
      }),
      name: "qid",
      secret: process.env.REDIS_SECRET as string,
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7days
      },
    })
  );

  app.use(
    "/graphql",
    express.json(),
    expressMiddleware(server, {
      context: async ({ req, res }) => ({
        req,
        res,
        redis,
        url: req.protocol + "://" + req.get("host"),
        session: req.session,
      }),
    })
  );

  await createTypeOrmConn();

  googleAuth(app);

  const port = process.env.NODE_ENV === "test" ? 4001 : process.env.PORT;
  app.listen(port, () => {
    log.info(`NODE_ENV: ${process.env.NODE_ENV}`);
    log.info(`Server is running in http://localhost:${port}/graphql`);
  });
};
