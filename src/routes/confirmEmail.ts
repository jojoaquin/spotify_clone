import { User } from "./../entity/User";
import { Request, Response } from "express";
import { redis } from "./../redis";
export const confirmEmail = async (req: Request, res: Response) => {
  const userId = await redis.get(req.params.id);
  if (userId) {
    await User.update(
      {
        id: userId,
      },
      {
        confirmed: true,
      }
    );
    await redis.del(req.params.id);

    res.send("ok");
  } else {
    res.send("invalid");
  }
};
