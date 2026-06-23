import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Extracts Cloudinary public_id from a URL
 * @param {string} url - Cloudinary image URL
 * @returns {string|null} - Public ID or null
 */
export const getPublicIdFromUrl = (url) => {
  if (!url || !url.includes("cloudinary.com")) return null;
  
  // Cloudinary URL format: https://res.cloudinary.com/cloud_name/image/upload/v[0-9]+/folder/public_id.ext
  const parts = url.split("/upload/");
  if (parts.length < 2) return null;
  
  const pathAfterUpload = parts[1];
  const segments = pathAfterUpload.split("/");
  if (segments[0].match(/^v\d+$/)) {
    segments.shift(); // Remove the version segment (e.g. v1234567)
  }
  
  const remaining = segments.join("/");
  const dotIndex = remaining.lastIndexOf(".");
  if (dotIndex !== -1) {
    return remaining.substring(0, dotIndex);
  }
  return remaining;
};

/**
 * Deletes an image from Cloudinary by its URL
 * @param {string} url - Cloudinary image URL
 * @returns {Promise<any>}
 */
export const deleteImageFromCloudinary = async (url) => {
  try {
    const publicId = getPublicIdFromUrl(url);
    if (publicId) {
      const result = await cloudinary.uploader.destroy(publicId);
      console.log(`Cloudinary deletion result for ${publicId}:`, result);
      return result;
    }
  } catch (error) {
    console.error("Error deleting image from Cloudinary:", error);
  }
  return null;
};

export default cloudinary;
