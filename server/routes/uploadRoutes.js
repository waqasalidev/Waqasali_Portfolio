import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

// Allow uploading up to 10 images at once
router.post("/", protect, upload.array("images", 10), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const filePaths = req.files.map((file) => `/uploads/${file.filename}`);

    res.status(201).json({
      message: "Images uploaded successfully",
      filePaths,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
