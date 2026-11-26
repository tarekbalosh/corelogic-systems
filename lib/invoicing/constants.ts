import type { TaxTreatment } from "@prisma/client";

/**
 * Default company metadata.
 * IMPORTANT: No fabricated legal/tax/bank values are ever hardcoded here.
 * Unknown fields MUST remain empty strings until entered in Settings -> Company.
 */
export const DEFAULT_COMPANY_LEGAL_NAME =
  "CoreLogic Systems UG (haftungsbeschränkt)";
export const DEFAULT_COMPANY_MANAGING_DIRECTOR = "Tarek Balosh";
export const DEFAULT_COMPANY_LOGO_PATH = "/corelogic_logo.png";
export const DEFAULT_PAYMENT_TERMS_DAYS = 14;

/**
 * Editable German tax legal notices.
 * All non-standard legal texts are explicitly tagged `[TODO: Steuerberater prüfen]`
 * until reviewed and confirmed by the company's German tax advisor (Steuerberater).
 */
export const DEFAULT_TAX_LEGAL_NOTICES: Record<
  "KLEINUNTERNEHMER" | "REVERSE_CHARGE" | "EXEMPT_NON_EU",
  string
> = {
  KLEINUNTERNEHMER:
    "[TODO: Steuerberater prüfen] Gemäß § 19 UStG wird keine Umsatzsteuer berechnet.",
  REVERSE_CHARGE:
    "[TODO: Steuerberater prüfen] Steuerschuldnerschaft des Leistungsempfängers (Reverse-Charge-Verfahren gemäß § 13b UStG / Art. 196 MwStSystRL).",
  EXEMPT_NON_EU:
    "[TODO: Steuerberater prüfen] Nicht im Inland steuerbare Leistung gemäß § 3a Abs. 2 UStG (Ort der sonstigen Leistung im Drittland).",
};

export const DEFAULT_INVOICE_INTRO_TEXT =
  "Sehr geehrte Damen und Herren,\n\nfür unsere erbrachten Leistungen berechnen wir Ihnen wie folgt:";

export const DEFAULT_INVOICE_OUTRO_TEXT =
  "Vielen Dank für Ihr Vertrauen! Bei Rückfragen stehen wir Ihnen jederzeit gerne zur Verfügung.";

export function buildPersonalizedIntroText(recipientName?: string | null): string {
  const cleaned = recipientName?.trim();
  if (!cleaned) {
    return DEFAULT_INVOICE_INTRO_TEXT;
  }
  return `Sehr geehrte(r) ${cleaned},\n\nfür unsere erbrachten Leistungen berechnen wir Ihnen wie folgt:`;
}

/**
 * UN/ECE Recommendation 20 unit codes for EN 16931 (XRechnung / ZUGFeRD) readiness.
 */
export interface InvoiceUnitOption {
  label: string;
  code: string; // UN/ECE Rec 20
  description: string;
}

export const INVOICE_UNIT_OPTIONS: InvoiceUnitOption[] = [
  { label: "Std.", code: "HUR", description: "Stunde (Hour)" },
  { label: "Stk.", code: "C62", description: "Stück (Piece / Unit)" },
  { label: "Pauschal", code: "LS", description: "Pauschale (Lump sum)" },
  { label: "Tag", code: "DAY", description: "Tag (Day)" },
  { label: "Monat", code: "MON", description: "Monat (Month)" },
];

export function resolveUnitCode(unitLabel: string, explicitCode?: string | null): string {
  if (explicitCode && /^[A-Z0-9]{2,5}$/.test(explicitCode.trim())) {
    return explicitCode.trim();
  }
  const normalized = unitLabel.trim().toLowerCase();
  const match = INVOICE_UNIT_OPTIONS.find(
    (u) => u.label.toLowerCase() === normalized
  );
  return match?.code ?? "C62";
}

/**
 * EN 16931 VAT category codes (BT-151 / UNCL5305) mapped to supported tax treatments.
 *  - S  : Standard rate (19% / 7%)
 *  - Z  : Zero rated goods/services (0%)
 *  - E  : Exempt from tax (§ 19 UStG Kleinunternehmer)
 *  - AE : VAT Reverse Charge (EU B2B)
 *  - G  : Free export / outside EU scope (Non-EU B2B)
 */
export interface TaxTreatmentMeta {
  value: TaxTreatment;
  label: string;
  shortLabel: string;
  defaultVatRateBps: number;
  allowPerItemRate: boolean;
  vatCategoryCode: "S" | "Z" | "E" | "AE" | "G";
  requiresCustomerVatId: boolean;
  requiresIssuerVatId: boolean;
}

export const TAX_TREATMENT_META: Record<TaxTreatment, TaxTreatmentMeta> = {
  STANDARD_19: {
    value: "STANDARD_19",
    label: "Regelbesteuerung (19 % USt. Standard / 7 % / 0 % je Position)",
    shortLabel: "19 % USt. (Standard)",
    defaultVatRateBps: 1900,
    allowPerItemRate: true,
    vatCategoryCode: "S",
    requiresCustomerVatId: false,
    requiresIssuerVatId: false,
  },
  REDUCED_7: {
    value: "REDUCED_7",
    label: "Ermäßigter Steuersatz (7 % USt.)",
    shortLabel: "7 % USt.",
    defaultVatRateBps: 700,
    allowPerItemRate: true,
    vatCategoryCode: "S",
    requiresCustomerVatId: false,
    requiresIssuerVatId: false,
  },
  ZERO_RATED: {
    value: "ZERO_RATED",
    label: "0 % Umsatzsteuer (steuerfrei / Nullsteuersatz)",
    shortLabel: "0 % USt.",
    defaultVatRateBps: 0,
    allowPerItemRate: false,
    vatCategoryCode: "Z",
    requiresCustomerVatId: false,
    requiresIssuerVatId: false,
  },
  KLEINUNTERNEHMER: {
    value: "KLEINUNTERNEHMER",
    label: "Kleinunternehmerregelung (§ 19 UStG – 0 %)",
    shortLabel: "§ 19 UStG",
    defaultVatRateBps: 0,
    allowPerItemRate: false,
    vatCategoryCode: "E",
    requiresCustomerVatId: false,
    requiresIssuerVatId: false,
  },
  REVERSE_CHARGE: {
    value: "REVERSE_CHARGE",
    label: "Reverse-Charge EU B2B (§ 13b UStG – 0 %, USt-IdNr. erforderlich)",
    shortLabel: "Reverse-Charge (EU)",
    defaultVatRateBps: 0,
    allowPerItemRate: false,
    vatCategoryCode: "AE",
    requiresCustomerVatId: true,
    requiresIssuerVatId: true,
  },
  EXEMPT_NON_EU: {
    value: "EXEMPT_NON_EU",
    label: "Nicht steuerbare Leistung außerhalb EU (§ 3a Abs. 2 UStG – 0 %)",
    shortLabel: "Drittland (0 %)",
    defaultVatRateBps: 0,
    allowPerItemRate: false,
    vatCategoryCode: "G",
    requiresCustomerVatId: false,
    requiresIssuerVatId: false,
  },
};

export const ALLOWED_VAT_RATES_BPS = [1900, 700, 0] as const;

export const PAYMENT_METHOD_OPTIONS = [
  "SEPA-Überweisung",
  "Echtzeit-Überweisung",
  "PayPal / Zahlungsdienstleister",
  "Bar / Quittung",
  "Sonstige",
] as const;

export const EU_COUNTRY_CODES = new Set([
  "AT", "BE", "BG", "CY", "CZ", "DE", "DK", "EE", "ES", "FI", "FR", "GR",
  "HR", "HU", "IE", "IT", "LT", "LU", "LV", "MT", "NL", "PL", "PT", "RO",
  "SE", "SI", "SK",
]);

export function resolveVatCategoryCode(
  taxTreatment: TaxTreatment,
  vatRateBps: number
): "S" | "Z" | "E" | "AE" | "G" {
  if (taxTreatment === "KLEINUNTERNEHMER") return "E";
  if (taxTreatment === "REVERSE_CHARGE") return "AE";
  if (taxTreatment === "EXEMPT_NON_EU") return "G";
  if (taxTreatment === "ZERO_RATED" || vatRateBps === 0) return "Z";
  return "S";
}
