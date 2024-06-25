import fs from "fs";
import path from "path";
import shortid from "shortid";

interface Response {
  musicId: string | null;
  pictureId: string | null;
}

interface UploadedFile {
  createReadStream: () => NodeJS.ReadableStream;
  filename: string;
  mimetype: string;
  encoding: string;
}

export const processUpload = async (
  files: UploadedFile[]
): Promise<Response> => {
  let response: Response = {
    musicId: null,
    pictureId: null,
  };

  for (let i = 0; i < files.length; i++) {
    const { createReadStream, filename } = await files[i];

    let dir;
    const extension = filename.split(".");
    const fileExtension = extension[extension.length - 1];

    if (
      i === 0 &&
      fileExtension !== "jpeg" &&
      fileExtension !== "png" &&
      fileExtension !== "jpg"
    ) {
      throw new Error("image must be jpg, png, jpeg");
    } else if (i === 1 && fileExtension !== "mp3") {
      throw new Error("music must be mp3");
    }

    const id = `${shortid.generate()}.${fileExtension}`;

    if (fileExtension === "mp3") {
      dir = path.join(__dirname, `../../../../public/musics/${id}`);
    } else {
      dir = path.join(__dirname, `../../../../public/pictures/${id}`);
    }

    await new Promise((resolve, reject) => {
      createReadStream()
        .pipe(fs.createWriteStream(dir))
        .on("finish", resolve)
        .on("error", () => {
          console.log("error", reject);
        });
    });

    if (fileExtension === "mp3") {
      response.musicId = id;
    } else {
      response.pictureId = id;
    }
  }

  return response;
};
