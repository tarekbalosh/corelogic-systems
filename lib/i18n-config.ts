export const locales = ["en", "de", "ar"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export const LOCALE_COOKIE_NAME = "NEXT_LOCALE";

export const localeMetadata: Record<
  Locale,
  {
    code: Locale;
    shortLabel: string;
    nativeLabel: string;
    bcp47: string;
    ogLocale: string;
    dir: "ltr" | "rtl";
  }
> = {
  en: {
    code: "en",
    shortLabel: "EN",
    nativeLabel: "English",
    bcp47: "en-US",
    ogLocale: "en_US",
    dir: "ltr",
  },
  de: {
    code: "de",
    shortLabel: "DE",
    nativeLabel: "Deutsch",
    bcp47: "de-DE",
    ogLocale: "de_DE",
    dir: "ltr",
  },
  ar: {
    code: "ar",
    shortLabel: "AR",
    nativeLabel: "العربية",
    bcp47: "ar",
    ogLocale: "ar_AR",
    dir: "rtl",
  },
};

export function hasLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export function getDirection(locale: Locale): "ltr" | "rtl" {
  return locale === "ar" ? "rtl" : "ltr";
}

export function getLocaleFromPathname(pathname: string): Locale {
  const firstSegment = pathname.split("/")[1] ?? "";
  return hasLocale(firstSegment) ? firstSegment : defaultLocale;
}

/**
 * Strips any leading `/en`, `/de`, or `/ar` prefix and normalizes to a leading-slash path.
 * Examples: "/de/about" -> "/about", "/en" -> "/", "/" -> "/"
 */
export function stripLocalePrefix(pathname: string): string {
  const match = pathname.match(/^\/(en|de|ar)(?=\/|$)(.*)$/);
  if (!match) {
    return pathname.startsWith("/") ? pathname : `/${pathname}`;
  }
  const rest = match[2] || "/";
  return rest.startsWith("/") ? rest : `/${rest}`;
}

/**
 * Maps a locale-agnostic route ("/", "/about", "/services/web-dev") to its canonical
 * prefixed route ("/en", "/de/about", "/ar/services/web-dev").
 */
export function localizedPath(path: string, locale: Locale): string {
  const stripped = stripLocalePrefix(path || "/");
  if (stripped === "/" || stripped === "") {
    return `/${locale}`;
  }
  return `/${locale}${stripped}`;
}

/**
 * Unprefixed public routes that have localized equivalents under /[locale]/...
 * Used by proxy.ts so existing unprefixed URLs redirect cleanly without 404s,
 * while non-localized routes (/admin, /blog, /portal, /api, etc.) remain untouched.
 */
const LOCALIZED_EXACT_ROUTES = new Set([
  "/",
  "/about",
  "/contact",
  "/services",
  "/our-projects",
  "/privacy",
  "/terms",
  "/impressum",
  "/datenschutz",
]);

const LOCALIZED_PREFIX_ROUTES = ["/services/", "/our-projects/"];

export function isUnprefixedLocalizedPath(pathname: string): boolean {
  const normalized =
    pathname.length > 1 && pathname.endsWith("/")
      ? pathname.slice(0, -1)
      : pathname;
  if (LOCALIZED_EXACT_ROUTES.has(normalized)) {
    return true;
  }
  return LOCALIZED_PREFIX_ROUTES.some((prefix) =>
    normalized.startsWith(prefix)
  );
}
