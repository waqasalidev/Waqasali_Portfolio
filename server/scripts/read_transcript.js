import fs from "fs";

const logPath = "C:/Users/Sonu Sheikh/.gemini/antigravity-ide/brain/8e013fc4-64d0-4109-a603-0c4a96bb0f05/.system_generated/logs/transcript.jsonl";

const data = fs.readFileSync(logPath, "utf-8");
const lines = data.split("\n").filter(Boolean);

console.log("Total lines:", lines.length);
const start = Math.max(0, lines.length - 15);
for (let i = start; i < lines.length; i++) {
  const line = lines[i];
  const parsed = JSON.parse(line);
  console.log(`\n--- Line ${i} (step_index: ${parsed.step_index}) ---`);
  console.log("Source:", parsed.source);
  console.log("Type:", parsed.type);
  console.log("Content:", parsed.content ? parsed.content.substring(0, 500) : "no content");
}
