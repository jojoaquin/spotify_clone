import { GraphQLError } from "graphql";
import { Context } from "./types/graphql-type";

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

export const isAuthMiddleware = {
  Query: {
    me: isAuth,
  },
  Mutation: {
    logout: isAuth,
  },
};