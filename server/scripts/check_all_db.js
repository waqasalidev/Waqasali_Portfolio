import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "../config/db.js";

dotenv.config();

const run = async () => {
  console.log("Connecting to MongoDB...");
  await connectDB();
  console.log("Connected.");

  const adminDb = mongoose.connection.db.admin();
  const dbsInfo = await adminDb.listDatabases();
  console.log("Databases list:", dbsInfo.databases.map(d => d.name));

  for (const dbInfo of dbsInfo.databases) {
    const dbName = dbInfo.name;
    // Skip system databases
    if (dbName === "admin" || dbName === "local" || dbName === "config") continue;

    console.log(`\n🔍 Checking database: ${dbName}...`);
    const db = mongoose.connection.useDb(dbName);
    const collections = await db.db.listCollections().toArray();

    for (const colInfo of collections) {
      const colName = colInfo.name;
      const docs = await db.db.collection(colName).find({}).toArray();
      for (const doc of docs) {
        const jsonStr = JSON.stringify(doc);
        if (jsonStr.includes("cloudinary.com")) {
          console.log(`🎉 Found Cloudinary reference in ${dbName}.${colName}:`);
          // Extract the Cloudinary URL using regex
          const match = jsonStr.match(/https?:\/\/[^\s"']+/g);
          if (match) {
            for (const url of match) {
              if (url.includes("cloudinary.com")) {
                console.log(`   URL: ${url}`);
              }
            }
          } else {
            console.log(`   Doc:`, doc);
          }
        }
      }
    }
  }

  process.exit(0);
};

run().catch(err => {
  console.error(err);
  process.exit(1);
});
