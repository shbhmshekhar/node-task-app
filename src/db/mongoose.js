const mongoose = require('mongoose');
const validator = require('validator');

mongoose.connect('mongodb://127.0.0.1:27017/task-manager-api', {
  useNewUrlParser: true,
  //   useCreateIndex: true,
});

// const User = mongoose.model('User', {
//   name: {
//     type: String,
//     required: true,
//     trim: true,
//   },
//   email: {
//     type: String,
//     required: true,
//     trim: true,
//     lowercase: true,
//     validate(value) {
//       if (!validator.isEmail(value)) {
//         throw new Error('Invalid Email');
//       }
//     },
//   },
//   password: {
//     type: String,
//     required: true,
//     trim: true,
//     minLength: 7,
//     validate(value) {
//       if (value.toLowerCase().includes('password')) {
//         throw new Error(`Password can't be ${value}`);
//       }
//     },
//   },
//   age: {
//     type: Number,
//     default: 0,
//     validate(value) {
//       if (value < 0) {
//         throw new Error("Age can't be negative");
//       }
//     },
//   },
// });

// // CREATE A NEW USER

// const secondUser = new User({
//   name: '   Test User2  ',
//   email: '   TEST2@test.COM   ',
//   password: 'pard1',
// });

// secondUser
//   .save()
//   .then((res) => console.log('data saved', res))
//   .catch((err) => console.log('something went wrong', err));

const Tasks = mongoose.model('Task', {
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

// CREATE A NEW TASK

const firstTask = new Tasks({});

firstTask
  .save()
  .then((res) => console.log('data saved', res))
  .catch((err) => console.log('something went wrong', err));
