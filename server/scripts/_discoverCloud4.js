import dotenv from "dotenv";
dotenv.config();
import { v2 as cloudinary } from "cloudinary";

const API_KEY    = process.env.CLOUDINARY_API_KEY;
const API_SECRET = process.env.CLOUDINARY_API_SECRET;

const baseCandidates = [
  "iwaqasaliii",
  "waqasalidev",
  "waqasalii",
  "waqasali",
  "waqas",
  "sonu"
];

// Generate case variations
const candidates = [];
for (const base of baseCandidates) {
  candidates.push(base.toLowerCase());
  // Title Case
  candidates.push(base.charAt(0).toUpperCase() + base.slice(1));
  // CamelCase variations
  if (base.includes("ali")) {
    const parts = base.split("ali");
    candidates.push(parts[0] + "Ali" + (parts[1] || ""));
    candidates.push(parts[0].charAt(0).toUpperCase() + parts[0].slice(1) + "Ali" + (parts[1] || ""));
  }
}

// Add extra specific variations
candidates.push("iWaqasAliii");
candidates.push("WaqasAliDev");
candidates.push("WaqasAli");
candidates.push("iWaqasAli");
candidates.push("WaqasAlidev");

// Deduplicate
const uniqueCandidates = [...new Set(candidates)];
console.log("Testing candidates:", uniqueCandidates);

const run = async () => {
  for (const name of uniqueCandidates) {
    cloudinary.config({ cloud_name: name, api_key: API_KEY, api_secret: API_SECRET, secure: true });
    try {
      const r = await cloudinary.api.ping();
      console.log(`✅  MATCH: cloud_name="${name}" →`, r.status);
      process.exit(0);
    } catch (e) {
      const msg = e?.error?.message || e?.message || String(e);
      // Only log if it's not a generic cloud_name mismatch
      console.log(`   ❌  "${name}" → ${msg}`);
    }
  }
  console.log("No candidates matched.");
  process.exit(1);
};

run();
