import {
  MusicResponse,
  MutationDeleteMusicArgs,
} from "./../../../types/generated.d";
import { Music } from "./../../../entity/Music";
import { ResolverMap } from "./../../../types/graphql-type.d";
import { rmFiles } from "../shared/rmFiles";
const resolvers: ResolverMap = {
  Mutation: {
    deleteMusic: async (
      _,
      { id }: MutationDeleteMusicArgs
    ): Promise<MusicResponse> => {
      const music = await Music.findOne({ where: { id } });

      if (!music) {
        return {
          errors: [
            {
              path: "id",
              message: "music does not exist",
            },
          ],
          success: false,
        };
      }

      await rmFiles(music);

      await Music.remove(music);

      return {
        errors: null,
        success: true,
      };
    },
  },
};

export default resolvers;
