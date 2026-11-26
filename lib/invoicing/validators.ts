import type { TaxTreatment } from "@prisma/client";
import { z } from "zod";
import { ALLOWED_VAT_RATES_BPS, TAX_TREATMENT_META } from "./constants";

/**
 * Expected IBAN length per ISO 13616 country code (focus on SEPA/EU + common countries).
 */
const IBAN_LENGTH_BY_COUNTRY: Record<string, number> = {
  AT: 20,
  BE: 16,
  BG: 22,
  CH: 21,
  CY: 28,
  CZ: 24,
  DE: 22,
  DK: 18,
  EE: 20,
  ES: 24,
  FI: 18,
  FR: 27,
  GB: 22,
  GR: 27,
  HR: 21,
  HU: 28,
  IE: 22,
  IT: 27,
  LI: 21,
  LT: 20,
  LU: 20,
  LV: 21,
  MC: 27,
  MT: 31,
  NL: 18,
  NO: 15,
  PL: 28,
  PT: 25,
  RO: 24,
  SE: 24,
  SI: 19,
  SK: 24,
};

export function normalizeIban(iban: string): string {
  return iban.replace(/\s+/g, "").toUpperCase();
}

export function formatIbanGrouped(iban: string): string {
  const normalized = normalizeIban(iban);
  return normalized.replace(/(.{4})(?=.)/g, "$1 ");
}

/**
 * Validates IBAN format, country-specific length, and ISO 7064 MOD-97-10 checksum.
 */
export function isValidIban(rawIban: string): boolean {
  const iban = normalizeIban(rawIban);
  if (iban.length < 15 || iban.length > 34) {
    return false;
  }
  if (!/^[A-Z]{2}\d{2}[A-Z0-9]+$/.test(iban)) {
    return false;
  }

  const country = iban.slice(0, 2);
  const expectedLength = IBAN_LENGTH_BY_COUNTRY[country];
  if (expectedLength && iban.length !== expectedLength) {
    return false;
  }

  // Rearrange first 4 characters to the end and convert letters A=10..Z=35
  const rearranged = `${iban.slice(4)}${iban.slice(0, 4)}`;
  let remainder = 0;
  for (let i = 0; i < rearranged.length; i++) {
    const ch = rearranged[i];
    const code = ch.charCodeAt(0);
    if (code >= 48 && code <= 57) {
      remainder = (remainder * 10 + (code - 48)) % 97;
    } else if (code >= 65 && code <= 90) {
      const val = code - 55; // A=10..Z=35
      remainder = (remainder * 100 + val) % 97;
    } else {
      return false;
    }
  }
  return remainder === 1;
}

/**
 * Validates BIC/SWIFT format (8 or 11 alphanumeric characters).
 */
export function isValidBic(rawBic: string): boolean {
  const bic = rawBic.replace(/\s+/g, "").toUpperCase();
  return /^[A-Z]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$/.test(bic);
}

/**
 * Country-specific EU USt-IdNr (VAT ID) format patterns (German DE + EU Member States).
 */
const EU_VAT_ID_PATTERNS: Record<string, RegExp> = {
  AT: /^ATU\d{8}$/,
  BE: /^BE[01]\d{9}$/,
  BG: /^BG\d{9,10}$/,
  CY: /^CY\d{8}[A-Z]$/,
  CZ: /^CZ\d{8,10}$/,
  DE: /^DE\d{9}$/,
  DK: /^DK\d{8}$/,
  EE: /^EE\d{9}$/,
  EL: /^EL\d{9}$/,
  ES: /^ES[A-Z0-9]\d{7}[A-Z0-9]$/,
  FI: /^FI\d{8}$/,
  FR: /^FR[A-HJ-NP-Z0-9]{2}\d{9}$/,
  HR: /^HR\d{11}$/,
  HU: /^HU\d{8}$/,
  IE: /^IE(\d{7}[A-W]{1,2}|\d[A-Z+*]\d{5}[A-W])$/,
  IT: /^IT\d{11}$/,
  LT: /^LT(\d{9}|\d{12})$/,
  LU: /^LU\d{8}$/,
  LV: /^LV\d{11}$/,
  MT: /^MT\d{8}$/,
  NL: /^NL\d{9}B\d{2}$/,
  PL: /^PL\d{10}$/,
  PT: /^PT\d{9}$/,
  RO: /^RO\d{2,10}$/,
  SE: /^SE\d{12}$/,
  SI: /^SI\d{8}$/,
  SK: /^SK\d{10}$/,
};

export function normalizeVatId(rawVatId: string): string {
  return rawVatId.replace(/[\s.-]+/g, "").toUpperCase();
}

/**
 * Validates German and EU USt-IdNr format (e.g., DE123456789, ATU12345678, NL123456789B01).
 */
export function isValidVatId(rawVatId: string): boolean {
  const vat = normalizeVatId(rawVatId);
  if (vat.length < 4 || vat.length > 16) return false;
  const prefix = vat.slice(0, 2);
  const pattern = EU_VAT_ID_PATTERNS[prefix];
  if (!pattern) return false;
  return pattern.test(vat);
}

// ============================================================================
// Mandatory Pre-Issuance Completeness Check (§14 UStG + §35a GmbHG)
// ============================================================================

export interface CompanySettingsValidationInput {
  legalName: string;
  street: string;
  postalCode: string;
  city: string;
  country: string;
  managingDirector: string;
  registerCourt: string;
  registerNumber: string;
  taxNumber: string;
  vatId: string;
  email: string;
  phone: string;
  bankAccountHolder: string;
  bankIban: string;
  bankBic: string;
  bankName: string;
}

export interface CustomerValidationInput {
  name: string;
  companyName?: string | null;
  street: string;
  postalCode: string;
  city: string;
  country: string;
  vatId?: string | null;
}

export interface InvoiceIssuanceValidationInput {
  company: CompanySettingsValidationInput;
  customer: CustomerValidationInput;
  taxTreatment: TaxTreatment;
  serviceDate?: Date | string | null;
  servicePeriodStart?: Date | string | null;
  servicePeriodEnd?: Date | string | null;
  itemsCount: number;
  hasValidItemAmounts: boolean;
  taxLegalNotice?: string | null;
}

export interface IssuanceValidationIssue {
  field: string;
  section: "company" | "customer" | "invoice";
  message: string;
}

export function validateCompanySettingsForIssuance(
  company: CompanySettingsValidationInput
): IssuanceValidationIssue[] {
  const issues: IssuanceValidationIssue[] = [];

  if (!company.legalName.trim()) {
    issues.push({
      field: "legalName",
      section: "company",
      message: "Firmenname mit Rechtsform (z. B. UG (haftungsbeschränkt)) fehlt.",
    });
  }
  if (!company.street.trim()) {
    issues.push({
      field: "street",
      section: "company",
      message: "Straße und Hausnummer der Gesellschaft fehlen.",
    });
  }
  if (!company.postalCode.trim()) {
    issues.push({
      field: "postalCode",
      section: "company",
      message: "Postleitzahl der Gesellschaft fehlt.",
    });
  }
  if (!company.city.trim()) {
    issues.push({
      field: "city",
      section: "company",
      message: "Ort / Sitz der Gesellschaft (§ 35a GmbHG) fehlt.",
    });
  }
  if (!company.managingDirector.trim()) {
    issues.push({
      field: "managingDirector",
      section: "company",
      message: "Geschäftsführer (§ 35a GmbHG) fehlt.",
    });
  }
  if (!company.registerCourt.trim()) {
    issues.push({
      field: "registerCourt",
      section: "company",
      message: "Registergericht / Amtsgericht (§ 35a GmbHG) fehlt.",
    });
  }
  if (!company.registerNumber.trim()) {
    issues.push({
      field: "registerNumber",
      section: "company",
      message: "Handelsregisternummer / HRB (§ 35a GmbHG) fehlt.",
    });
  }
  if (!company.taxNumber.trim() && !company.vatId.trim()) {
    issues.push({
      field: "taxNumber",
      section: "company",
      message:
        "Steuernummer oder USt-IdNr. des Ausstellers (§ 14 Abs. 4 Nr. 2 UStG) fehlt.",
    });
  }
  if (company.vatId.trim() && !isValidVatId(company.vatId)) {
    issues.push({
      field: "vatId",
      section: "company",
      message: "USt-IdNr. des Ausstellers hat ein ungültiges Format.",
    });
  }
  if (!company.email.trim()) {
    issues.push({
      field: "email",
      section: "company",
      message: "Geschäftliche E-Mail-Adresse des Ausstellers fehlt.",
    });
  }
  if (!company.bankAccountHolder.trim()) {
    issues.push({
      field: "bankAccountHolder",
      section: "company",
      message: "Kontoinhaber fehlt.",
    });
  }
  if (!company.bankIban.trim()) {
    issues.push({
      field: "bankIban",
      section: "company",
      message: "IBAN des Geschäftskontos fehlt.",
    });
  } else if (!isValidIban(company.bankIban)) {
    issues.push({
      field: "bankIban",
      section: "company",
      message: "IBAN ist ungültig (Prüfziffer / Formatfehler).",
    });
  }
  if (!company.bankBic.trim()) {
    issues.push({
      field: "bankBic",
      section: "company",
      message: "BIC der Bank fehlt.",
    });
  } else if (!isValidBic(company.bankBic)) {
    issues.push({
      field: "bankBic",
      section: "company",
      message: "BIC hat ein ungültiges Format (8 oder 11 Zeichen).",
    });
  }
  if (!company.bankName.trim()) {
    issues.push({
      field: "bankName",
      section: "company",
      message: "Name der Bank fehlt.",
    });
  }

  return issues;
}

export function validateInvoiceForIssuance(
  input: InvoiceIssuanceValidationInput
): IssuanceValidationIssue[] {
  const issues: IssuanceValidationIssue[] = [
    ...validateCompanySettingsForIssuance(input.company),
  ];

  // Customer mandatory fields (§14 Abs. 4 Nr. 1 UStG)
  if (!input.customer.name.trim() && !input.customer.companyName?.trim()) {
    issues.push({
      field: "customer.name",
      section: "customer",
      message: "Name oder Firma des Rechnungsempfängers fehlt.",
    });
  }
  if (!input.customer.street.trim()) {
    issues.push({
      field: "customer.street",
      section: "customer",
      message: "Straße und Hausnummer des Kunden fehlen.",
    });
  }
  if (!input.customer.postalCode.trim()) {
    issues.push({
      field: "customer.postalCode",
      section: "customer",
      message: "Postleitzahl des Kunden fehlt.",
    });
  }
  if (!input.customer.city.trim()) {
    issues.push({
      field: "customer.city",
      section: "customer",
      message: "Ort des Kunden fehlt.",
    });
  }
  if (input.customer.vatId?.trim() && !isValidVatId(input.customer.vatId)) {
    issues.push({
      field: "customer.vatId",
      section: "customer",
      message: "USt-IdNr. des Kunden hat ein ungültiges Format.",
    });
  }

  // Tax treatment specific rules
  const taxMeta = TAX_TREATMENT_META[input.taxTreatment];
  if (taxMeta.requiresIssuerVatId) {
    if (!input.company.vatId.trim() || !isValidVatId(input.company.vatId)) {
      issues.push({
        field: "company.vatId",
        section: "company",
        message:
          "Für Reverse-Charge (EU B2B) ist eine gültige USt-IdNr. des Ausstellers erforderlich.",
      });
    }
  }
  if (taxMeta.requiresCustomerVatId) {
    if (!input.customer.vatId?.trim() || !isValidVatId(input.customer.vatId)) {
      issues.push({
        field: "customer.vatId",
        section: "customer",
        message:
          "Für Reverse-Charge (EU B2B) ist eine gültige USt-IdNr. des Kunden erforderlich.",
      });
    }
  }

  // Service date or service period (§14 Abs. 4 Nr. 6 UStG)
  const hasServiceDate = Boolean(input.serviceDate);
  const hasServicePeriod = Boolean(
    input.servicePeriodStart && input.servicePeriodEnd
  );
  if (!hasServiceDate && !hasServicePeriod) {
    issues.push({
      field: "serviceDate",
      section: "invoice",
      message:
        "Leistungsdatum oder Leistungszeitraum (Start & Ende) muss angegeben werden (§ 14 Abs. 4 Nr. 6 UStG).",
    });
  }
  if (input.servicePeriodStart && input.servicePeriodEnd) {
    const start = new Date(input.servicePeriodStart);
    const end = new Date(input.servicePeriodEnd);
    if (end.getTime() < start.getTime()) {
      issues.push({
        field: "servicePeriodEnd",
        section: "invoice",
        message: "Ende des Leistungszeitraums darf nicht vor dem Startdatum liegen.",
      });
    }
  }

  // Line items (§14 Abs. 4 Nr. 5 UStG)
  if (input.itemsCount <= 0) {
    issues.push({
      field: "items",
      section: "invoice",
      message: "Mindestens eine Rechnungsposition ist erforderlich.",
    });
  } else if (!input.hasValidItemAmounts) {
    issues.push({
      field: "items",
      section: "invoice",
      message: "Alle Positionen benötigen eine Beschreibung und eine gültige Menge > 0.",
    });
  }

  // Tax legal notice required for special zero-tax regimes
  if (
    (input.taxTreatment === "KLEINUNTERNEHMER" ||
      input.taxTreatment === "REVERSE_CHARGE" ||
      input.taxTreatment === "EXEMPT_NON_EU") &&
    !input.taxLegalNotice?.trim()
  ) {
    issues.push({
      field: "taxLegalNotice",
      section: "invoice",
      message: "Steuerhinweis für die gewählte Steuerbehandlung fehlt.",
    });
  }

  return issues;
}

// ============================================================================
// Zod Schemas for API Payloads
// ============================================================================

export const TaxTreatmentSchema = z.enum([
  "STANDARD_19",
  "REDUCED_7",
  "ZERO_RATED",
  "KLEINUNTERNEHMER",
  "REVERSE_CHARGE",
  "EXEMPT_NON_EU",
]);

export const CompanySettingsUpdateSchema = z
  .object({
    legalName: z.string().trim().min(2).max(200),
    street: z.string().trim().max(200).default(""),
    postalCode: z.string().trim().max(32).default(""),
    city: z.string().trim().max(120).default(""),
    country: z.string().trim().min(2).max(2).transform((v) => v.toUpperCase()).default("DE"),
    managingDirector: z.string().trim().max(160).default(""),
    registerCourt: z.string().trim().max(160).default(""),
    registerNumber: z.string().trim().max(80).default(""),
    taxNumber: z.string().trim().max(80).default(""),
    vatId: z.string().trim().max(32).default(""),
    email: z.string().trim().max(160).default(""),
    phone: z.string().trim().max(64).default(""),
    website: z.string().trim().max(200).default(""),
    bankAccountHolder: z.string().trim().max(160).default(""),
    bankIban: z.string().trim().max(44).default(""),
    bankBic: z.string().trim().max(20).default(""),
    bankName: z.string().trim().max(160).default(""),
    logoPath: z.string().trim().max(260).default("/corelogic_logo.png"),
    defaultPaymentTermsDays: z.coerce.number().int().min(0).max(180).default(14),
    defaultTaxTreatment: TaxTreatmentSchema.default("STANDARD_19"),
    kleinunternehmerNotice: z.string().trim().min(1).max(1000),
    reverseChargeNotice: z.string().trim().min(1).max(1000),
    exemptNonEuNotice: z.string().trim().min(1).max(1000),
  })
  .superRefine((data, ctx) => {
    if (data.bankIban && !isValidIban(data.bankIban)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["bankIban"],
        message: "Ungültige IBAN (Prüfziffer / Format ungültig).",
      });
    }
    if (data.bankBic && !isValidBic(data.bankBic)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["bankBic"],
        message: "Ungültige BIC (erwartet 8 oder 11 alphanumerische Zeichen).",
      });
    }
    if (data.vatId && !isValidVatId(data.vatId)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["vatId"],
        message: "Ungültige USt-IdNr. (z. B. DE123456789).",
      });
    }
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["email"],
        message: "Ungültige E-Mail-Adresse.",
      });
    }
  });

export const BillingCustomerInputSchema = z
  .object({
    customerNumber: z.string().trim().max(40).optional().nullable(),
    name: z.string().trim().min(1, "Kundenname ist erforderlich.").max(200),
    companyName: z.string().trim().max(200).optional().nullable(),
    contactPerson: z.string().trim().max(160).optional().nullable(),
    street: z.string().trim().max(200).default(""),
    postalCode: z.string().trim().max(32).default(""),
    city: z.string().trim().max(120).default(""),
    country: z.string().trim().min(2).max(2).transform((v) => v.toUpperCase()).default("DE"),
    email: z.string().trim().max(160).optional().nullable(),
    phone: z.string().trim().max(64).optional().nullable(),
    vatId: z.string().trim().max(32).optional().nullable(),
    notes: z.string().trim().max(2000).optional().nullable(),
    leadId: z.string().trim().max(64).optional().nullable(),
    bookingId: z.string().trim().max(64).optional().nullable(),
  })
  .superRefine((data, ctx) => {
    if (data.vatId && !isValidVatId(data.vatId)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["vatId"],
        message: "Ungültige USt-IdNr. (z. B. DE123456789).",
      });
    }
    if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["email"],
        message: "Ungültige E-Mail-Adresse.",
      });
    }
  });

export const InvoiceItemInputSchema = z.object({
  description: z.string().trim().min(1, "Beschreibung erforderlich.").max(2000),
  quantity: z
    .union([z.number(), z.string()])
    .transform((v) => String(v).trim().replace(",", "."))
    .refine((v) => /^\d+(\.\d{1,4})?$/.test(v) && Number(v) > 0, {
      message: "Menge muss eine positive Zahl (bis 4 Nachkommastellen) sein.",
    }),
  unit: z.string().trim().min(1).max(32).default("Std."),
  unitCode: z.string().trim().max(8).optional(),
  unitPriceNetCents: z.coerce.number().int().min(0).max(1_000_000_000),
  discountPercent: z
    .union([z.number(), z.string()])
    .optional()
    .default(0)
    .transform((v) => String(v ?? 0).trim().replace(",", "."))
    .refine((v) => /^\d+(\.\d{1,2})?$/.test(v) && Number(v) >= 0 && Number(v) <= 100, {
      message: "Rabatt (%) muss zwischen 0 und 100 liegen.",
    }),
  discountCents: z.coerce.number().int().min(0).max(1_000_000_000).optional().default(0),
  vatRateBps: z.coerce
    .number()
    .int()
    .refine((v) => (ALLOWED_VAT_RATES_BPS as readonly number[]).includes(v), {
      message: "USt.-Satz muss 19 %, 7 % oder 0 % sein.",
    }),
});

export const InvoiceDraftInputSchema = z.object({
  customerId: z.string().trim().min(1, "Kunde ist erforderlich.").max(64),
  taxTreatment: TaxTreatmentSchema.default("STANDARD_19"),
  issueDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().nullable(),
  serviceDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().nullable(),
  servicePeriodStart: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().nullable(),
  servicePeriodEnd: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().nullable(),
  paymentTermsDays: z.coerce.number().int().min(0).max(180).default(14),
  customerReference: z.string().trim().max(120).optional().nullable(),
  buyerReference: z.string().trim().max(120).optional().nullable(),
  notes: z.string().trim().max(2000).optional().nullable(),
  introText: z.string().trim().max(2000).optional(),
  outroText: z.string().trim().max(2000).optional(),
  taxLegalNotice: z.string().trim().max(1000).optional().nullable(),
  items: z.array(InvoiceItemInputSchema).min(1, "Mindestens eine Position erforderlich.").max(200),
});

export const RecordPaymentInputSchema = z.object({
  paidAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Datum im Format YYYY-MM-DD erforderlich."),
  amountCents: z.coerce.number().int().positive("Zahlbetrag muss > 0 Cent sein."),
  method: z.string().trim().min(2).max(100),
  reference: z.string().trim().max(160).optional().nullable(),
  notes: z.string().trim().max(1000).optional().nullable(),
});
