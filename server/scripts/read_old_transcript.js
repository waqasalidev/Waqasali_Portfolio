import fs from "fs";

const logPath = "C:/Users/Sonu Sheikh/.gemini/antigravity-ide/brain/8863a087-1e1b-4620-a4b4-dd68e3ace900/.system_generated/logs/transcript.jsonl";

if (!fs.existsSync(logPath)) {
  console.log("No old transcript found at", logPath);
  process.exit(0);
}

const data = fs.readFileSync(logPath, "utf-8");
const lines = data.split("\n").filter(Boolean);

console.log("Total old transcript lines:", lines.length);

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (line.includes("cloud") || line.includes("cloudinary") || line.includes("env") || line.includes("mismatch")) {
    const parsed = JSON.parse(line);
    console.log(`\n--- Line ${i} (step_index: ${parsed.step_index}) ---`);
    console.log("Source:", parsed.source);
    console.log("Type:", parsed.type);
    console.log("Content:", parsed.content ? parsed.content.substring(0, 500) : "no content");
  }
}
