const request = require('supertest');
const app = require('../app');
const User = require('../models/user');

const userOne = {
  name: 'Shubham',
  email: 'shbhmshekhar@gmail.com',
  password: '12341234',
};

describe('user test cases', () => {
  beforeEach(async () => {
    await User.deleteMany();
    await new User(userOne).save();
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

  test('should login existing user', async () => {
    await request(app)
      .post('/user/login')
      .send({
        email: userOne.email,
        password: userOne.password,
      })
      .expect(200);
  });
  test('should not login user with incorrect credential', async () => {
    await request(app)
      .post('/user/login')
      .send({
        email: userOne.email,
        password: 'qwerty',
      })
      .expect(400);
  });
});
