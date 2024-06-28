import { formatZodError } from "./../../../utils/formatZodError";
import { User } from "./../../../entity/User";
import { Music } from "./../../../entity/Music";
import { processMultipleUpload } from "./../shared/processUpload";
import { GraphQLUpload } from "graphql-upload-ts";
import { MutationCreateMusicArgs } from "./../../../types/generated.d";
import { Context } from "../../../types/graphql-type";
import z, { ZodError } from "zod";

const schema = z.object({
  title: z.string().min(3).max(255),
});

const resolvers: any = {
  Upload: GraphQLUpload,
  Mutation: {
    createMusic: async (
      _: any,
      { title, files }: MutationCreateMusicArgs,
      ctx: Context
    ) => {
      try {
        schema.parse({ title });
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
        if (e instanceof ZodError) {
          return {
            errors: formatZodError(e),
            success: false,
          };
        }
        return {
          errors: [
            {
              path: e.path,
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
