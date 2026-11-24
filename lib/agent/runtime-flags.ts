import prisma from "@/lib/db";

export const WIDGET_PAUSED_SETTING_KEY = "chat_widget_paused";

/**
 * Evaluates whether the chat widget is enabled at runtime:
 * 1. `CHAT_WIDGET_ENABLED` env var MUST be `"true"` (defaults to `"false"`).
 * 2. Even when `CHAT_WIDGET_ENABLED === "true"`, the owner can pause the widget
 *    instantly from `/admin` (`chat_widget_paused = "true"` in `agent_runtime_settings`)
 *    without redeploying code.
 */
export async function isWidgetRuntimeEnabled(): Promise<boolean> {
  if (process.env.CHAT_WIDGET_ENABLED !== "true") {
    return false;
  }

  if (!process.env.DATABASE_URL?.trim()) {
    return true;
  }

  try {
    const row = await prisma.agentRuntimeSetting.findUnique({
      where: { key: WIDGET_PAUSED_SETTING_KEY },
      select: { value: true },
    });
    if (row?.value === "true") {
      return false;
    }
  } catch {
    // If settings table is not yet migrated, respect CHAT_WIDGET_ENABLED
  }

  return true;
}

export async function getWidgetRuntimePauseState(): Promise<{
  envEnabled: boolean;
  dbPaused: boolean;
  effectiveEnabled: boolean;
}> {
  const envEnabled = process.env.CHAT_WIDGET_ENABLED === "true";
  let dbPaused = false;

  if (process.env.DATABASE_URL?.trim()) {
    try {
      const row = await prisma.agentRuntimeSetting.findUnique({
        where: { key: WIDGET_PAUSED_SETTING_KEY },
        select: { value: true },
      });
      dbPaused = row?.value === "true";
    } catch {
      dbPaused = false;
    }
  }

  return {
    envEnabled,
    dbPaused,
    effectiveEnabled: envEnabled && !dbPaused,
  };
}

export async function setWidgetRuntimePaused(paused: boolean): Promise<void> {
  await prisma.agentRuntimeSetting.upsert({
    where: { key: WIDGET_PAUSED_SETTING_KEY },
    update: { value: paused ? "true" : "false" },
    create: { key: WIDGET_PAUSED_SETTING_KEY, value: paused ? "true" : "false" },
  });
}
