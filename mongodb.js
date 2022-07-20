const mongodb = require('mongodb');

const { MongoClient, ObjectId } = mongodb;

const connectionURL = 'mongodb://127.0.0.1:27017';
const databaseName = 'task-manager';

const id = new ObjectId();

console.log(id.id.length);
console.log(id.toHexString().length);

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
    //     },
    //     {
    //       name: 'Task app - 3',
    //       data_type: 'Fourth entry',
    //     },
    //   ],
    //   (err, res) => {
    //     if (error) {
    //       return console.log('Unable to insert User');
    //     }
    //     console.log(res);
    //   }
    // );
  }
);
