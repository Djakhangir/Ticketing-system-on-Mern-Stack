
const { MongoMemoryServer } = require('mongodb-memory-server');

async function startMongoDB() {
  const mongod = new MongoMemoryServer();
  const uri = await mongod.getUri();
  return { mongod, uri };
}

async function stopMongoDB(mongod) {
  await mongod.stop();
}

module.exports = { startMongoDB, stopMongoDB };
