const express = require('express');
const Task = require('../models/task');
const auth = require('../middleware/auth');

const router = new express.Router();

// CREATE A TASK FOR A USER
router.post('/addtask', auth, async (req, res) => {
  // const task = new Task(req.body);
  const task = new Task({ ...req.body, owner: req.user._id });
  try {
    await task.save();
    res.status(201).send(task);
  } catch (err) {
    res.status(400).send(err);
  }
});

/*
 * GET ALL TASKS FOR A USER
 * ADDED FILTER BASED ON QUERY PARAMS: GET /tasks?completed=true/false
 * ADDED PAGINATION GET /tasks?limit=$num&skip=$num
 * ADDED SKIP GET /tasks?skip=$num
 * ADDED SORT GET /tasks?sortBy=createdAt:asc/desc
 */
router.get('/tasks', auth, async (req, res) => {
  try {
    const match = {};
    const sort = {};
    if (req.query.completed) {
      match.completed = req.query.completed === 'true';
    }
    if (req.query.sortBy) {
      const parts = req.query.sortBy.split(':');
      sort[parts[0]] = parts[1] === 'desc' ? -1 : 1;
    }
    await req.user.populate({
      path: 'tasks',
      match,
      options: {
        limit: !req.query.limit ? 0 : parseInt(req.query.limit),
        skip:
          req.query.skip < 0 || !req.query.skip ? 0 : parseInt(req.query.skip),
        sort,
      },
    });
    res.send(req.user.tasks);
    // let completedStatus = {};
    // if (req.query.completed) {
    //   completedStatus.completed = req.query.completed === 'true';
    // }
    // const tasks = await Task.find({
    //   owner: req.user._id,
    //   ...completedStatus,
    // });

    // if (!tasks) {
    //   return res.status(404).send();
    // }
    // res.send(tasks);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

// GET TASK BY ID
router.get('/tasks/:id', auth, async (req, res) => {
  try {
    const _id = req.params.id;
    const task = await Task.findOne({ _id, owner: req.user._id });
    if (!task) {
      return res.status(404).send();
    }
    res.send(task);
  } catch (err) {
    res.status(500).send();
  }
});

// UPDATE A SPECIFIC TASK
router.patch('/task/:id', auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedFieldsToUpdate = ['description', 'completed'];
  const isUpdateValid = updates.every((update) =>
    allowedFieldsToUpdate.includes(update)
  );
  if (!isUpdateValid) {
    return res.status(400).send({ error: 'Invalid Updates' });
  }
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });
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

//DELETE TASK
router.delete('/task/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });
    if (!task) {
      return res.status(400).send();
    }
    res.send(task);
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
