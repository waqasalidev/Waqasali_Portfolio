import dotenv from "dotenv";
dotenv.config();
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const test = async () => {
  try {
    const result = await cloudinary.api.ping();
    console.log("PING SUCCESS:", result);
  } catch (error) {
    console.error("PING FAILURE:");
    console.error(error);
  }
};

test();
