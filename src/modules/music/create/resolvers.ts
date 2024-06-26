import { GraphQLUpload } from "graphql-upload-ts";
import { MutationCreateMusicArgs } from "./../../../types/generated.d";
import fs from "fs";
import path from "path";
import shortid from "shortid";

interface Streams {
  createReadStream: () => NodeJS.ReadableStream;
  dir: string;
}

const errorMessage =
  "Picture (.jpg, .jpeg, .png) and music (.mp3) are required";

const resolvers: any = {
  Upload: GraphQLUpload,
  Mutation: {
    createMusic: async (_: any, { title, files }: MutationCreateMusicArgs) => {
      try {
        let pictureName;
        let musicName;
        const pictureStreams: Streams = {} as Streams;
        const musicStreams: Streams = {} as Streams;

        if (files.length < 2) {
          throw new Error(errorMessage);
        }

        for await (const v of files) {
          const { createReadStream, filename } = v;
          const splitFunc = filename.split(".");
          const extension = splitFunc[splitFunc.length - 1].toLowerCase();
          const id = `${shortid.generate()}.${extension}`;
          const dir = path.join(
            __dirname,
            `../../../../public/${
              extension === "mp3" ? "musics" : "pictures"
            }/${id}`
          );

          if (
            extension === "png" ||
            extension === "jpg" ||
            extension === "jpeg"
          ) {
            pictureName = filename;
            pictureStreams!.createReadStream = createReadStream;
            pictureStreams!.dir = dir;
          } else if (extension === "mp3") {
            musicName = filename;
            musicStreams!.createReadStream = createReadStream;
            musicStreams!.dir = dir;
          }
        }

        if (!pictureName || !musicName) {
          throw new Error(errorMessage);
        }

        {
          const { createReadStream, dir } = pictureStreams!;
          await new Promise((resolve, reject) => {
            createReadStream()
              .pipe(fs.createWriteStream(dir))
              .on("finish", resolve)
              .on("error", reject);
          });
        }

        {
          const { createReadStream, dir } = musicStreams!;
          await new Promise((resolve, reject) => {
            createReadStream()
              .pipe(fs.createWriteStream(dir))
              .on("finish", resolve)
              .on("error", reject);
          });
        }

        console.log(title);
        console.log(pictureName);
        console.log(musicName);

        return {
          errors: null,
          success: true,
        };
      } catch (e) {
        console.log(e);
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
