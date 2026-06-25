import dotenv from "dotenv";
dotenv.config();
import { v2 as cloudinary } from "cloudinary";

const API_KEY    = process.env.CLOUDINARY_API_KEY;
const API_SECRET = process.env.CLOUDINARY_API_SECRET;

const candidates = [
  "waqas-ali-portfolio",
  "waqasali-portfolio",
  "waqasalii-portfolio",
  "waqas-portfolio",
  "iwaqas-portfolio",
  "iwaqasali-portfolio",
  "iwaqasalii-portfolio",
  "iwaqasaliii-portfolio",
  "waqasalidev-portfolio",
  "waqas-ali-dev",
  "waqasali-dev",
  "waqasalii-dev",
  "waqasaliii-dev",
  "iwaqasali-dev",
  "iwaqasalii-dev",
  "iwaqasaliii-dev",
  "iwaqas-dev",
  "waqasdev",
  "waqasalidev",
  "waqasalii-portfolio-onrender",
  "waqasali-portfolio-onrender",
  "waqasali-portfolio-vercel",
  "waqasalii-portfolio-vercel"
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
