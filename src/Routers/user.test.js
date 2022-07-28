const request = require('supertest');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const app = require('../app');
const User = require('../models/user');

const userOneId = new mongoose.Types.ObjectId();
const userOne = {
  _id: userOneId,
  name: 'Shubham',
  email: 'shbhmshekhar@gmail.com',
  password: '12341234',
  tokens: [
    {
      token: jwt.sign({ _id: userOneId }, process.env.JWT_SECURE_MESSAGE),
    },
  ],
};

describe('user test cases', () => {
  beforeEach(async () => {
    await User.deleteMany();
    await new User(userOne).save();
  });

  test('should signup new user', async () => {
    const response = await request(app)
      .post('/addusers')
      .send({
        name: 'test user',
        email: 'user@eg.com',
        password: '12341234',
      })
      .expect(201);

    //Assert that the db was changed correctly

    const user = await User.findById(response.body.user._id);

    expect(user).not.toBeNull();

    //Assert about response
    // expect(response.body.user.name).toBe('test user');
    expect(response.body).toMatchObject({
      user: {
        name: 'test user',
        email: 'user@eg.com',
      },
      token: user.tokens[0].token,
    });

    expect(user.password).not.toBe('12341234');
  });

  test('should login existing user', async () => {
    const response = await request(app)
      .post('/user/login')
      .send({
        email: userOne.email,
        password: userOne.password,
      })
      .expect(200);
    const user = await User.findById(userOneId);
    expect(response.body.token).toEqual(
      user.tokens[user.tokens.length - 1].token
    );
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

  test('should get profile for user', async () => {
    await request(app)
      .get('/users/me')
      .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
      .send()
      .expect(200);
  });

  test('should not get profile for unauthenticated user', async () => {
    await request(app).get('/users/me').send().expect(401);
  });

  test('should delete account for authenticated user', async () => {
    await request(app)
      .delete('/users/me')
      .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
      .send()
      .expect(200);
    const user = await User.findById(userOneId);
    expect(user).toBeNull();
  });
  test('should not delete account for unautheticated user', async () => {
    await request(app).delete('/users/me').send().expect(401);
  });
});
