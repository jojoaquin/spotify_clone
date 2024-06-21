import { AppDataSource, TestDataSource } from "./../data-source";
export const createTypeOrmConn = async () => {
  if (process.env.NODE_ENV === "development") {
    await AppDataSource.initialize();
  } else {
    await TestDataSource.initialize();
  }
};
