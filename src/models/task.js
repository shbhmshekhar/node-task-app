const mongoose = require('mongoose');
const taskSchema = new mongoose.Schema({
  description: {
    type: String,
    required: true,
    trim: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;

//  CREATE A NEW TASK

// const firstTask = new Tasks({});

// firstTask
//   .save()
//   .then((res) => console.log('data saved', res))
//   .catch((err) => console.log('something went wrong', err));
