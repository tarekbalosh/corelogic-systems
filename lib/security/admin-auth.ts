import crypto from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const ADMIN_SESSION_COOKIE = "corelogic_admin_session";
export const ADMIN_SESSION_TTL_MS = 12 * 60 * 60 * 1000; // 12 hours

function getAdminSecret(): string | null {
  const token = process.env.ADMIN_TOKEN?.trim();
  const minLength = process.env.NODE_ENV === "production" ? 12 : 4;
  return token && token.length >= minLength ? token : null;
}

/**
 * Compares a user-supplied admin token against `ADMIN_TOKEN` in constant time
 * without leaking token length (via fixed-length SHA-256 digests).
 */
export function verifyAdminTokenConstantTime(
  candidate: string | undefined | null,
  expectedSecret: string | null = getAdminSecret()
): boolean {
  if (!expectedSecret || !candidate) {
    return false;
  }
  const digestCandidate = crypto
    .createHash("sha256")
    .update(candidate.trim(), "utf-8")
    .digest();
  const digestExpected = crypto
    .createHash("sha256")
    .update(expectedSecret, "utf-8")
    .digest();

  return crypto.timingSafeEqual(digestCandidate, digestExpected);
}

/**
 * Creates an HMAC-SHA256 signed session cookie value valid for `ADMIN_SESSION_TTL_MS`.
 */
export function createSignedAdminSessionValue(
  secret: string | null = getAdminSecret(),
  nowMs: number = Date.now()
): string {
  if (!secret) {
    throw new Error("ADMIN_TOKEN is not configured (minimum 12 characters).");
  }
  const exp = nowMs + ADMIN_SESSION_TTL_MS;
  const nonce = crypto.randomBytes(16).toString("hex");
  const payload = Buffer.from(
    JSON.stringify({ exp, nonce, v: 1 }),
    "utf-8"
  ).toString("base64url");

  const sig = crypto
    .createHmac("sha256", secret)
    .update(`admin-session:${payload}`, "utf-8")
    .digest("hex");

  return `${payload}.${sig}`;
}

/**
 * Verifies an HMAC-SHA256 signed admin session cookie value and checks expiration.
 */
export function verifySignedAdminSessionValue(
  cookieValue: string | undefined | null,
  secret: string | null = getAdminSecret(),
  nowMs: number = Date.now()
): boolean {
  if (!secret || !cookieValue) {
    return false;
  }

  const dotIdx = cookieValue.indexOf(".");
  if (dotIdx <= 0) {
    return false;
  }

  const payload = cookieValue.slice(0, dotIdx);
  const providedSig = cookieValue.slice(dotIdx + 1).toLowerCase();
  if (!/^[0-9a-f]{64}$/.test(providedSig)) {
    return false;
  }

  const expectedSig = crypto
    .createHmac("sha256", secret)
    .update(`admin-session:${payload}`, "utf-8")
    .digest("hex")
    .toLowerCase();

  const sigValid = crypto.timingSafeEqual(
    Buffer.from(providedSig, "utf-8"),
    Buffer.from(expectedSig, "utf-8")
  );
  if (!sigValid) {
    return false;
  }

  try {
    const decoded = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf-8")
    ) as { exp?: number };
    if (typeof decoded.exp !== "number" || decoded.exp <= nowMs) {
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const rawCookie = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  return verifySignedAdminSessionValue(rawCookie);
}

/**
 * Server Component / Server Action guard that redirects unauthenticated requests to `/admin/login`.
 */
export async function requireAdminSession(): Promise<void> {
  const authed = await isAdminAuthenticated();
  if (!authed) {
    redirect("/admin/login");
  }
}

export async function setAdminSessionCookie(): Promise<void> {
  const signedValue = createSignedAdminSessionValue();
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, signedValue, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/admin",
    maxAge: Math.floor(ADMIN_SESSION_TTL_MS / 1000),
  });
}

export async function clearAdminSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/admin",
    maxAge: 0,
  });
}
