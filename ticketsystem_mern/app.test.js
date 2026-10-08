const chai = require('chai');
const chaiHttp = require('chai-http');

const { expect } = chai;

chai.use(chaiHttp);

describe('MERN Client', () => {
  it('should have a passing client test', (done) => {
    // Your client-side test logic here
    done();
  });
});