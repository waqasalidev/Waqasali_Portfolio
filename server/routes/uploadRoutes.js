import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import protect from "../middleware/authMiddleware.js";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";

const router = express.Router();

// Allow uploading up to 10 images at once
router.post("/", protect, upload.array("images", 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const uploadPromises = req.files.map(async (file) => {
      // Upload local file to Cloudinary
      const result = await cloudinary.uploader.upload(file.path, {
        folder: "portfolio_projects",
      });

      // Delete local file from disk after successful Cloudinary upload
      try {
        fs.unlinkSync(file.path);
      } catch (err) {
        console.error(`Failed to delete local temp file ${file.path}:`, err);
      }

      // Return the secure URL from Cloudinary
      return result.secure_url;
    });

    const filePaths = await Promise.all(uploadPromises);

    res.status(201).json({
      message: "Images uploaded successfully to Cloudinary",
      filePaths,
    });
  } catch (error) {
    // Attempt to clean up any uploaded files in case of errors
    if (req.files) {
      req.files.forEach((file) => {
        try {
          if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
          }
        } catch (err) {
          console.error(`Failed to clean up local temp file ${file.path}:`, err);
        }
      });
    }
    res.status(500).json({ message: error.message });
  }
});

export default router;
