import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const knowledgePath = path.join(process.cwd(), "knowledge", "core-logic-knowledge.md");

assert.ok(
  fs.existsSync(knowledgePath),
  `Missing knowledge base file: ${knowledgePath}`
);

const content = fs.readFileSync(knowledgePath, "utf-8");
assert.ok(
  content.trim().length > 100,
  `Knowledge base file at ${knowledgePath} is empty or unexpectedly short`
);

console.log(
  `[verify-knowledge] OK — loaded ${content.length} chars from knowledge/core-logic-knowledge.md`
);
