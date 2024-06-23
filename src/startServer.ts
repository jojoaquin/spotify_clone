import dotenv from "dotenv";
import { isAuthMiddleware } from "./middleware";
import { redisSessionPrefix } from "./constants";
import { confirmEmail } from "./routes/confirmEmail";
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
import { Strategy } from "passport-google-oauth20";
import passport from "passport";
import { User } from "./entity/User";

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

  passport.use(
    new Strategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID as string,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        callbackURL: "http://localhost:4000/auth/google/callback",
      },
      async (_, __, profile, cb) => {
        const { id, displayName, emails } = profile;

        let user = await User.findOne({
          where: {
            email: emails![0].value,
          },
        });

        if (!user) {
          user = await User.create({
            email: emails![0].value,
            username: displayName,
            googleId: id,
            confirmed: true,
          }).save();
        } else if (!user.googleId) {
          user.googleId = id;
          await user.save();
        }

        return cb(null, { id: user.id });
      }
    )
  );

  app.use(passport.initialize());
  app.use(passport.session());

  app.get("/confirm/:id", confirmEmail);

  app.get(
    "/auth/google",
    passport.authenticate("google", {
      scope: ["email", "profile"],
    })
  );

  app.get(
    "/auth/google/callback",
    passport.authenticate("google", { session: false }),
    (req, res) => {
      (req.session as any).userId = (req.user as any).id;
      console.log((req.user! as any).id);
      res.redirect("/graphql");
    }
  );

  const port = process.env.NODE_ENV === "test" ? 4001 : process.env.PORT;
  app.listen(port, () => {
    log.info(`NODE_ENV: ${process.env.NODE_ENV}`);
    log.info(`Server is running in http://localhost:${port}/graphql`);
  });
};
