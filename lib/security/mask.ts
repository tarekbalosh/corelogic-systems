/**
 * Masks a phone number so logs never expose full customer/owner numbers.
 * Example: "+60123456789" -> "+601****789"
 */
export function maskPhone(phone: string | null | undefined): string {
  if (!phone) return "[none]";
  const cleaned = phone.trim();
  if (cleaned.length <= 5) return "***";
  const prefix = cleaned.slice(0, 4);
  const suffix = cleaned.slice(-3);
  return `${prefix}****${suffix}`;
}

/**
 * Masks API keys, tokens, or session IDs for safe server-side structured logging.
 */
export function maskSecret(value: string | null | undefined): string {
  if (!value) return "[unset]";
  if (value.length <= 8) return "********";
  return `${value.slice(0, 4)}…${value.slice(-4)}`;
}

/**
 * Strips ASCII/Unicode control characters except standard newline (\n) and tab (\t).
 */
export function stripControlChars(input: string): string {
  // Remove C0/C1 control chars (excluding \t = \x09 and \n = \x0A) and null bytes
  return input
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F-\x9F]/g, "");
}

export function safeLogInfo(event: string, meta: Record<string, unknown> = {}): void {
  console.info(JSON.stringify({ level: "info", event, ts: new Date().toISOString(), ...meta }));
}

export function safeLogWarn(event: string, meta: Record<string, unknown> = {}): void {
  console.warn(JSON.stringify({ level: "warn", event, ts: new Date().toISOString(), ...meta }));
}

export function safeLogError(
  event: string,
  error: unknown,
  meta: Record<string, unknown> = {}
): void {
  const errSummary =
    error instanceof Error
      ? { name: error.name, message: maskSensitiveTokensInText(error.message) }
      : { message: maskSensitiveTokensInText(String(error)) };

  console.error(
    JSON.stringify({
      level: "error",
      event,
      ts: new Date().toISOString(),
      error: errSummary,
      ...meta,
    })
  );
}

function maskSensitiveTokensInText(text: string): string {
  return text
    .replace(/sk-ant-[A-Za-z0-9_-]+/g, "sk-ant-[REDACTED]")
    .replace(/EAA[A-Za-z0-9]+/g, "EAA[REDACTED]")
    .replace(/\+?\d{8,15}/g, (m) => maskPhone(m));
}
