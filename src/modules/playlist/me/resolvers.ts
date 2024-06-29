import { Playlist as PlaylistEntity } from "./../../../entity/Playlist";
import { Playlist } from "./../../../types/generated.d";
import { ResolverMap } from "./../../../types/graphql-type.d";

const resolvers: ResolverMap = {
  Playlist: {
    musics: async ({ musicIds }: PlaylistEntity, _, { musicLoader }) => {
      return musicLoader.loadMany(musicIds);
    },
  },
  Query: {
    myPlaylist: async (
      _,
      __,
      { session: { userId } }
    ): Promise<Playlist[] | null> => {
      const playList = await PlaylistEntity.find({ where: { userId } });

      if (playList.length === 0) {
        return null;
      }

      return playList;
    },
  },
};

export default resolvers;
