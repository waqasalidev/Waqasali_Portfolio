import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "../config/db.js";

dotenv.config();

const run = async () => {
  await connectDB();
  const conn = mongoose.connection.useDb("nexride");
  const collections = ["cars", "bikes", "jets", "ships", "vehicles"];
  for (const col of collections) {
    console.log(`Checking nexride.${col}...`);
    const docs = await conn.db.collection(col).find({}).toArray();
    for (const doc of docs) {
      if (doc.images && doc.images.length > 0) {
        const cloudUrl = doc.images.find(img => img.includes("cloudinary.com"));
        if (cloudUrl) {
          console.log(`Found Cloudinary URL in ${col}:`, cloudUrl);
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
