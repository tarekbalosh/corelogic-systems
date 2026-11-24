import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import {
  CHAT_STRINGS,
  detectBubbleDirection,
} from "@/components/chat/chat-strings";
import { SafeMarkdown } from "@/components/chat/safe-markdown";

describe("chat widget helpers & safe markdown renderer (Step 9)", () => {
  it("renders bold text and bulleted/numbered lists while escaping raw HTML tags safely", () => {
    const markup = renderToStaticMarkup(
      React.createElement(SafeMarkdown, {
        text: "Welcome to **Core Logic**!\n- Custom ERP\n- Mobile Apps\n<script>alert('xss')</script>",
      })
    );

    expect(markup).toContain("<strong");
    expect(markup).toContain("Core Logic");
    expect(markup).toContain("<ul");
    expect(markup).toContain("<li");
    // Must escape <script> rather than injecting raw HTML
    expect(markup).not.toContain("<script>");
    expect(markup).toContain("&lt;script&gt;");
  });

  it("auto-detects RTL vs LTR per message bubble", () => {
    expect(detectBubbleDirection("مرحباً، أريد بناء موقع للشركة", "en")).toBe(
      "rtl"
    );
    expect(detectBubbleDirection("Hello, I need an ERP system", "ar")).toBe(
      "ltr"
    );
    // Numbers/punctuation only fall back to UI language
    expect(detectBubbleDirection("12345", "ar")).toBe("rtl");
    expect(detectBubbleDirection("12345", "en")).toBe("ltr");
  });

  it("includes matching English and Arabic quick replies and privacy policy links", () => {
    expect(CHAT_STRINGS.en.quickReplies).toHaveLength(4);
    expect(CHAT_STRINGS.ar.quickReplies).toHaveLength(4);
    expect(CHAT_STRINGS.en.privacyHref).toBe("/privacy");
    expect(CHAT_STRINGS.ar.privacyHref).toBe("/ar/privacy");
  });
});
