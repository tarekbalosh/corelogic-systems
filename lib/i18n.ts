import "server-only";

import enDict from "./dictionaries/en.json";
import deDict from "./dictionaries/de.json";
import arDict from "./dictionaries/ar.json";
import {
  defaultLocale,
  getDirection,
  hasLocale,
  locales,
  localizedPath,
  type Locale,
} from "./i18n-config";

const dictionaries = {
  en: () => Promise.resolve(enDict),
  de: () => Promise.resolve(deDict),
  ar: () => Promise.resolve(arDict),
} as const;

export type Dictionary = typeof enDict;
export type { Locale };
export { defaultLocale, getDirection, hasLocale, locales };

export const getDictionary = async (locale: Locale): Promise<Dictionary> =>
  dictionaries[locale]();

export const getLocalePath = (locale: Locale, path: string = "/"): string =>
  localizedPath(path, locale);
