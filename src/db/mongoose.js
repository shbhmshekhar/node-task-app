const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api', {
  useNewUrlParser: true,
  //   useCreateIndex: true,
});

// const User = mongoose.model('User', {
//   name: {
//     type: String,
//   },
//   age: {
//     type: Number,
//   },
// });

// // CREATE A NEW USER

// const me = new User({ name: 'Shubham', age: 27 });

// me.save()
//   .then((res) => console.log('data saved', re))
//   .catch((err) => console.log('something went wrong', err));

const Tasks = mongoose.model('Tasks', {
  description: {
    type: String,
  },
  completed: {
    type: Boolean,
  },
});

// CREATE A NEW TASK

const firstTask = new Tasks({ description: 'First Task', completed: true });

firstTask
  .save()
  .then((res) => console.log('data saved', res))
  .catch((err) => console.log('something went wrong', err));
