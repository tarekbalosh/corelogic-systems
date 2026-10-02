import "server-only";

import enDict from "./dictionaries/en.json";
import arDict from "./dictionaries/ar.json";

const dictionaries = {
  en: () => Promise.resolve(enDict),
  ar: () => Promise.resolve(arDict),
} as const;

export type Locale = keyof typeof dictionaries;
export type Dictionary = typeof enDict;

export const locales: Locale[] = ["en", "ar"];
export const defaultLocale: Locale = "en";

export const hasLocale = (locale: string): locale is Locale =>
  locale in dictionaries;

export const getDictionary = async (locale: Locale): Promise<Dictionary> =>
  dictionaries[locale]();

/**
 * Returns the direction for a given locale.
 */
export const getDirection = (locale: Locale): "ltr" | "rtl" =>
  locale === "ar" ? "rtl" : "ltr";

/**
 * Returns the language alternate path prefix.
 */
export const getLocalePath = (locale: Locale, path: string = ""): string =>
  locale === "en" ? path || "/" : `/ar${path}`;

/**
 * Returns the opposite locale for language switching.
 */
export const getAlternateLocale = (locale: Locale): Locale =>
  locale === "en" ? "ar" : "en";
