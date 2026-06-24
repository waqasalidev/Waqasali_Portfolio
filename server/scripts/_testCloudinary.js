import dotenv from "dotenv";
dotenv.config();
import { v2 as cloudinary } from "cloudinary";

// Try lowercase "root"
cloudinary.config({
  cloud_name: "root",
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

try {
  const result = await cloudinary.api.ping();
  console.log("✅  SUCCESS with cloud_name=root:", JSON.stringify(result));
} catch (err) {
  console.log("❌  FAILED with cloud_name=root:", err.message || err.error?.message);
}
