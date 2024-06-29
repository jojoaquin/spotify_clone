import { userLoader } from "./../loaders/userLoader";
import DataLoader from "dataloader";
import { Request, Response } from "express";
import { Session } from "express-session";
import { Redis } from "ioredis";
import musicLoader from "src/loaders/musicLoader";

interface CustomSession extends Session {
  userId: string;
}

interface Context {
  url: string;
  redis: Redis;
  session: CustomSession;
  res: Response;
  req: Request;
  userLoader: ReturnType<typeof userLoader>;
  musicLoader: ReturnType<typeof musicLoader>;
}

export interface ResolverMap {
  [key: string]: {
    [key: string]: (parent: any, args: any, context: Context, info: any) => any;
  };
}
