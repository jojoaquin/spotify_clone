import { GraphQLError } from "graphql";
import { Context } from "./types/graphql-type";
import { loginSession, userSessionIdPrefix } from "./constants";

const isAuth = async (
  resolve: any,
  parent: any,
  args: any,
  context: Context,
  info: any
) => {
  if (!context.session.userId) {
    throw new GraphQLError("Not auth");
  }

  return resolve(parent, args, context, info);
};

const isForgotPassword = async (
  resolve: any,
  parent: any,
  args: any,
  context: Context,
  info: any
) => {
  let found: string | undefined;
  await context.redis.lrange(loginSession, 0, -1, async (err, res) => {
    if (err) console.log("err range middleware: " + err);

    if (res) {
      found = res.find((value) => {
        return value === `${userSessionIdPrefix}${context.session.userId}`;
      });
    }
  });

  if (!found) {
    throw new GraphQLError("You have been logout, try to login");
  }

  return resolve(parent, args, context, info);
};

export const isAuthMiddleware = {
  Query: {
    me: isAuth,
  },
  Mutation: {
    logout: isAuth,
  },
};

export const isForgotPassMiddleware = {
  Query: {
    me: isForgotPassword,
  },
};
