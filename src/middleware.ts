import { Context } from "./types/graphql-type";

const isAuth = async (
  resolve: any,
  parent: any,
  args: any,
  context: Context,
  info: any
) => {
  if (!context.session.userId) {
    throw new Error("Not auth");
  }

  return resolve(parent, args, context, info);
};

export const isAuthMiddleware = {
  Query: {
    me: isAuth,
    findMusics: isAuth,
    searchMusics: isAuth,
    viewMusic: isAuth,
  },
  Mutation: {
    logout: isAuth,
    createMusic: isAuth,
    deleteMusic: isAuth,
  },
};
