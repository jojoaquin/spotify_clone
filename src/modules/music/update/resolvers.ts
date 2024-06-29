import { formatZodError } from "./../../../utils/formatZodError";
import { User } from "./../../../entity/User";
import { Music } from "./../../../entity/Music";
import { processMultipleUpload } from "./../shared/processUpload";
import {
  MusicResponse,
  MutationUpdateMusicArgs,
} from "./../../../types/generated.d";
import { Context, ResolverMap } from "../../../types/graphql-type";
import z from "zod";
import { rmFiles } from "../shared/rmFiles";

const schemaMusicId = z.object({
  musicId: z.string().length(11),
});

const schemaTitle = z.object({
  title: z.string().min(3).max(255),
});

const failedResponse = (path: string, message: string) => {
  return {
    errors: [
      {
        path,
        message,
      },
    ],
    success: false,
  };
};

const resolvers: ResolverMap = {
  Mutation: {
    updateMusic: async (
      _,
      { musicId, title, files }: MutationUpdateMusicArgs,
      { session }: Context
    ): Promise<MusicResponse> => {
      try {
        schemaMusicId.parse({ musicId });
      } catch (e) {
        return {
          errors: formatZodError(e),
          success: false,
        };
      }

      if (!title && !files) {
        return failedResponse("input", "action is not update anything");
      }

      const music = await Music.findOne({ where: { id: musicId } });
      const user = await User.findOne({ where: { id: session.userId } });

      if (!music || music.userId !== user!.id) {
        return failedResponse("musicId", "music is invalidate to update");
      }

      if (title) {
        try {
          schemaTitle.parse({ title });
        } catch (e) {
          return {
            errors: formatZodError(e),
            success: false,
          };
        }

        music.title = title;
      }

      if (files) {
        try {
          await rmFiles(music);
          const { pictureName, musicName } = await processMultipleUpload(files);

          music.pictureUrl = pictureName;
          music.musicUrl = musicName;
        } catch (e) {
          return failedResponse(e.path, e.message);
        }
      }

      await music.save();

      return {
        errors: null,
        success: true,
      };
    },
  },
};

export default resolvers;
