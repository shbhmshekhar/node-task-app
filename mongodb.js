const mongodb = require('mongodb');

const { MongoClient, ObjectId } = mongodb;

const connectionURL = 'mongodb://127.0.0.1:27017';
const databaseName = 'task-manager';

const id = new ObjectId();

// console.log(id.id.length);
// console.log(id.toHexString().length);

MongoClient.connect(
  connectionURL,
  { useNewUrlParser: true },
  (error, client) => {
    if (error) {
      return console.log('Unable to connect to Database');
    }

    const db = client.db(databaseName);

    // db.collection('users').insertOne(
    //   {
    //     // _id: id,
    //     name: 'Task app',
    //     data_type: 'First entry',
    //   },
    //   (err, res) => {
    //     if (error) {
    //       return console.log('Unable to insert User');
    //     }
    //     console.log(res.insertedId);
    //   }
    // );
    // INsert Multiple document
    // db.collection('users').insertMany(
    //   [
    //     {
    //       name: 'Task app - 2',
    //       data_type: 'Third entry',
    //       count: 1,
    //     },
    //     {
    //       name: 'Task app - 3',
    //       data_type: 'Fourth entry',
    //       count: 1,
    //     },
    //   ],
    //   (err, res) => {
    //     if (error) {
    //       return console.log('Unable to insert User');
    //     }
    //     console.log(res);
    //   }
    // );
    // db.collection('users').findOne(
    //   { name: 'Task app', data_type: '123' },
    //   (err, res) => {
    //     if (error) {
    //       return console.log('Unable to find data');
    //     }
    //     console.log(res);
    //   }
    // );

    // db.collection('users')
    //   .find({ name: 'Task app' })
    //   .count((err, res) => {
    //     console.log(res);
    //   });

    //Update document
    db.collection('users')
      .updateOne(
        {
          _id: new ObjectId('62d90b04a37ad2b46e2d53bf'),
        },
        {
          // $set: {
          //   name: 'new Task name',
          // },
          $inc: {
            count: 1,
          },
        }
      )
      .then((result) => console.log(result))
      .catch((err) => console.log(err));
  }
);
