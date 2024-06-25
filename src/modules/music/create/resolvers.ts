import { GraphQLUpload } from "graphql-upload-ts";
import { processUpload } from "../shared/processUpload";
import { MutationCreateMusicArgs } from "./../../../types/generated.d";

const resolvers: any = {
  Upload: GraphQLUpload,
  Mutation: {
    createMusic: async (_: any, { title, files }: MutationCreateMusicArgs) => {
      try {
        const filesRes = await processUpload(files);
        console.log(title);
        console.log(filesRes);

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
          success: true,
        };
      }
    },
  },
};

export default resolvers;
