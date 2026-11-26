import { NextResponse, type NextRequest } from "next/server";
import { isAdminAuthenticated } from "@/lib/security/admin-auth";
import { API_SECURITY_HEADERS, isSameOriginRequest } from "@/lib/security/http";

export const ADMIN_API_HEADERS: Record<string, string> = {
  ...API_SECURITY_HEADERS,
  "Cache-Control": "no-store, no-cache, must-revalidate",
  "X-Robots-Tag": "noindex, nofollow, noarchive",
};

/**
 * Verifies CSRF protection for state-changing Admin API requests (POST, PUT, PATCH, DELETE).
 *
 * Rules:
 * 1. Cross-origin `Origin` or `Referer` is always rejected (HTTP 403).
 * 2. Cross-site `Sec-Fetch-Site` (e.g. "cross-site") is rejected (HTTP 403).
 * 3. Browser requests must provide either a matching same-origin `Origin`/`Referer`
 *    or explicit non-simple header proof (`X-Requested-With: fetch` / `XMLHttpRequest`)
 *    plus same-origin context, preventing CSRF via plain HTML forms.
 */
export function hasValidAdminCsrf(request: NextRequest): boolean {
  const secFetchSite = request.headers.get("sec-fetch-site")?.toLowerCase();
  if (
    secFetchSite &&
    secFetchSite !== "same-origin" &&
    secFetchSite !== "same-site" &&
    secFetchSite !== "none"
  ) {
    return false;
  }

  const originHeader = request.headers.get("origin");
  const refererHeader = request.headers.get("referer");
  const requestedWith = request.headers.get("x-requested-with")?.toLowerCase();

  // If Origin or Referer is present, it MUST match same-origin.
  if (originHeader || refererHeader) {
    return isSameOriginRequest(request);
  }

  // If neither Origin nor Referer is present, require an explicit custom header
  // (simple cross-site form POSTs cannot set custom headers without CORS preflight).
  return requestedWith === "fetch" || requestedWith === "xmlhttprequest";
}

export interface AdminApiGuardResult {
  ok: true;
  actor: string;
}

export type AdminApiGuardResponse = AdminApiGuardResult | NextResponse;

/**
 * Guards an `/admin/api/**` route handler:
 * - Returns HTTP 401 JSON if no valid `corelogic_admin_session` cookie is present.
 * - For mutating methods (POST/PUT/PATCH/DELETE), enforces CSRF checks and returns HTTP 403 JSON on failure.
 */
export async function requireAdminApiRequest(
  request: NextRequest,
  options: { mutate?: boolean } = {}
): Promise<AdminApiGuardResponse> {
  const authed = await isAdminAuthenticated();
  if (!authed) {
    return NextResponse.json(
      { error: "Unauthorized: Admin session required." },
      { status: 401, headers: ADMIN_API_HEADERS }
    );
  }

  const method = request.method.toUpperCase();
  const isMutation =
    options.mutate ??
    (method === "POST" ||
      method === "PUT" ||
      method === "PATCH" ||
      method === "DELETE");

  if (isMutation && !hasValidAdminCsrf(request)) {
    return NextResponse.json(
      { error: "Forbidden: CSRF / same-origin verification failed." },
      { status: 403, headers: ADMIN_API_HEADERS }
    );
  }

  return { ok: true, actor: "admin" };
}

export function adminJsonResponse(
  body: unknown,
  status: number = 200
): NextResponse {
  return NextResponse.json(body, {
    status,
    headers: ADMIN_API_HEADERS,
  });
}
