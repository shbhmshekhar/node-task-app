const express = require('express');
require('./db/mongoose');
const User = require('./models/user');
const Task = require('./models/task');
const userRouter = require('./Routers/user');
const taskRouter = require('./Routers/task');

const app = express();

const port = process.env.PORT || 3000;

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});

// const Task = require('./models/task');

// const main = async () => {
//   try {
//     // const task = await Task.findById('62df84d2ff9c7123f07bb977');
//     // await task.populate('owner');
//     // console.log(task.owner);
//     const user = await User.findById('62df7db1497af24a143b9b94');

//     await user.populate('tasks');
//     console.log(user.tasks);
//   } catch (err) {
//     console.log('error', err);
//   }
// };

// main();

//EG. FILE UPLOAD
//
// const upload = multer({ dest: 'uploads/' });

// app.post('/upload', upload.single('upload'), async (req, res) => {
//   res.send();
// });
