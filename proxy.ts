import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  defaultLocale,
  hasLocale,
  isUnprefixedLocalizedPath,
  LOCALE_COOKIE_NAME,
  localizedPath,
} from "@/lib/i18n-config";

const APEX_HOST = "corelogic-system.my";
const CANONICAL_HOST = "www.corelogic-system.my";

export function proxy(request: NextRequest) {
  // Strip an optional port and normalise case before comparing.
  const hostname = (request.headers.get("host") || "")
    .split(":")[0]
    .toLowerCase();

  const { pathname } = request.nextUrl;
  const cookieVal = request.cookies.get(LOCALE_COOKIE_NAME)?.value ?? "";
  const hasExplicitCookie = hasLocale(cookieVal);
  const targetLocale = hasExplicitCookie ? cookieVal : defaultLocale;
  const isUnprefixed = isUnprefixedLocalizedPath(pathname);

  // Permanent redirect of the apex domain to www. If the path is also an unprefixed
  // localized route, combine both redirects into a single hop (no redirect chain).
  if (hostname === APEX_HOST) {
    const url = request.nextUrl.clone();
    url.protocol = "https:";
    url.host = CANONICAL_HOST;
    url.port = "";
    if (isUnprefixed) {
      url.pathname = localizedPath(pathname, targetLocale);
      const status = hasExplicitCookie ? 307 : 301;
      const response = NextResponse.redirect(url, status);
      response.headers.set("Vary", "Cookie");
      return response;
    }
    return NextResponse.redirect(url, 301);
  }

  // Redirect unprefixed localized paths (e.g. "/", "/about", "/services/web-dev") to their
  // canonical locale-prefixed URL without 404s. Never auto-redirect based on Accept-Language;
  // honour only an explicit user cookie choice (307 + Vary: Cookie), otherwise permanently
  // redirect (301) crawlers and new visitors to the default locale ("en").
  if (isUnprefixed) {
    const url = request.nextUrl.clone();
    url.pathname = localizedPath(pathname, targetLocale);

    const status = hasExplicitCookie ? 307 : 301;
    const response = NextResponse.redirect(url, status);
    response.headers.set("Vary", "Cookie");
    return response;
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", pathname);
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  matcher: [
    "/((?!api|og/|_next/static|_next/image|favicon.ico|icon.png|opengraph-image|twitter-image|robots.txt|sitemap.xml|brand|projects|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico|css|js|map|txt|xml)$).*)",
  ],
};
