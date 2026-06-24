import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

// ─── Validate credentials at startup ───────────────────────────────────────
// If any of these are missing the server will start, but every upload call
// will fail with a cryptic Cloudinary authentication error.  Logging a clear
// warning here makes the root cause immediately obvious in Render's log tail.
const { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;

if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
  console.warn(
    "\n⚠️  CLOUDINARY CREDENTIALS MISSING ⚠️\n" +
    "Set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET\n" +
    "in your Render environment variables (or .env for local dev).\n" +
    "Image uploads WILL fail until these are configured.\n"
  );
}

// Configure Cloudinary
cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
  secure: true, // always use https URLs
});

/**
 * Extracts Cloudinary public_id from a secure URL.
 * Handles versioned paths like /upload/v1234567/folder/name.ext
 * @param {string} url - Cloudinary image URL
 * @returns {string|null} - Public ID or null if not a Cloudinary URL
 */
export const getPublicIdFromUrl = (url) => {
  if (!url || !url.includes("cloudinary.com")) return null;

  // e.g. https://res.cloudinary.com/<cloud>/image/upload/v123/folder/name.png
  const parts = url.split("/upload/");
  if (parts.length < 2) return null;

  const pathAfterUpload = parts[1];
  const segments = pathAfterUpload.split("/");

  // Strip the version segment if present (v followed by digits)
  if (segments[0] && /^v\d+$/.test(segments[0])) {
    segments.shift();
  }

  const remaining = segments.join("/");
  const dotIndex = remaining.lastIndexOf(".");
  return dotIndex !== -1 ? remaining.substring(0, dotIndex) : remaining;
};

/**
 * Deletes an image from Cloudinary by its URL.
 * Silently skips non-Cloudinary URLs (e.g. old localhost paths).
 * @param {string} url - Cloudinary image URL
 */
export const deleteImageFromCloudinary = async (url) => {
  try {
    const publicId = getPublicIdFromUrl(url);
    if (publicId) {
      const result = await cloudinary.uploader.destroy(publicId);
      console.log(`Cloudinary delete [${publicId}]:`, result.result);
      return result;
    }
  } catch (error) {
    console.error("Error deleting image from Cloudinary:", error);
  }
  return null;
};

export default cloudinary;
