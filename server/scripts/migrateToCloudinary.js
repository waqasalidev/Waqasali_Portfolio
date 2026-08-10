/**
 * migrate-to-cloudinary.js
 *
 * One-time script to migrate any project images stored as local paths
 * (e.g. "/uploads/filename.png" or "http://localhost:5000/uploads/...") to
 * permanent Cloudinary URLs and update MongoDB accordingly.
 *
 * Usage (from the /server directory):
 *   node scripts/migrateToCloudinary.js
 *
 * Prerequisites:
 *   - CLOUDINARY_* and MONGO_URI must be set in server/.env
 *   - The local files referenced must still exist in server/uploads/
 */

import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dns from "dns";
import Project from "../models/Project.js";
import cloudinary from "../config/cloudinary.js";

// Use Google DNS to avoid SRV resolution failures on some local setups
if (process.env.NODE_ENV !== "production" && dns.setServers) {
  try {
    dns.setServers(["8.8.8.8", "8.8.4.4"]);
  } catch (e) {
    console.warn("Could not override DNS servers:", e.message);
  }
}

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const UPLOADS_DIR = path.join(__dirname, "../uploads");

/**
 * Returns true if the URL is already a Cloudinary URL.
 */
const isCloudinaryUrl = (url) =>
  typeof url === "string" &&
  (url.startsWith("http://res.cloudinary.com") ||
    url.startsWith("https://res.cloudinary.com"));

/**
 * Extracts the bare filename from a local path or localhost URL.
 */
const extractFilename = (imgUrl) => {
  try {
    if (imgUrl.startsWith("http")) {
      return path.basename(new URL(imgUrl).pathname);
    }
    // Relative path: "/uploads/foo.png" or "uploads/foo.png"
    return path.basename(imgUrl);
  } catch {
    return null;
  }
};

const runMigration = async () => {
  if (!process.env.CLOUDINARY_CLOUD_NAME) {
    console.error("❌  CLOUDINARY_* env vars are not set. Aborting.");
    process.exit(1);
  }

  console.log("Connecting to MongoDB...");
  await mongoose.connect(process.env.MONGO_URI);
  console.log("✅  Connected to MongoDB.\n");

  const projects = await Project.find({});
  console.log(`Found ${projects.length} project(s) to inspect.\n`);

  let migratedCount = 0;

  for (const project of projects) {
    console.log(`──────────────────────────────────────`);
    console.log(`Project: "${project.title}" (${project._id})`);

    if (!project.images || project.images.length === 0) {
      console.log("  No images — skipping.\n");
      continue;
    }

    let changed = false;
    const newImages = [];

    for (const imgUrl of project.images) {
      // Already on Cloudinary — keep as-is
      if (isCloudinaryUrl(imgUrl)) {
        console.log(`  ✅  Already on Cloudinary: ${imgUrl}`);
        newImages.push(imgUrl);
        continue;
      }

      // Local / localhost URL — try to upload
      const filename = extractFilename(imgUrl);
      if (!filename) {
        console.warn(`  ⚠️  Cannot parse filename from: ${imgUrl} — keeping.`);
        newImages.push(imgUrl);
        continue;
      }

      const localPath = path.join(UPLOADS_DIR, filename);

      if (!fs.existsSync(localPath)) {
        console.warn(`  ⚠️  Local file not found: ${localPath}`);
        console.warn(`      This image will be REMOVED from the project (it no longer exists).`);
        // Do NOT push the broken URL — effectively removes the dead reference
        changed = true;
        continue;
      }

      console.log(`  ⬆️  Uploading: ${filename} → Cloudinary...`);
      try {
        const result = await cloudinary.uploader.upload(localPath, {
          folder: "portfolio_projects",
        });
        console.log(`  ✅  Done: ${result.secure_url}`);
        newImages.push(result.secure_url);
        changed = true;
        migratedCount++;
      } catch (err) {
        console.error(`  ❌  Upload failed for ${filename}:`, err.message);
        // Keep the old URL so we don't silently lose it
        newImages.push(imgUrl);
      }
    }

    if (changed) {
      project.images = newImages;
      await project.save();
      console.log(`  💾  Saved updated images for "${project.title}".`);
    } else {
      console.log(`  (No changes needed)`);
    }
    console.log();
  }

  console.log("══════════════════════════════════════");
  console.log(`Migration complete. ${migratedCount} image(s) uploaded to Cloudinary.`);
  process.exit(0);
};

runMigration().catch((err) => {
  console.error("Migration script failed:", err);
  process.exit(1);
});
