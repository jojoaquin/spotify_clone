import { QueryViewMusicArgs } from "./../../../types/generated.d";
import { Music } from "./../../../entity/Music";
import { ResolverMap } from "./../../../types/graphql-type.d";
const resolvers: ResolverMap = {
  Query: {
    viewMusic: async (_, { id }: QueryViewMusicArgs) => {
      return await Music.findOne({
        where: {
          id,
        },
      });
    },
  },
};

export default resolvers;
