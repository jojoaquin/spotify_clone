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
import { graphqlUploadExpress } from "graphql-upload-ts";
import path from "path";

dotenv.config();

export const startServer = async () => {
  const schema = await genSchema();

  const schemaMiddleware = applyMiddleware(schema, isAuthMiddleware);
  const server = new ApolloServer({
    schema: schemaMiddleware,
    csrfPrevention: true,
  });

  await server.start();

  const app = express();

  app.use(
    "/pictures",
    express.static(path.join(__dirname, "../public/pictures"))
  );
  app.use("/musics", express.static(path.join(__dirname, "../public/musics")));

  app.use(graphqlUploadExpress({ maxFileSize: 10000000, maxFiles: 10 }));

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
  ); /*10mb */

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
  app.listen(port, async () => {
    log.info(`NODE_ENV: ${process.env.NODE_ENV}`);
    log.info(`Server is running in http://localhost:${port}/graphql`);
  });
};
