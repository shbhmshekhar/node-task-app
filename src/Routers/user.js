const express = require('express');
const User = require('../models/user');
const auth = require('../middleware/auth');
const multer = require('multer');
const sharp = require('sharp');
const { sendWelcomeEmail, sendCancellationMail } = require('../emails/account');

const upload = multer({
  limits: {
    fileSize: 1000000,
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error('Please upload an image')); // Reject Upload file with err msg
    }

    // cb(undefined, false)// Reject Upload file with no err msg
    cb(undefined, true); // accept Upload file
  },
});

const router = new express.Router();

// LOGIN USER
router.post('/user/login', async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );

    const token = await user.generateAuthToken();
    temptoken = token;
    res.send({ user, token });
  } catch (err) {
    res.status(400).send();
  }
});

//LOGOUT FROM THE CURRENT ACTIVE SESSION
router.post('/user/logout', auth, async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(
      (token) => token.token !== req.token
    );
    await req.user.save();
    res.send();
  } catch (err) {
    res.status(500).send();
  }
});

//CLEAR ALL ACTIVE SESSION
router.post('/user/logoutAll', auth, async (req, res) => {
  try {
    req.user.tokens = [];
    await req.user.save();
    res.send();
  } catch (err) {
    res.status(500).send();
  }
});

//SIGNUP NEW USERS
router.post('/addusers', async (req, res) => {
  // Create a new user
  const user = new User(req.body);
  try {
    await user.save();
    sendWelcomeEmail(user.email, user.name);
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (err) {
    res.status(400).send(err);
    console.log('Error while saving');
  }
});

/*
 *ADD MULTER FOR UPLOADING USER AVATAR
 */

router.post(
  '/user/me/avatar',
  auth,
  upload.single('avatar'),
  async (req, res) => {
    // req.user.avatar = req.file.buffer;
    const buffer = await sharp(req.file.buffer)
      .resize({
        width: 250,
        height: 250,
      })
      .png()
      .toBuffer();

    req.user.avatar = buffer;

    await req.user.save();

    res.send();
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

//DELETE USER AVATAR
router.delete('/user/me/avatar', auth, async (req, res) => {
  try {
    req.user.avatar = undefined;
    await req.user.save();
    res.send();
  } catch (err) {
    res.status(500).send({ error: err });
  }
});

//GET USER AVATAR
router.get('/users/:id/avatar', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user || !user.avatar) {
      throw new Error();
    }
    res.set('Content-Type', 'image/png').send(user.avatar);
  } catch (err) {
    res.status(404).send();
  }
});

//GET USER PROFILE
router.get('/users/me', auth, async (req, res) => {
  res.send(req.user);
});

router.patch('/users/me', auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['name', 'email', 'password', 'age'];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );
  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid Updates' });
  }
  try {
    // const user = await User.findById(req.user._id);
    // if (!user) {
    //   return res.status(404).send();
    // }
    updates.forEach((update) => (req.user[update] = req.body[update]));
    await req.user.save();
    // const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    //   new: true,
    //   runValidators: true,
    // });

    res.send(req.user);
  } catch (err) {
    res.status(400).send(err);
  }
});

router.delete('/users/me', auth, async (req, res) => {
  try {
    // const deletedUser = await User.findByIdAndDelete(req.user._id);
    // if (!deletedUser) return res.status(404).send();

    await req.user.remove();

    sendCancellationMail(req.user.email, req.user.name);
    res.send(req.user);
  } catch (err) {
    res.status(500).send();
  }
});

// router.get('/users/:id', async (req, res) => {
//   try {
//     const _id = req.params.id;
//     const user = await User.findById(_id);
//     if (!user) {
//       return res.status(404).send();
//     }
//     res.send(user);
//   } catch (err) {
//     res.status(500).send({ err: 'Something Went wrong!' });
//   }
// });

module.exports = router;
