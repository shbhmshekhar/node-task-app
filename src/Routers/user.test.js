const request = require('supertest');
const app = require('../app');

describe('user test cases', () => {
  beforeEach(() => {
    console.log('beforeEach');
  });

  test('should signup new user', async () => {
    await request(app)
      .post('/addusers')
      .send({
        name: 'test user',
        email: 'user@eg.com',
        password: '12341234',
      })
      .expect(201);
  });

  afterEach(() => {
    console.log(afterEach);
  });
});
