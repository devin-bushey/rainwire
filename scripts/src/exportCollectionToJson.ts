require("dotenv").config({ path: "../.env" });
import { MongoClient } from "mongodb";
import * as fs from "fs";

// USAGE: npx ts-node ./src/exportCollectionToJson.ts <Collection>

// MongoDB Atlas connection string
const mongo_uri = process.env.ATLAS_URI || "";

// MongoDB database name and collection name
const db_name = "RecordShop";
const collection_name = process.argv[2];

// Function to export MongoDB collection to JSON file
async function exportCollectionToJson(
  mongo_uri: string,
  db_name: string,
  collection_name: string,
  output_file: string,
) {
  // Connect to MongoDB Atlas
  const client = new MongoClient(mongo_uri);

  try {
    await client.connect();

    // Access the specified database and collection
    const db = client.db(db_name);
    const collection = db.collection(collection_name);

    // Retrieve all documents from the collection excluding _id field
    const documents = await collection.find({}, { projection: { _id: 0 } }).toArray();

    // Write documents to JSON file
    fs.writeFileSync(output_file, JSON.stringify(documents, null, 4));

    console.log(`Exported collection '${collection_name}' to JSON file: ${output_file}`);
  } finally {
    // Close the MongoDB connection
    await client.close();
  }
}

// Define the output file path
const output_file = `${collection_name}.json`;

// Call the function to export the collection to JSON
exportCollectionToJson(mongo_uri, db_name, collection_name, output_file).catch(console.error);
