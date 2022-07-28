const request = require('supertest');
const Task = require('../src/models/task');
const app = require('../src/app');
const {
  userOneId,
  userOne,
  userTwoId,
  userTwo,
  taskOne,
  taskTwo,
  taskThree,
  setupDataBase,
} = require('./fixtures/db');

describe('tasks', () => {
  beforeEach(setupDataBase);
  test('should create task for user', async () => {
    const response = await request(app)
      .post('/addtask')
      .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
      .send({
        description: 'test task from jest',
      })
      .expect(201);

    const task = await Task.findById(response.body._id);
    expect(task).not.toBeNull();
    expect(task.completed).toBe(false);
    expect(task.owner.toString()).toEqual(userOneId.toString());
  });

  test('should get all tasks associated with user one', async () => {
    const res = await request(app)
      .get('/tasks')
      .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
      .send()
      .expect(200);
    // const tasks = await Task.find({ owner: userOneId });
    // console.log();
    expect(res.body.length).toEqual(2);
  });

  test('should not let user two delete task owned by user one', async () => {
    await request(app)
      .delete(`/task/${taskOne._id.toString()}`)
      .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
      .send()
      .expect(404);

    const task = await Task.findById(taskOne._id.toString());
    expect(task).not.toBeNull();
  });
});
