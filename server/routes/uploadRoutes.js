import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import protect from "../middleware/authMiddleware.js";
import cloudinary from "../config/cloudinary.js";

const router = express.Router();

/**
 * Uploads a single file buffer to Cloudinary using an upload stream.
 * This avoids any disk I/O — critical for ephemeral cloud filesystems.
 *
 * @param {Buffer} buffer   - File buffer from multer memoryStorage
 * @param {string} mimetype - MIME type of the file (e.g. "image/png")
 * @returns {Promise<string>} - Resolves with the Cloudinary secure_url
 */
const uploadBufferToCloudinary = (buffer, mimetype) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "portfolio_projects", resource_type: "image" },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );
    uploadStream.end(buffer);
  });
};

// POST /api/upload — allow uploading up to 10 images at once
router.post("/", protect, upload.array("images", 10), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    // Upload all buffers to Cloudinary in parallel
    const uploadPromises = req.files.map((file) =>
      uploadBufferToCloudinary(file.buffer, file.mimetype)
    );

    const filePaths = await Promise.all(uploadPromises);

    res.status(201).json({
      message: "Images uploaded successfully to Cloudinary",
      filePaths,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ message: error.message });
  }
});

export default router;
