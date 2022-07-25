const express = require('express');
const Task = require('../models/task');

const router = new express.Router();

router.post('/addtask', async (req, res) => {
  const task = new Task(req.body);
  try {
    await task.save();
    res.status(201).send(task);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find({});
    if (!tasks) {
      return res.status(404).send();
    }
    res.send(tasks);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.get('/tasks/:id', async (req, res) => {
  try {
    const _id = req.params.id;
    const task = await Task.findById(_id);
    if (!task) {
      return res.status(404).send();
    }
    res.send(task);
  } catch (err) {
    res.status(500).send();
  }
});

router.patch('/task/:id', async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedFieldsToUpdate = ['description', 'completed'];
  const isUpdateValid = updates.every((update) =>
    allowedFieldsToUpdate.includes(update)
  );
  if (!isUpdateValid) {
    return res.status(400).send({ error: 'Invalid Updates' });
  }
  try {
    const task = await Task.findById(req.params.id);
    // const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
    //   new: true,
    //   runValidators: true,
    // });
    if (!task) {
      return res.status(404).send();
    }
    updates.forEach((update) => (task[update] = req.body[update]));
    await task.save();
    res.send(task);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.delete('/task/:id', async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(400).send();
    }
    res.send(task);
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
