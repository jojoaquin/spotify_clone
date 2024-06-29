import { Music } from "./../../../entity/Music";
import { ResolverMap } from "./../../../types/graphql-type.d";
const resolvers: ResolverMap = {
  Music: {
    pictureUrl: (parent, _, { url }) => {
      return `${url}/pictures/${parent.pictureUrl}`;
    },
    musicUrl: (parent, _, { url }) => {
      return `${url}/musics/${parent.musicUrl}`;
    },
    user: async ({ userId }, _, { userLoader }) => {
      return userLoader.load(userId);
    },
  },
  Query: {
    findMusics: async () => {
      const musics = await Music.find();
      return musics;
    },
  },
};

export default resolvers;
