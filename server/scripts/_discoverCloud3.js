import dotenv from "dotenv";
dotenv.config();
import { v2 as cloudinary } from "cloudinary";

const API_KEY    = process.env.CLOUDINARY_API_KEY;
const API_SECRET = process.env.CLOUDINARY_API_SECRET;

const candidates = [
  "mern-portfolio",
  "mern_portfolio",
  "mernportfolio",
  "waqasali_portfolio",
  "waqasalii_portfolio",
  "waqasaliii_portfolio",
  "waqasalidev_portfolio",
  "iwaqasali_portfolio",
  "iwaqasalii_portfolio",
  "iwaqasaliii_portfolio",
  "iwaqasali-portfolio",
  "iwaqasalii-portfolio",
  "iwaqasaliii-portfolio"
];

const run = async () => {
  for (const name of candidates) {
    cloudinary.config({ cloud_name: name, api_key: API_KEY, api_secret: API_SECRET, secure: true });
    try {
      const r = await cloudinary.api.ping();
      console.log(`✅  MATCH: cloud_name="${name}" →`, r.status);
      process.exit(0);
    } catch (e) {
      const msg = e?.error?.message || e?.message || String(e);
      console.log(`   ❌  "${name}" → ${msg}`);
    }
  }
  console.log("No candidates matched.");
  process.exit(1);
};

run();
