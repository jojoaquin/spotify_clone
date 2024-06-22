import { Request, Response } from "express";
import { Session } from "express-session";
import { Redis } from "ioredis";

interface CustomSession extends Session {
  userId: string;
}

interface Context {
  url: string;
  redis: Redis;
  session: CustomSession;
  res: Response;
}

export interface ResolverMap {
  [key: string]: {
    [key: string]: (parent: any, args: any, context: Context, info: any) => any;
  };
}
