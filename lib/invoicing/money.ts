import type { TaxTreatment } from "@prisma/client";
import { resolveVatCategoryCode, TAX_TREATMENT_META } from "./constants";

const ZERO = BigInt(0);
const ONE = BigInt(1);
const NEG_ONE = BigInt(-1);
const TWO = BigInt(2);
const SCALE_4 = BigInt(10000);

/**
 * Half-up rounding for positive or negative exact rational numbers (numerator / denominator).
 * Examples:
 *  -  2.5 ->  3
 *  -  2.4 ->  2
 *  - -2.5 -> -3 (symmetric half away from zero, standard for German commercial credit notes / Storno)
 */
export function roundHalfUpBigInt(numerator: bigint, denominator: bigint): number {
  if (denominator <= ZERO) {
    throw new Error("Denominator must be positive.");
  }
  const sign = numerator < ZERO ? NEG_ONE : ONE;
  const absNum = numerator < ZERO ? -numerator : numerator;
  const quotient = absNum / denominator;
  const remainder = absNum % denominator;
  const rounded = remainder * TWO >= denominator ? quotient + ONE : quotient;
  return Number(sign * rounded);
}

/**
 * Parses a decimal string or number (supporting German comma or dot decimal separators)
 * into a scaled BigInt integer with `scale` fractional digits (exact, no floating-point drift).
 */
export function parseDecimalToScaledBigInt(
  value: string | number,
  scale: number
): bigint {
  const raw =
    typeof value === "number"
      ? value.toFixed(scale)
      : value.trim().replace(/\s+/g, "").replace(",", ".");

  if (!/^-?\d+(\.\d+)?$/.test(raw)) {
    throw new Error(`Invalid decimal value: "${String(value)}"`);
  }

  const negative = raw.startsWith("-");
  const unsigned = negative ? raw.slice(1) : raw;
  const [intPart, fracPart = ""] = unsigned.split(".");

  if (fracPart.length <= scale) {
    const padded = fracPart.padEnd(scale, "0");
    const result = BigInt(`${intPart}${padded}`);
    return negative ? -result : result;
  }

  // Round half-up if more fractional digits were supplied than `scale`
  const keep = fracPart.slice(0, scale);
  const nextDigit = Number(fracPart[scale]);
  let result = BigInt(`${intPart}${keep}`);
  if (nextDigit >= 5) {
    result += ONE;
  }
  return negative ? -result : result;
}

/**
 * Parses a Euro amount (e.g., "2000", "2000,50", 199.99) into integer cents using exact decimal parsing.
 */
export function eurosToCents(value: string | number): number {
  return Number(parseDecimalToScaledBigInt(value, 2));
}

export interface LineItemCalculationInput {
  quantity: string | number; // up to 4 decimal places (e.g. 2.5, "1,25")
  unitPriceNetCents: number; // integer cents (can be negative for Storno)
  discountPercent?: string | number; // 0..100, up to 2 decimal places
  discountCents?: number; // optional fixed integer cents discount
  vatRateBps: number; // 1900 = 19%, 700 = 7%, 0 = 0%
}

export interface CalculatedLineItem {
  grossLineNetBeforeDiscountCents: number;
  discountCents: number;
  lineNetCents: number;
  effectiveVatRateBps: number;
  vatCategoryCode: "S" | "Z" | "E" | "AE" | "G";
}

export interface TaxBreakdownBucket {
  vatRateBps: number;
  vatCategoryCode: "S" | "Z" | "E" | "AE" | "G";
  netCents: number;
  vatCents: number;
  grossCents: number;
}

export interface InvoiceCalculationResult {
  items: CalculatedLineItem[];
  taxBreakdown: TaxBreakdownBucket[];
  subtotalNetCents: number;
  totalDiscountCents: number;
  totalVatCents: number;
  totalGrossCents: number;
}

/**
 * Calculates a single line item using exact BigInt fixed-point math (no floats).
 * Quantity has scale 10^4; discountPercent has scale 10^2 (basis points over 10,000).
 */
export function calculateLineItem(
  item: LineItemCalculationInput,
  taxTreatment: TaxTreatment
): CalculatedLineItem {
  if (!Number.isInteger(item.unitPriceNetCents)) {
    throw new Error("unitPriceNetCents must be an integer.");
  }

  const meta = TAX_TREATMENT_META[taxTreatment];
  const effectiveVatRateBps = meta.allowPerItemRate
    ? item.vatRateBps
    : meta.defaultVatRateBps;

  const qtyScaled = parseDecimalToScaledBigInt(item.quantity, 4); // scale 10_000
  const unitCents = BigInt(item.unitPriceNetCents);

  // Gross line net before discount = roundHalfUp(quantity * unitPriceNetCents)
  const rawNetCents = roundHalfUpBigInt(qtyScaled * unitCents, SCALE_4);

  let computedDiscountCents = 0;
  const pctScaled =
    item.discountPercent !== undefined && item.discountPercent !== ""
      ? parseDecimalToScaledBigInt(item.discountPercent, 2) // 10.50% -> 1050 (over 10_000)
      : ZERO;

  if (pctScaled > ZERO) {
    computedDiscountCents += roundHalfUpBigInt(
      BigInt(rawNetCents) * pctScaled,
      SCALE_4
    );
  }
  if (item.discountCents && Number.isInteger(item.discountCents)) {
    computedDiscountCents += item.discountCents;
  }

  const lineNetCents = rawNetCents - computedDiscountCents;

  return {
    grossLineNetBeforeDiscountCents: rawNetCents,
    discountCents: computedDiscountCents,
    lineNetCents,
    effectiveVatRateBps,
    vatCategoryCode: resolveVatCategoryCode(taxTreatment, effectiveVatRateBps),
  };
}

/**
 * Calculates full German invoice totals:
 * - Each line net is computed in integer cents (half-up).
 * - VAT is computed on the SUM of net amounts per (vatRateBps, vatCategoryCode) bucket,
 *   NEVER per line then summed (§14 UStG / German accounting standard).
 * - Total gross = total net + total VAT.
 */
export function calculateInvoiceTotals(
  items: LineItemCalculationInput[],
  taxTreatment: TaxTreatment
): InvoiceCalculationResult {
  const calculatedItems = items.map((item) =>
    calculateLineItem(item, taxTreatment)
  );

  const bucketMap = new Map<
    string,
    {
      vatRateBps: number;
      vatCategoryCode: "S" | "Z" | "E" | "AE" | "G";
      netCents: number;
    }
  >();

  let subtotalNetCents = 0;
  let totalDiscountCents = 0;

  for (const calc of calculatedItems) {
    subtotalNetCents += calc.lineNetCents;
    totalDiscountCents += calc.discountCents;

    const key = `${calc.effectiveVatRateBps}:${calc.vatCategoryCode}`;
    const existing = bucketMap.get(key);
    if (existing) {
      existing.netCents += calc.lineNetCents;
    } else {
      bucketMap.set(key, {
        vatRateBps: calc.effectiveVatRateBps,
        vatCategoryCode: calc.vatCategoryCode,
        netCents: calc.lineNetCents,
      });
    }
  }

  const taxBreakdown: TaxBreakdownBucket[] = Array.from(bucketMap.values())
    .sort((a, b) => b.vatRateBps - a.vatRateBps)
    .map((bucket) => {
      // VAT = roundHalfUp(bucket.netCents * vatRateBps / 10_000)
      const vatCents = roundHalfUpBigInt(
        BigInt(bucket.netCents) * BigInt(bucket.vatRateBps),
        SCALE_4
      );
      return {
        vatRateBps: bucket.vatRateBps,
        vatCategoryCode: bucket.vatCategoryCode,
        netCents: bucket.netCents,
        vatCents,
        grossCents: bucket.netCents + vatCents,
      };
    });

  const totalVatCents = taxBreakdown.reduce((acc, b) => acc + b.vatCents, 0);
  const totalGrossCents = subtotalNetCents + totalVatCents;

  return {
    items: calculatedItems,
    taxBreakdown,
    subtotalNetCents,
    totalDiscountCents,
    totalVatCents,
    totalGrossCents,
  };
}

/**
 * Formats integer cents in standard German EUR notation: e.g. 123456 -> "1.234,56 €", -238000 -> "-2.380,00 €".
 * Uses regular space (U+0020) rather than non-breaking space so PDF fonts & text assertions stay consistent.
 */
export function formatEurDe(cents: number): string {
  const negative = cents < 0;
  const abs = Math.abs(Math.trunc(cents));
  const euros = Math.floor(abs / 100);
  const rest = String(abs % 100).padStart(2, "0");
  const eurosFormatted = euros
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${negative ? "-" : ""}${eurosFormatted},${rest} €`;
}

/**
 * Formats a quantity in German decimal notation (trims trailing zeros, keeps up to 4 decimals).
 * Examples: "1.0000" -> "1", "2.5000" -> "2,5", "1.25" -> "1,25".
 */
export function formatQuantityDe(quantity: string | number): string {
  const scaled = parseDecimalToScaledBigInt(quantity, 4);
  const negative = scaled < ZERO;
  const abs = negative ? -scaled : scaled;
  const intPart = abs / SCALE_4;
  const fracRaw = String(abs % SCALE_4).padStart(4, "0").replace(/0+$/, "");
  const intFormatted = intPart
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `${negative ? "-" : ""}${intFormatted}${fracRaw ? `,${fracRaw}` : ""}`;
}

/**
 * Formats VAT rate from basis points: 1900 -> "19 %", 700 -> "7 %", 0 -> "0 %".
 */
export function formatVatRateDe(vatRateBps: number): string {
  const pct = vatRateBps / 100;
  if (Number.isInteger(pct)) {
    return `${pct} %`;
  }
  return `${pct.toFixed(2).replace(".", ",")} %`;
}

/**
 * Formats an ISO date string (YYYY-MM-DD) or Date as German dd.MM.yyyy (UTC date-only safe).
 */
export function formatDateDe(input: Date | string | null | undefined): string {
  if (!input) return "—";
  if (typeof input === "string") {
    const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(input.trim());
    if (match) {
      return `${match[3]}.${match[2]}.${match[1]}`;
    }
    const parsed = new Date(input);
    if (Number.isNaN(parsed.getTime())) return "—";
    return formatDateDe(parsed);
  }
  const dd = String(input.getUTCDate()).padStart(2, "0");
  const mm = String(input.getUTCMonth() + 1).padStart(2, "0");
  const yyyy = String(input.getUTCFullYear());
  return `${dd}.${mm}.${yyyy}`;
}

/**
 * Converts a Date or YYYY-MM-DD string to canonical YYYY-MM-DD (UTC).
 */
export function toIsoDateOnly(input: Date | string | null | undefined): string | null {
  if (!input) return null;
  if (typeof input === "string") {
    const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(input.trim());
    if (match) return `${match[1]}-${match[2]}-${match[3]}`;
    const d = new Date(input);
    if (Number.isNaN(d.getTime())) return null;
    return toIsoDateOnly(d);
  }
  const yyyy = input.getUTCFullYear();
  const mm = String(input.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(input.getUTCDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

/**
 * Parses a YYYY-MM-DD string into a UTC midnight Date.
 */
export function parseIsoDateOnly(dateStr: string): Date {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateStr.trim());
  if (!match) {
    throw new Error(`Invalid ISO date (expected YYYY-MM-DD): "${dateStr}"`);
  }
  const d = new Date(`${match[1]}-${match[2]}-${match[3]}T00:00:00.000Z`);
  if (Number.isNaN(d.getTime())) {
    throw new Error(`Invalid calendar date: "${dateStr}"`);
  }
  return d;
}

/**
 * Adds `days` calendar days to a UTC midnight Date.
 */
export function addDaysUtc(date: Date, days: number): Date {
  const result = new Date(date.getTime());
  result.setUTCDate(result.getUTCDate() + days);
  return result;
}

/**
 * Formats a sequential invoice number: RE-YYYY-NNN (3+ zero-padded digits).
 */
export function formatInvoiceNumber(year: number, sequenceNumber: number): string {
  return `RE-${year}-${String(sequenceNumber).padStart(3, "0")}`;
}
