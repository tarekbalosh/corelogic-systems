import { describe, expect, it } from "vitest";
import {
  buildSystemPrompt,
  estimatePromptTokens,
} from "@/lib/agent/system-prompt";

describe("system prompt builder (Step 5)", () => {
  it("composes all required XML sections, injects MYT time, and stays concise", () => {
    const fixedNow = new Date("2026-11-24T08:00:00.000Z"); // 16:00 MYT
    const prompt = buildSystemPrompt({
      now: fixedNow,
      timeZone: "Asia/Kuala_Lumpur",
    });

    for (const tag of [
      "<role>",
      "</role>",
      "<language>",
      "</language>",
      "<knowledge>",
      "</knowledge>",
      "<behavior>",
      "</behavior>",
      "<lead_collection>",
      "</lead_collection>",
      "<booking_flow>",
      "</booking_flow>",
      "<tools_usage>",
      "</tools_usage>",
      "<safety>",
      "</safety>",
    ]) {
      expect(prompt).toContain(tag);
    }

    // Verify 2026-11-24 16:00 +08:00 injected
    expect(prompt).toContain("2026-11-24 16:00 +08:00");
    expect(prompt).toContain("indicative estimate");
    expect(prompt).toContain("pending confirmation");

    const approxTokens = estimatePromptTokens(prompt);
    // Log approximate token length for verification output
    console.info(
      `[system-prompt] Composed length: ${prompt.length} chars (~${approxTokens} tokens)`
    );
    expect(approxTokens).toBeGreaterThan(1000);
    expect(approxTokens).toBeLessThan(8000);
  });
});
