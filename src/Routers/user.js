const express = require('express');
const User = require('../models/user');

const router = new express.Router();

router.post('/users/login', async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );

    console.log('user', user);
    res.send(user);
  } catch (err) {
    res.status(400).send();
  }
});

router.post('/addusers', async (req, res) => {
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

router.get('/users', async (req, res) => {
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

router.get('/users/:id', async (req, res) => {
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

router.patch('/users/:id', async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['name', 'email', 'password', 'age'];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );
  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid Updates' });
  }
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).send();
    }
    updates.forEach((update) => (user[update] = req.body[update]));
    await user.save();
    // const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    //   new: true,
    //   runValidators: true,
    // });

    res.send(user);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.delete('/user/:id', async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).send();
    res.send(deletedUser);
  } catch (err) {
    re.status(500).send();
  }
});

module.exports = router;
