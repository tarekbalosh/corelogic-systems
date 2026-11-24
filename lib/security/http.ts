import type { NextRequest } from "next/server";
import { siteConfig } from "@/config/site";

export const API_SECURITY_HEADERS: Record<string, string> = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "strict-origin-when-cross-origin",
};

function extractHostname(urlOrHost: string | null): string | null {
  if (!urlOrHost) return null;
  const trimmed = urlOrHost.trim().toLowerCase();
  if (!trimmed) return null;

  try {
    if (trimmed.includes("://")) {
      return new URL(trimmed).hostname.toLowerCase();
    }
    return trimmed.split(",")[0].trim().split(":")[0].toLowerCase();
  } catch {
    return null;
  }
}

/**
 * Verifies same-origin browser requests for internal API endpoints (`/api/chat`, `/api/booking/*`).
 * Rejects cross-origin `Origin` headers with `false` (HTTP 403).
 */
export function isSameOriginRequest(request: NextRequest): boolean {
  const originHeader = request.headers.get("origin");
  const refererHeader = request.headers.get("referer");

  // Allow non-browser local CLI / smoke-test requests that carry neither Origin nor Referer
  if (!originHeader && !refererHeader) {
    return true;
  }

  const requestHost =
    extractHostname(request.headers.get("x-forwarded-host")) ??
    extractHostname(request.headers.get("host")) ??
    extractHostname(request.nextUrl.host);

  const canonicalHost = extractHostname(siteConfig.url);
  const allowedHosts = new Set<string>();
  if (requestHost) allowedHosts.add(requestHost);
  if (canonicalHost) {
    allowedHosts.add(canonicalHost);
    allowedHosts.add(canonicalHost.replace(/^www\./, ""));
  }

  if (originHeader) {
    const originHost = extractHostname(originHeader);
    return Boolean(originHost && allowedHosts.has(originHost));
  }

  if (refererHeader) {
    const refererHost = extractHostname(refererHeader);
    return Boolean(refererHost && allowedHosts.has(refererHost));
  }

  return true;
}

export function extractClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    const first = forwardedFor.split(",")[0]?.trim();
    if (first) return first;
  }
  const realIp = request.headers.get("x-real-ip")?.trim();
  if (realIp) return realIp;
  return "127.0.0.1";
}
