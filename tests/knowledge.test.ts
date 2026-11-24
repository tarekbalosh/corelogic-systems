import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import {
  getKnowledgeBase,
  resetKnowledgeCacheForTesting,
} from "@/lib/agent/knowledge";

describe("knowledge loader (Step 2)", () => {
  afterEach(() => {
    resetKnowledgeCacheForTesting();
  });

  it("loads and caches knowledge/core-logic-knowledge.md with non-empty content", () => {
    const content = getKnowledgeBase();
    expect(content.length).toBeGreaterThan(200);
    expect(content).toContain("CoreLogic Systems");
    expect(content).toContain("Asia/Kuala_Lumpur");

    const secondRead = getKnowledgeBase();
    expect(secondRead).toBe(content);
  });

  it("fails fast if the knowledge file path is missing", () => {
    const missingPath = path.join(
      os.tmpdir(),
      `nonexistent-knowledge-${Date.now()}.md`
    );
    expect(() => getKnowledgeBase(missingPath)).toThrow(/missing/i);
  });

  it("fails fast if the knowledge file is empty or whitespace-only", () => {
    const emptyPath = path.join(
      os.tmpdir(),
      `empty-knowledge-${Date.now()}.md`
    );
    fs.writeFileSync(emptyPath, "   \n\t  ", "utf-8");
    try {
      expect(() => getKnowledgeBase(emptyPath)).toThrow(/empty/i);
    } finally {
      fs.unlinkSync(emptyPath);
    }
  });
});
