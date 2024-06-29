import { Context } from "./types/graphql-type";

const isAuth = async (
  resolve: any,
  parent: any,
  args: any,
  context: Context,
  info: any
) => {
  console.log(context.session.userId);
  if (!context.session.userId) {
    throw new Error("Not auth");
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
