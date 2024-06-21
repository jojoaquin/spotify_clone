/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  globalSetup: "./src/test-setup/callSetup",
  preset: "ts-jest",
  testEnvironment: "node",
};
