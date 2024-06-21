import "reflect-metadata";
import { DataSource } from "typeorm";
import { User } from "./entity/User";

export const AppDataSource = new DataSource({
  name: "development",
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "root",
  password: "joaquin",
  database: "spotify_clone",
  synchronize: true,
  logging: true,
  dropSchema: false,
  entities: [User],
  migrations: [],
  subscribers: [],
});

export const TestDataSource = new DataSource({
  name: "test",
  type: "mysql",
  host: "localhost",
  port: 3306,
  username: "root",
  password: "joaquin",
  database: "spotify_clone_test",
  synchronize: true,
  logging: false,
  dropSchema: true,
  entities: [User],
  migrations: [],
  subscribers: [],
});
