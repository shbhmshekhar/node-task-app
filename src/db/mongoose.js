const mongoose = require('mongoose');
const validator = require('validator');

mongoose.connect(process.env.MONGOOSE_DB_URL, {
  useNewUrlParser: true,
});
