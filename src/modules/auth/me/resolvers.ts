import { User } from "./../../../entity/User";
import { ResolverMap } from "./../../../types/graphql-type.d";

const resolvers: ResolverMap = {
  Query: {
    me: (_, __, { session }) => {
      return (
        User.findOne({
          where: {
            id: session.userId,
          },
        }) ?? null
      );
    },
  },
};

export default resolvers;
