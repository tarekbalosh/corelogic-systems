"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  hasLocale,
  LOCALE_COOKIE_NAME,
  localeMetadata,
  locales,
  localizedPath,
  stripLocalePrefix,
  type Locale,
} from "@/lib/i18n-config";

interface LanguageSwitcherProps {
  currentLocale: Locale;
  className?: string;
}

const NON_LOCALIZED_PREFIXES = [
  "/blog",
  "/careers",
  "/news",
  "/technology",
  "/portal",
  "/admin",
];

function persistLocaleCookie(locale: Locale) {
  if (typeof document === "undefined") return;
  const maxAge = 60 * 60 * 24 * 365; // 1 year
  document.cookie = `${LOCALE_COOKIE_NAME}=${locale}; Path=/; Max-Age=${maxAge}; SameSite=Lax`;
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  currentLocale,
  className,
}) => {
  const pathname = usePathname() || `/${currentLocale}`;

  const buildTargetHref = (targetLocale: Locale): string => {
    const firstSeg = pathname.split("/")[1] ?? "";
    const isPrefixed = hasLocale(firstSeg);
    const isNonLocalized =
      !isPrefixed &&
      NON_LOCALIZED_PREFIXES.some(
        (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
      );

    return isNonLocalized
      ? localizedPath("/", targetLocale)
      : localizedPath(stripLocalePrefix(pathname), targetLocale);
  };

  return (
    <div
      role="group"
      aria-label={
        currentLocale === "de"
          ? "Sprache wählen"
          : currentLocale === "ar"
            ? "اختر اللغة"
            : "Select language"
      }
      className={cn(
        "inline-flex items-center gap-1 rounded-full bg-foreground/5 border border-foreground/10 p-1 shadow-sm",
        className
      )}
    >
      <Globe
        size={14}
        aria-hidden="true"
        className="mx-1.5 shrink-0 text-foreground/45"
      />
      {locales.map((loc) => {
        const meta = localeMetadata[loc];
        const isActive = loc === currentLocale;
        return (
          <Link
            key={loc}
            href={buildTargetHref(loc)}
            hrefLang={loc}
            lang={loc}
            aria-current={isActive ? "true" : undefined}
            title={meta.nativeLabel}
            onClick={() => persistLocaleCookie(loc)}
            className={cn(
              "px-2.5 py-1 rounded-full text-xs font-bold tracking-wide transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
              isActive
                ? "bg-primary text-white shadow-sm"
                : "text-foreground/70 hover:text-primary hover:bg-primary/10"
            )}
          >
            {meta.shortLabel}
          </Link>
        );
      })}
    </div>
  );
};
