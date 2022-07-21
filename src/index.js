const express = require('express');
require('./db/mongoose');
const User = require('./models/user');

const app = express();

const port = process.env.PORT || 3000;

app.use(express.json());

app.post('/users', async (req, res) => {
  // Create a new user
  const user = new User(req.body);
  try {
    await user.save();
    res.send(user);
  } catch (err) {
    res.status(400).send(err);
    console.log('Error while saving');
  }
});

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
