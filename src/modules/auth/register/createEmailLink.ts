import { confirmEmailPrefix } from "./../../../constants";
import { Redis } from "ioredis";
import { v4 } from "uuid";

export const createEmailLink = async (
  url: string,
  userId: string,
  redis: Redis
) => {
  const id = v4();
  await redis.set(`${confirmEmailPrefix}${id}`, userId, "EX", 60 * 60 * 24);
  return `${url}/confirm/${id}`;
};
