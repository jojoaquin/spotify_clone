import { Music } from "./../entity/Music";
import { In } from "typeorm";
import DataLoader from "dataloader";

type BatchMusic = (ids: readonly string[]) => Promise<Music[]>;

interface MusicI {
  [key: string]: Music;
}

const batchMusics: BatchMusic = async (ids) => {
  const musics = await Music.find({
    where: {
      id: In(ids),
    },
  });

  const musicMap: MusicI = {};

  musics.forEach((u) => {
    musicMap[u.id] = u;
  });
  const rightOrder = ids.map((id) => musicMap[id]);

  return rightOrder;
};

const musicLoader = () => new DataLoader<string, Music>(batchMusics);

export default musicLoader;
