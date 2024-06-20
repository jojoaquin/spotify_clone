import { loadFiles } from "@graphql-tools/load-files";
import path from "path";
import { mergeTypeDefs } from "@graphql-tools/merge";
import { mergeResolvers } from "@graphql-tools/merge";
import { makeExecutableSchema } from "graphql-tools";

export const genSchema = async () => {
  const typesArray = await loadFiles(
    path.join(__dirname, "../modules/**/*.graphql")
  );

  const resolversArray = await loadFiles(
    path.join(__dirname, "../modules/**/resolvers.ts")
  );

  const typeDefs = mergeTypeDefs(typesArray);
  const resolvers = mergeResolvers(resolversArray);

  const schema = makeExecutableSchema({
    typeDefs,
    resolvers,
  });

  return schema;
};
