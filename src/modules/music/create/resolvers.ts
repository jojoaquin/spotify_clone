import { processUpload } from "../shared/processUpload";
import { MutationCreateMusicArgs } from "./../../../types/generated.d";
import { GraphQLUpload } from "graphql-upload-minimal";

const resolvers: any = {
  Upload: GraphQLUpload,
  Mutation: {
    createMusic: async (_: any, { title, files }: MutationCreateMusicArgs) => {
      const filesRes = await processUpload(files);
      console.log(title);
      console.log(filesRes);

      return {
        errors: null,
        success: true,
      };
    },
  },
};

export default resolvers;
