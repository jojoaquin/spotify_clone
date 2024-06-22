import { Redis } from "ioredis";
import { userSessionIdPrefix } from "./../constants";
import { Request } from "express";

export const redisRemoveSession = async (
  redis: Redis,
  userId: string,
  req: Request
) => {
  await redis.lrange(`${userSessionIdPrefix}${userId}`, 0, -1, async (err) => {
    if (err) {
      console.log(err);
    }

    await redis.lrem(`${userSessionIdPrefix}${userId}`, 0, req.sessionID);
  });
};
