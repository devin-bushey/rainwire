require("dotenv").config({ path: "../.env" });
import { MongoClient } from "mongodb";
import { Gig } from "../model/Gig";

// USAGE: npx ts-node ./src/migrate/migrateDocuments.ts <DB Collection>

// npx ts-node ./src/migrate/migrateDocuments.ts phillipsBackyard

const COLLECTION_NAME = process.argv[2];
const ATLAS_URI = process.env.ATLAS_URI || "";

const startMigration = async () => {
  const dbConnection = await connectToDatabase();

  if (!dbConnection) throw new Error("Error connecting to DB");

  dbConnection
    .collection(COLLECTION_NAME)
    .find({})
    .toArray(async (err, result) => {
      if (err) throw err;

      await migrateDocuments(dbConnection, result);
    });
};

const connectToDatabase = async () => {
  // Connect to MongoDB and update the existing collection
  const client = new MongoClient(ATLAS_URI);
  try {
    console.log(`Connecting to your database ..`);
    await client.connect();
    console.log("Successfully connected");
  } catch (e) {
    console.error(e);
    return;
  }

  return client.db("RecordShop");
};

const migrateDocuments = async (dbConnection: any, oldGigs: any) => {
  console.log("Starting migration ...");

  for await (const oldDocument of oldGigs) {
    console.log(`Found ${oldDocument.band_id}`);

    const newDocument: Gig = {
      artist: {
        id: oldDocument.band_id,
        name: oldDocument.sp_band_name,
        topTracks: oldDocument.topTrackURIs,
        uri: oldDocument.uri,
        albumArtUrl: oldDocument.albumArtUrl,
        link: oldDocument.link,
      },
      date: new Date(oldDocument.date),
      venue: oldDocument.venue,
      popularity: oldDocument.popularity,
    };

    console.log(`migrating ${newDocument.artist.name}`);

    await dbConnection.collection(COLLECTION_NAME).updateOne({ _id: oldDocument._id }, { $set: newDocument });

    console.log(`Updated ${newDocument.artist.name}, id: ${oldDocument._id}`);
  }

  console.log("Conversion complete");
};

startMigration();
