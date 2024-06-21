require("ts-node");

const { startServer } = require("../startServer");

module.exports = async function () {
  await startServer();
};
