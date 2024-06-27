import { User } from "./../../../entity/User";
import { Music } from "./../../../entity/Music";
import { processMultipleUpload } from "./../shared/processUpload";
import { GraphQLUpload } from "graphql-upload-ts";
import { MutationCreateMusicArgs } from "./../../../types/generated.d";
import { Context } from "../../../types/graphql-type";

const resolvers: any = {
  Upload: GraphQLUpload,
  Mutation: {
    createMusic: async (
      _: any,
      { title, files }: MutationCreateMusicArgs,
      ctx: Context
    ) => {
      try {
        const { pictureName, musicName } = await processMultipleUpload(files);
        const user = await User.findOne({
          where: {
            id: ctx.session.userId,
          },
        });

        await Music.create({
          title,
          pictureUrl: pictureName,
          musicUrl: musicName,
          user: user!,
        }).save();

        return {
          errors: null,
          success: true,
        };
      } catch (e) {
        return {
          errors: [
            {
              path: "files",
              message: e.message,
            },
          ],
          success: false,
        };
      }
    },
  },
};

export default resolvers;
