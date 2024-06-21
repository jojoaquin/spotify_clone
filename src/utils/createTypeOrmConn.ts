import { AppDataSource, TestDataSource } from "./../data-source";
export const createTypeOrmconn = async () => {
  if (process.env.NODE_ENV === "test") {
    await TestDataSource.initialize();
  } else {
    await AppDataSource.initialize();
  }
};
