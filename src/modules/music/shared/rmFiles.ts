import { CustomError } from "./../../../utils/formatZodError";
import fs from "fs";
import { Music } from "./../../../entity/Music";
import path from "path";

export const rmFiles = async (music: Music) => {
  const picturePath = path.join(
    __dirname,
    "../../../../public/pictures",
    music.pictureUrl
  );
  const musicPath = path.join(
    __dirname,
    "../../../../public/musics",
    music.musicUrl
  );

  try {
    await fs.promises.rm(picturePath);
    await fs.promises.rm(musicPath);
  } catch (err) {
    throw new CustomError("files", "error spam");
  }
};
