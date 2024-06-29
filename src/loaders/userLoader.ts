import { In } from "typeorm";
import { User } from "./../entity/User";
import DataLoader from "dataloader";

type BatchUser = (ids: readonly string[]) => Promise<User[]>;

interface UserI {
  [key: string]: User;
}

const batchUsers: BatchUser = async (ids) => {
  const users = await User.find({
    where: {
      id: In(ids),
    },
  });

  const userMap: UserI = {};

  users.forEach((u) => {
    userMap[u.id] = u;
  });
  const rightOrder = ids.map((id) => userMap[id]);

  return rightOrder;
};

const userLoader = () => new DataLoader<string, User>(batchUsers);

export default userLoader;
