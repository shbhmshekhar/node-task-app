const mongoose = require('mongoose');

const Task = mongoose.model('Task', {
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

module.exports = Task;

//  CREATE A NEW TASK

// const firstTask = new Tasks({});

// firstTask
//   .save()
//   .then((res) => console.log('data saved', res))
//   .catch((err) => console.log('something went wrong', err));
