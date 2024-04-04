import { Db, MongoClient } from "mongodb";

const databaseUri = process.env.ATLAS_URI || "";
const client = new MongoClient(databaseUri);

let _db: Db;

export default {
  connectToServer: async (callback: any) => {
    try {
      await client.connect();
    } catch (e) {
      console.error(e);
    }

    _db = client.db("RecordShop");

    return _db !== undefined;
  },
  getDb: () => _db,
};
