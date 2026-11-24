import React from "react";
import { ChatWidgetLoader } from "@/components/chat/chat-widget-loader";

/**
 * Minimal Server Component gate mounted in `app/layout.tsx`.
 * Evaluates `CHAT_WIDGET_ENABLED === "true"` without opting static pages out of prerendering,
 * while `ChatWidgetLoader` also checks `/api/chat/config` on client mount for live kill-switch support.
 */
export function ChatWidgetMount() {
  const enabled = process.env.CHAT_WIDGET_ENABLED === "true";
  const botProtectionEnabled = process.env.BOT_PROTECTION_ENABLED === "true";
  const turnstileSiteKey =
    process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim() || null;

  return (
    <ChatWidgetLoader
      initialEnabled={enabled}
      turnstileSiteKey={turnstileSiteKey}
      botProtectionEnabled={botProtectionEnabled}
    />
  );
}
