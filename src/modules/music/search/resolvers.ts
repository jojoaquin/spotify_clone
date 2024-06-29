import { Music } from "./../../../entity/Music";
import { ResolverMap } from "./../../../types/graphql-type.d";
import { QuerySearchMusicsArgs } from "./../../../types/generated.d";
import { Like } from "typeorm";
const resolvers: ResolverMap = {
  Query: {
    searchMusics: async (_, { title }: QuerySearchMusicsArgs) => {
      const musics = await Music.find({
        where: {
          title: Like(`%${title}%`),
        },
      });

      return musics;
    },
  },
};

export default resolvers;
