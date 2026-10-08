// server/tests/app.test.js
const chai = require('chai');
const chaiHttp = require('chai-http');
const { startMongoDB, stopMongoDB } = require('../mongoTest');

const { expect } = chai;

chai.use(chaiHttp);

describe('MERN Server', () => {
  let mongod, uri;

  before(async () => {
    // Start an in-memory MongoDB server before running tests
    const { mongod: mongoServer, uri: mongoUri } = await startMongoDB();
    mongod = mongoServer;
    uri = mongoUri;
  });

  after(async () => {
    // Stop the in-memory MongoDB server after tests
    await stopMongoDB(mongod);
  });

  it('should have a passing server test', (done) => {
    // Your server-side test logic here
    done();
  });
});
