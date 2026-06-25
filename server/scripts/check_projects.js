import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "../config/db.js";
import Project from "../models/Project.js";

dotenv.config();

const run = async () => {
  await connectDB();
  console.log("Connected to MongoDB.");

  const projects = await Project.find({});
  console.log(`Found ${projects.length} projects:`);
  for (const p of projects) {
    console.log(`\n--------------------------------------`);
    console.log(`ID: ${p._id}`);
    console.log(`Title: ${p.title}`);
    console.log(`Category: ${p.category}`);
    console.log(`Images:`, p.images);
  }

  process.exit(0);
};

run().catch(err => {
  console.error(err);
  process.exit(1);
});
