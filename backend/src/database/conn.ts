import { MongoClient } from 'mongodb';

const Db = process.env.ATLAS_URI || '';
const client = new MongoClient(Db);

let _db: any;

export default {
  connectToServer: async (callback: any) => {
    try {
      await client.connect();
    } catch (e) {
      console.error(e);
    }

    _db = client.db('RecordShop');

    return _db !== undefined;
  },
  getDb: () => _db,
};
