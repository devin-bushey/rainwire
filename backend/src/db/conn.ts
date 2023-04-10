const { MongoClient } = require('mongodb');
const Db = process.env.ATLAS_URI;
const client = new MongoClient(Db, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

var _db: any;

export async function connectToServer(callback: any) {
  try {
    await client.connect();
  } catch (e) {
    console.error(e);
  }

  _db = client.db('RecordShop');

  return _db === undefined ? false : true;
}

export function getDb() {
  return _db;
}
