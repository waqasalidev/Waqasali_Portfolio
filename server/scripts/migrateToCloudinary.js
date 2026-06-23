import mongoose from "mongoose";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dns from "dns";
import Project from "../models/Project.js";
import cloudinary from "../config/cloudinary.js";

// Fix Node querySrv issues on some local DNS configurations by setting fallback servers
if (dns.setServers) {
  try {
    dns.setServers(["8.8.8.8", "8.8.4.4"]);
  } catch (e) {
    console.warn("Could not set DNS servers:", e.message);
  }
}

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const runMigration = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB.");

    const projects = await Project.find({});
    console.log(`Found ${projects.length} projects to check.`);

    for (const project of projects) {
      console.log(`Checking project: "${project.title}" (ID: ${project._id})`);
      let updated = false;
      const newImages = [];

      for (const imgUrl of project.images) {
        if (imgUrl.startsWith("http://res.cloudinary.com") || imgUrl.startsWith("https://res.cloudinary.com")) {
          console.log(`- Image is already on Cloudinary: ${imgUrl}`);
          newImages.push(imgUrl);
          continue;
        }

        // It is a local relative path or localhost URL. Let's extract the filename.
        let filename = "";
        try {
          if (imgUrl.startsWith("http")) {
            // URL format e.g. http://localhost:5000/uploads/filename.png
            const urlObj = new URL(imgUrl);
            filename = path.basename(urlObj.pathname);
          } else {
            // Relative path e.g. /uploads/filename.png
            filename = path.basename(imgUrl);
          }
        } catch (e) {
          console.error(`- Failed to parse filename from URL: ${imgUrl}`);
          continue;
        }

        if (!filename) {
          console.warn(`- Could not extract filename from: ${imgUrl}`);
          continue;
        }

        // Check if file exists in the server/uploads folder
        const localFilePath = path.join(__dirname, "../uploads", filename);
        if (fs.existsSync(localFilePath)) {
          console.log(`- Found local file: ${localFilePath}. Uploading to Cloudinary...`);
          try {
            const uploadResult = await cloudinary.uploader.upload(localFilePath, {
              folder: "portfolio_projects",
            });
            console.log(`- Successfully uploaded! New URL: ${uploadResult.secure_url}`);
            newImages.push(uploadResult.secure_url);
            updated = true;
          } catch (uploadErr) {
            console.error(`- Cloudinary upload failed for ${filename}:`, uploadErr);
            newImages.push(imgUrl); // Keep the old one on failure
          }
        } else {
          console.warn(`- Local file not found: ${localFilePath}`);
          newImages.push(imgUrl); // Keep the old one
        }
      }

      if (updated) {
        project.images = newImages;
        await project.save();
        console.log(`- Saved updated images for project: "${project.title}"`);
      }
    }

    console.log("Migration complete.");
    process.exit(0);
  } catch (error) {
    console.error("Migration script failed:", error);
    process.exit(1);
  }
};

runMigration();
