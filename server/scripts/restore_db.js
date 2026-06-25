import mongoose from "mongoose";
import dotenv from "dotenv";
import connectDB from "../config/db.js";
import Project from "../models/Project.js";

dotenv.config();

const originalData = {
  "6a38d500cd2b5dcb4c5f5a90": [
    '/uploads/images-1782303212642.png',
    '/uploads/images-1782303214102.webp',
    '/uploads/images-1782303214111.webp',
    '/uploads/images-1782303214147.webp',
    '/uploads/images-1782303214148.webp',
    '/uploads/images-1782303214148.webp',
    '/uploads/images-1782303214153.webp',
    '/uploads/images-1782303214162.webp'
  ],
  "6a390d30d1eecf9383fcf153": [
    '/uploads/images-1782303127908.png',
    '/uploads/images-1782303129743.webp',
    '/uploads/images-1782303129764.webp',
    '/uploads/images-1782303129799.webp',
    '/uploads/images-1782303129843.webp',
    '/uploads/images-1782303129879.webp',
    '/uploads/images-1782303129947.webp'
  ],
  "6a3bcc20ef16845e048cac1b": [
    '/uploads/images-1782303774096.png',
    '/uploads/images-1782303775294.webp',
    '/uploads/images-1782303775299.webp',
    '/uploads/images-1782303775300.webp',
    '/uploads/images-1782303775304.webp',
    '/uploads/images-1782303775306.webp'
  ]
};

const run = async () => {
  await connectDB();
  for (const [id, images] of Object.entries(originalData)) {
    await Project.updateOne({ _id: id }, { $set: { images } });
    console.log(`Restored ${id}`);
  }
  process.exit(0);
};

run().catch(err => {
  console.error(err);
  process.exit(1);
});
