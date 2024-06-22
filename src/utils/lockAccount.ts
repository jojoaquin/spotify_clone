import { Redis } from "ioredis";
import { redisSessionPrefix, userSessionIdPrefix } from "./../constants";
import { User } from "./../entity/User";

export const lockAccount = async (
  email: string,
  userId: string,
  redis: Redis
) => {
  await User.update(
    {
      email,
    },
    {
      lockAccount: true,
    }
  );

  await redis.lrange(`${userSessionIdPrefix}${userId}`, 0, -1, (err, res) => {
    if (err) {
      console.log(err);
    }

    res?.forEach(async (v) => {
      await redis.del(`${redisSessionPrefix}${v}`);
    });

    redis.del(`${userSessionIdPrefix}${userId}`);
  });
};
