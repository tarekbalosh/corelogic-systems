/**
 * Evaluates whether the chat widget is enabled at runtime.
 * Default is strictly `false` unless `CHAT_WIDGET_ENABLED === "true"`.
 * Step 10/11/13 extends this with an admin DB kill-switch override so the owner
 * can pause the widget live without redeploying code.
 */
export async function isWidgetRuntimeEnabled(): Promise<boolean> {
  return process.env.CHAT_WIDGET_ENABLED === "true";
}
