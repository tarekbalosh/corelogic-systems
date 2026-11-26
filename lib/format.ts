import { localeMetadata, type Locale } from "@/lib/i18n-config";

/**
 * Formats a date using `Intl.DateTimeFormat` for the given locale.
 * Example (de): 26.11.2026
 */
export function formatLocaleDate(
  date: Date | string | number,
  locale: Locale,
  options?: Intl.DateTimeFormatOptions
): string {
  const d = date instanceof Date ? date : new Date(date);
  const bcp47 = localeMetadata[locale].bcp47;
  return new Intl.DateTimeFormat(bcp47, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    ...options,
  }).format(d);
}

/**
 * Formats a number using `Intl.NumberFormat` for the given locale.
 * Example (de): 1.234,56
 */
export function formatLocaleNumber(
  value: number,
  locale: Locale,
  options?: Intl.NumberFormatOptions
): string {
  const bcp47 = localeMetadata[locale].bcp47;
  return new Intl.NumberFormat(bcp47, options).format(value);
}

/**
 * Formats a currency amount using `Intl.NumberFormat`.
 * For B2B prices in German (`locale === "de"`), appends "zzgl. MwSt." when `b2bVatNote` is true.
 * Example (de, EUR, b2bVatNote: true): "1.234,56 € zzgl. MwSt."
 */
export function formatLocaleCurrency(
  amount: number,
  currency: string,
  locale: Locale,
  options?: {
    b2bVatNote?: boolean;
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
  }
): string {
  const bcp47 = localeMetadata[locale].bcp47;
  const formatted = new Intl.NumberFormat(bcp47, {
    style: "currency",
    currency,
    ...(options?.minimumFractionDigits !== undefined
      ? { minimumFractionDigits: options.minimumFractionDigits }
      : {}),
    ...(options?.maximumFractionDigits !== undefined
      ? { maximumFractionDigits: options.maximumFractionDigits }
      : {}),
  })
    .format(amount)
    .replace(/\u00A0/g, " ");

  if (options?.b2bVatNote) {
    if (locale === "de") return `${formatted} zzgl. MwSt.`;
    if (locale === "ar") return `${formatted} غير شامل ضريبة القيمة المضافة`;
    return `${formatted} excl. VAT`;
  }

  return formatted;
}
