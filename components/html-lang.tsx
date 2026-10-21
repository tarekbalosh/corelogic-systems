"use client";

import { useEffect } from "react";

/**
 * The root layout is shared by both languages, so the server-rendered <html> always says lang="en".
 * Arabic routes mount this component to set <html lang="ar"> (restored when the visitor navigates
 * back to an English page). Only `lang` is changed: text direction is already handled by the
 * dir="rtl" wrapper in app/ar/layout.tsx, so the existing layout is left untouched.
 */
export function HtmlLang({ lang }: { lang: string }) {
  useEffect(() => {
    const root = document.documentElement;
    const prev = root.lang;
    root.lang = lang;
    return () => {
      root.lang = prev || "en";
    };
  }, [lang]);
  return null;
}
