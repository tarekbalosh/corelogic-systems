import { safeLogWarn } from "@/lib/security/mask";

export interface VerifyTurnstileParams {
  token: string | undefined;
  remoteIp?: string;
  secretKey?: string;
  enabled?: boolean;
  fetchFn?: typeof fetch;
}

/**
 * Verifies an optional Cloudflare Turnstile token when `BOT_PROTECTION_ENABLED === "true"`.
 * Disabled by default so local dev and unconfigured Preview environments work out of the box.
 */
export async function verifyBotProtection(
  params: VerifyTurnstileParams
): Promise<{ ok: true } | { ok: false; reason: string }> {
  const enabled =
    params.enabled ?? process.env.BOT_PROTECTION_ENABLED === "true";

  if (!enabled) {
    return { ok: true };
  }

  const secret = (
    params.secretKey ??
    process.env.TURNSTILE_SECRET_KEY ??
    ""
  ).trim();
  if (!secret) {
    safeLogWarn("security.turnstile.missing_secret", {});
    return { ok: false, reason: "BOT_CHECK_MISCONFIGURED" };
  }

  const token = params.token?.trim();
  if (!token) {
    return { ok: false, reason: "BOT_TOKEN_REQUIRED" };
  }

  const fetchImpl = params.fetchFn ?? fetch;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 6_000);

  try {
    const form = new URLSearchParams();
    form.set("secret", secret);
    form.set("response", token);
    if (params.remoteIp) {
      form.set("remoteip", params.remoteIp);
    }

    const res = await fetchImpl(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: form.toString(),
        signal: controller.signal,
      }
    );

    if (!res.ok) {
      return { ok: false, reason: "BOT_VERIFY_HTTP_ERROR" };
    }

    const json = (await res.json()) as { success?: boolean };
    if (json.success === true) {
      return { ok: true };
    }
    return { ok: false, reason: "BOT_VERIFY_FAILED" };
  } catch {
    return { ok: false, reason: "BOT_VERIFY_UNREACHABLE" };
  } finally {
    clearTimeout(timer);
  }
}
