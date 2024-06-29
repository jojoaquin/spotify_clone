import { confirmEmailPrefix } from "./../constants";
import { User } from "./../entity/User";
import { Request, Response } from "express";
import { redis } from "./../redis";
export const confirmEmail = async (req: Request, res: Response) => {
  const userId = await redis.get(`${confirmEmailPrefix}${req.params.id}`);
  if (userId) {
    await User.update(
      {
        id: userId,
      },
      {
        confirmed: true,
      }
    );
    await redis.del(`${confirmEmailPrefix}${req.params.id}`);

    res.status(200).json({
      success: true,
    });
  } else {
    res.status(200).json({
      success: false,
    });
  }
};
