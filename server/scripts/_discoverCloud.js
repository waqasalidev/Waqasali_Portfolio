import dotenv from "dotenv";
dotenv.config();
import { v2 as cloudinary } from "cloudinary";

const API_KEY    = process.env.CLOUDINARY_API_KEY;
const API_SECRET = process.env.CLOUDINARY_API_SECRET;

const candidates = [
  "iwaqasalii",
  "waqasalii",
  "waqasaliii",
  "iwaqas",
  "waqas-ali",
  "waqasali123",
  "iwaqasali",
  "waqasalidev",
  "waqas-dev",
  "waqas-portfolio",
  "iwaqasaliii-db-user",
  "waqasalidev-portfolio",
  "portfolio-waqas",
  "sonu-sheikh",
  "sonu",
  "sheikh"
];

for (const name of candidates) {
  cloudinary.config({ cloud_name: name, api_key: API_KEY, api_secret: API_SECRET, secure: true });
  try {
    const r = await cloudinary.api.ping();
    console.log(`✅  MATCH: cloud_name="${name}" →`, r.status);
    break;
  } catch (e) {
    const msg = e?.error?.message || e?.message || String(e);
    console.log(`   ❌  "${name}" → ${msg}`);
  }
}
