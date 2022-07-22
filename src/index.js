const express = require('express');
require('./db/mongoose');
const User = require('./models/user');
const Task = require('./models/task');

const app = express();

const port = process.env.PORT || 3000;

app.use(express.json());

app.post('/users', async (req, res) => {
  // Create a new user
  const user = new User(req.body);
  try {
    await user.save();
    res.status(201).send(user);
  } catch (err) {
    res.status(400).send(err);
    console.log('Error while saving');
  }
});

app.get('/users', async (req, res) => {
  try {
    const users = await User.find({});
    if (!users) {
      return res.status(404).send();
    }
    res.send(users);
  } catch (err) {
    res.status(500).send();
  }
});

app.get('/users/:id', async (req, res) => {
  try {
    const _id = req.params.id;
    const user = await User.findById(_id);
    if (!user) {
      return res.status(404).send();
    }
    res.send(user);
  } catch (err) {
    res.status(500).send({ err: 'Something Went wrong!' });
  }
});

app.post('/addtask', async (req, res) => {
  const task = new Task(req.body);
  try {
    await task.save();
    res.status(201).send(task);
  } catch (err) {
    res.status(400).send(err);
  }
});

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
