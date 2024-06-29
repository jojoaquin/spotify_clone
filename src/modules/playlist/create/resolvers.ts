import { Playlist } from "./../../../entity/Playlist";
import { formatZodError } from "./../../../utils/formatZodError";
import {
  MutationCreatePlaylistArgs,
  PlaylistResponse,
} from "./../../../types/generated.d";
import { z } from "zod";
import { ResolverMap } from "./../../../types/graphql-type.d";

const schema = z.object({
  name: z.string().min(3).max(255),
});

const resolvers: ResolverMap = {
  Mutation: {
    createPlaylist: async (
      _,
      { name }: MutationCreatePlaylistArgs,
      { session }
    ): Promise<PlaylistResponse> => {
      try {
        schema.parse({ name });
      } catch (e) {
        return {
          errors: formatZodError(e),
          success: false,
        };
      }

      const playlist = new Playlist();
      playlist.name = name;
      playlist.userId = session.userId;
      await playlist.save();

      return {
        errors: null,
        success: true,
      };
    },
  },
};

export default resolvers;
