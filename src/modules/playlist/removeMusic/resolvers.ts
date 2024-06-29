import { Playlist } from "./../../../entity/Playlist";
import { formatZodError } from "./../../../utils/formatZodError";
import {
  MutationAddMusicToPlaylistArgs,
  PlaylistResponse,
} from "./../../../types/generated.d";
import { z } from "zod";
import { ResolverMap } from "./../../../types/graphql-type.d";

const schema = z.object({
  playlistId: z.string().length(11),
  musicId: z.string().length(11),
});

const resolvers: ResolverMap = {
  Mutation: {
    removeMusicFromPlaylist: async (
      _,
      { playlistId, musicId }: MutationAddMusicToPlaylistArgs,
      { session }
    ): Promise<PlaylistResponse> => {
      try {
        schema.parse({ playlistId, musicId });
      } catch (e) {
        return {
          errors: formatZodError(e),
          success: false,
        };
      }

      const playlist = await Playlist.findOne({ where: { id: playlistId } });
      if (!playlist || playlist.userId !== session.userId) {
        return {
          errors: [{ path: "playlist", message: "playlist is not exist" }],
          success: false,
        };
      }

      if (!playlist.musicIds.includes(musicId)) {
        return {
          errors: [
            {
              path: "playlist",
              message: "music is not exist in this playlist",
            },
          ],
          success: false,
        };
      }

      const musicIndex = playlist.musicIds.indexOf(musicId);
      playlist.musicIds.splice(musicIndex, 1);
      await playlist.save();

      return {
        errors: null,
        success: true,
      };
    },
  },
};

export default resolvers;
