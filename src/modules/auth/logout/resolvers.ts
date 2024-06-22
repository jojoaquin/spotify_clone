import { redisRemoveSession } from "../../../utils/redisRemoveSession";
import { AuthResponse } from "./../../../types/generated.d";
import { ResolverMap } from "./../../../types/graphql-type.d";

const resolvers: ResolverMap = {
  Mutation: {
    logout: async (
      _,
      __,
      { session, res, redis, req }
    ): Promise<AuthResponse> => {
      const { userId } = session;
      if (userId) {
        await redisRemoveSession(redis, userId, req);

        session.destroy((err) => {
          console.log(err);
        });
        res.clearCookie("qid");

        return {
          errors: null,
          success: true,
        };
      }

      return {
        errors: [
          {
            path: "session",
            message: "session is not found",
          },
        ],
        success: false,
      };
    },
  },
};

export default resolvers;
