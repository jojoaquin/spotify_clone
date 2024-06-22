import { forgotPasswordPrefix } from "./../../../constants";
import { Redis } from "ioredis";
import { v4 } from "uuid";

export const createForgotPasswordLink = async (
  url: string,
  userId: string,
  redis: Redis
) => {
  const id = v4();
  await redis.set(`${forgotPasswordPrefix}${id}`, userId, "EX", 60 * 60 * 24);
  return `${url}/change-password/${id}`;
};
