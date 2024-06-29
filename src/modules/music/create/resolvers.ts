import { formatZodError } from "./../../../utils/formatZodError";
import { User } from "./../../../entity/User";
import { Music } from "./../../../entity/Music";
import { processMultipleUpload } from "./../shared/processUpload";
import { MutationCreateMusicArgs } from "./../../../types/generated.d";
import { Context, ResolverMap } from "../../../types/graphql-type";
import z, { ZodError } from "zod";

const schema = z.object({
  title: z.string().min(3).max(255),
});

const resolvers: ResolverMap = {
  Mutation: {
    createMusic: async (
      _,
      { title, files }: MutationCreateMusicArgs,
      { session }: Context
    ) => {
      try {
        schema.parse({ title });
        const { pictureName, musicName } = await processMultipleUpload(files);
        const user = await User.findOne({
          where: {
            id: session.userId,
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
