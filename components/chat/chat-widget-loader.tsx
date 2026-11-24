"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

const LazyChatWidget = dynamic(
  () => import("@/components/chat/chat-widget"),
  { ssr: false }
);

interface ChatWidgetLoaderProps {
  initialEnabled: boolean;
  turnstileSiteKey: string | null;
  botProtectionEnabled: boolean;
}

export function ChatWidgetLoader({
  initialEnabled,
  turnstileSiteKey,
  botProtectionEnabled,
}: ChatWidgetLoaderProps) {
  const pathname = usePathname();
  const [runtimeEnabled, setRuntimeEnabled] = useState<boolean>(initialEnabled);

  const isExcludedRoute =
    pathname.startsWith("/admin") || pathname.startsWith("/portal");

  // Re-check runtime feature flag from dynamic /api/chat/config so widget can be
  // toggled off immediately (e.g. via /admin runtime pause or env flag) without rebuilding static HTML.
  useEffect(() => {
    if (isExcludedRoute) return;

    let active = true;
    fetch("/api/chat/config", { method: "GET", cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then(
        (
          data: {
            enabled?: boolean;
          } | null
        ) => {
          if (active && data && typeof data.enabled === "boolean") {
            setRuntimeEnabled(data.enabled);
          }
        }
      )
      .catch(() => {
        // Fall back to initialEnabled on network error
      });

    return () => {
      active = false;
    };
  }, [isExcludedRoute]);

  if (isExcludedRoute || !runtimeEnabled) {
    return null;
  }

  return (
    <LazyChatWidget
      turnstileSiteKey={turnstileSiteKey}
      botProtectionEnabled={botProtectionEnabled}
    />
  );
}
