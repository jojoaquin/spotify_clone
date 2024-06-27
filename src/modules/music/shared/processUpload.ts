import { CustomError } from "./../../../utils/formatZodError";
import fs from "fs";
import path from "path";
import shortid from "shortid";
import { filesRequired } from "../create/errorMessages";

interface Streams {
  createReadStream: () => NodeJS.ReadableStream;
  dir: string;
}

export const processMultipleUpload = async (files: any) => {
  let pictureName;
  let musicName;
  const pictureStreams: Streams = {} as Streams;
  const musicStreams: Streams = {} as Streams;

  if (files.length < 2) {
    throw new CustomError("files", filesRequired);
  }

  for await (const v of files) {
    const { createReadStream, filename } = v;
    const splitFunc = filename.split(".");
    const extension = splitFunc[splitFunc.length - 1].toLowerCase();
    const id = `${shortid.generate()}.${extension}`;
    const dir = path.join(
      __dirname,
      `../../../../public/${extension === "mp3" ? "musics" : "pictures"}/${id}`
    );

    if (extension === "png" || extension === "jpg" || extension === "jpeg") {
      pictureName = id;
      pictureStreams!.createReadStream = createReadStream;
      pictureStreams!.dir = dir;
    } else if (extension === "mp3") {
      musicName = id;
      musicStreams!.createReadStream = createReadStream;
      musicStreams!.dir = dir;
    }
  }

  if (!pictureName || !musicName) {
    throw new CustomError("files", filesRequired);
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

  return {
    pictureName,
    musicName,
  };
};
