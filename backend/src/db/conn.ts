const { MongoClient } = require('mongodb');
const Db = process.env.ATLAS_URI;
const client = new MongoClient(Db, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

var _db: any;

export function connectToServer(callback: any) {
  client.connect(function (err: any, db: any) {
    // Verify we got a good "db" object
    if (db) {
      _db = db.db('RecordShop');
      console.log('Successfully connected to MongoDB.');
    } else {
      console.log('ERROR: ', err);
    }
    return callback(err);
  });
}

export function getDb() {
  return _db;
}
