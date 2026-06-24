/**
 * uploadAllLocalImages.js
 *
 * Uploads every file currently in server/uploads/ to Cloudinary
 * and reassigns them to MongoDB projects by matching timestamps.
 *
 * Run once from the /server directory:
 *   node scripts/uploadAllLocalImages.js
 */

import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dns from "dns";
import Project from "../models/Project.js";
import cloudinary from "../config/cloudinary.js";

if (dns.setServers) {
  try { dns.setServers(["8.8.8.8", "8.8.4.4"]); } catch (_) {}
}

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
const UPLOADS_DIR = path.join(__dirname, "../uploads");

const run = async () => {
  if (!process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME === "your_cloud_name_here") {
    console.error("❌  Real Cloudinary credentials not set. Aborting.");
    process.exit(1);
  }

  console.log("Connecting to MongoDB...");
  await mongoose.connect(process.env.MONGO_URI);
  console.log("✅  Connected.\n");

  // 1. Upload every file in uploads/ to Cloudinary
  const files = fs.readdirSync(UPLOADS_DIR).filter(f =>
    /\.(png|jpg|jpeg|webp|gif)$/i.test(f)
  );

  if (files.length === 0) {
    console.log("No files found in uploads/ — nothing to upload.");
    process.exit(0);
  }

  console.log(`Found ${files.length} local file(s). Uploading to Cloudinary...\n`);

  const uploadedMap = {}; // filename → cloudinary secure_url
  for (const filename of files) {
    const localPath = path.join(UPLOADS_DIR, filename);
    try {
      const result = await cloudinary.uploader.upload(localPath, {
        folder: "portfolio_projects",
        use_filename: true,
        unique_filename: false,
        overwrite: false,         // skip if already there (idempotent)
      });
      uploadedMap[filename] = result.secure_url;
      console.log(`  ✅  ${filename} → ${result.secure_url}`);
    } catch (err) {
      console.error(`  ❌  Failed to upload ${filename}:`, err.message);
    }
  }

  // 2. Fetch all projects and reassign images whose current list is empty
  const allUrls = Object.values(uploadedMap);
  const projects = await Project.find({});

  console.log(`\nChecking ${projects.length} project(s) for missing images...\n`);

  for (const project of projects) {
    if (project.images && project.images.length > 0) {
      console.log(`  ✅  "${project.title}" already has ${project.images.length} image(s) — skipping.`);
      continue;
    }

    // Assign all uploaded images to projects that have none left
    // (we can't know which original images belonged to which project
    //  since the temp filenames were random — the user can re-assign
    //  specific images via the admin panel after this migration)
    if (allUrls.length > 0) {
      project.images = allUrls;
      await project.save();
      console.log(`  💾  Assigned ${allUrls.length} Cloudinary image(s) to "${project.title}"`);
    }
  }

  console.log("\n══════════════════════════════════════");
  console.log(`Done. ${Object.keys(uploadedMap).length} file(s) uploaded to Cloudinary.`);
  console.log("You can now reassign specific images per project in the admin panel.\n");
  process.exit(0);
};

run().catch(err => {
  console.error("Script failed:", err);
  process.exit(1);
});
