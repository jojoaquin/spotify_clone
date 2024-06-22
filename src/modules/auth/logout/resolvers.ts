import { loginSession, userSessionIdPrefix } from "./../../../constants";
import { AuthResponse } from "./../../../types/generated.d";
import { ResolverMap } from "./../../../types/graphql-type.d";

const resolvers: ResolverMap = {
  Mutation: {
    logout: async (_, __, { session, res, redis }): Promise<AuthResponse> => {
      if (!session.userId) {
        return {
          errors: [
            {
              path: "login",
              message: "not auth",
            },
          ],
          success: true,
        };
      }

      await redis.lrange(loginSession, 0, -1, async (err) => {
        if (err) {
          console.log(err);
        }

        await redis.lrem(
          loginSession,
          1,
          // 0 untuk forgot pass
          `${userSessionIdPrefix}${session.userId}`
        );
      });

      session.destroy(() => _);
      res.clearCookie("qid");

      return {
        errors: null,
        success: true,
      };
    },
  },
};

export default resolvers;
