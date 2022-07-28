const request = require('supertest');
const app = require('../src/app');
const User = require('../src/models/user');
const { userOneId, userOne, setupDataBase } = require('./fixtures/db');

describe('user test cases', () => {
  beforeEach(setupDataBase);

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

  test('should upload avatar image', async () => {
    await request(app)
      .post('/user/me/avatar')
      .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
      .attach('avatar', 'test/fixtures/user-icon.png')
      .expect(200);
    const user = await User.findById(userOneId);
    expect(user.avatar).toEqual(expect.any(Buffer));
  });

  test('should perform valid updates for authenticated user', async () => {
    await request(app)
      .patch('/users/me')
      .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
      .send({
        name: 'updated test user',
      })
      .expect(200);
    const user = await User.findById(userOneId);
    expect(user.name).toBe('updated test user');
  });

  test('should not update invalid user fields', async () => {
    await request(app)
      .patch('/users/me')
      .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
      .send({
        location: 'some loc',
      })
      .expect(400);
  });
});
