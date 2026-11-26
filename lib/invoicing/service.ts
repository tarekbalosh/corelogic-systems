import crypto from "node:crypto";
import type { Prisma, PrismaClient, TaxTreatment } from "@prisma/client";
import prisma from "@/lib/db";
import {
  buildPersonalizedIntroText,
  DEFAULT_COMPANY_LEGAL_NAME,
  DEFAULT_COMPANY_LOGO_PATH,
  DEFAULT_COMPANY_MANAGING_DIRECTOR,
  DEFAULT_INVOICE_INTRO_TEXT,
  DEFAULT_INVOICE_OUTRO_TEXT,
  DEFAULT_PAYMENT_TERMS_DAYS,
  DEFAULT_TAX_LEGAL_NOTICES,
  resolveUnitCode,
} from "./constants";
import {
  addDaysUtc,
  calculateInvoiceTotals,
  formatInvoiceNumber,
  parseIsoDateOnly,
  toIsoDateOnly,
  type TaxBreakdownBucket,
} from "./money";
import {
  computeDisplayStatus,
  type CompanySnapshot,
  type CustomerSnapshot,
  type InvoiceItemSnapshot,
  type InvoicePdfDocumentData,
  type SerializedBillingCustomer,
  type SerializedCompanySettings,
  type SerializedInvoiceDetail,
  type SerializedInvoiceListItem,
} from "./types";
import {
  BillingCustomerInputSchema,
  CompanySettingsUpdateSchema,
  InvoiceDraftInputSchema,
  normalizeIban,
  normalizeVatId,
  RecordPaymentInputSchema,
  validateInvoiceForIssuance,
  type IssuanceValidationIssue,
} from "./validators";

export class InvoicingError extends Error {
  statusCode: number;
  code: string;
  issues?: IssuanceValidationIssue[];

  constructor(
    message: string,
    statusCode: number,
    code: string,
    issues?: IssuanceValidationIssue[]
  ) {
    super(message);
    this.name = "InvoicingError";
    this.statusCode = statusCode;
    this.code = code;
    this.issues = issues;
  }
}

export type PdfRenderFn = (data: InvoicePdfDocumentData) => Promise<Uint8Array>;

type DbClient = PrismaClient | Prisma.TransactionClient;

/**
 * Interactive transaction timeouts tuned for cross-region Neon PostgreSQL
 * (multiple sequential round-trips + server-side PDF rendering inside issue/storno transactions).
 */
const INVOICING_TX_OPTIONS = {
  maxWait: 10_000,
  timeout: 25_000,
} as const;

// ============================================================================
// Company Settings (Single Source of Truth)
// ============================================================================

export function buildDefaultCompanySettingsRecord() {
  return {
    id: "default",
    legalName: DEFAULT_COMPANY_LEGAL_NAME,
    street: "",
    postalCode: "",
    city: "",
    country: "DE",
    managingDirector: DEFAULT_COMPANY_MANAGING_DIRECTOR,
    registerCourt: "",
    registerNumber: "",
    taxNumber: "",
    vatId: "",
    email: "",
    phone: "",
    website: "",
    bankAccountHolder: "",
    bankIban: "",
    bankBic: "",
    bankName: "",
    logoPath: DEFAULT_COMPANY_LOGO_PATH,
    defaultPaymentTermsDays: DEFAULT_PAYMENT_TERMS_DAYS,
    defaultTaxTreatment: "STANDARD_19" as TaxTreatment,
    kleinunternehmerNotice: DEFAULT_TAX_LEGAL_NOTICES.KLEINUNTERNEHMER,
    reverseChargeNotice: DEFAULT_TAX_LEGAL_NOTICES.REVERSE_CHARGE,
    exemptNonEuNotice: DEFAULT_TAX_LEGAL_NOTICES.EXEMPT_NON_EU,
  };
}

export async function getOrInitCompanySettings(
  db: DbClient = prisma
): Promise<SerializedCompanySettings> {
  let row = await db.companySettings.findUnique({ where: { id: "default" } });
  if (!row) {
    row = await db.companySettings.create({
      data: buildDefaultCompanySettingsRecord(),
    });
  }
  return serializeCompanySettings(row);
}

export function serializeCompanySettings(row: {
  id: string;
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
  website: string;
  bankAccountHolder: string;
  bankIban: string;
  bankBic: string;
  bankName: string;
  logoPath: string;
  defaultPaymentTermsDays: number;
  defaultTaxTreatment: TaxTreatment;
  kleinunternehmerNotice: string;
  reverseChargeNotice: string;
  exemptNonEuNotice: string;
  updatedAt: Date;
}): SerializedCompanySettings {
  return {
    id: row.id,
    legalName: row.legalName,
    street: row.street,
    postalCode: row.postalCode,
    city: row.city,
    country: row.country,
    managingDirector: row.managingDirector,
    registerCourt: row.registerCourt,
    registerNumber: row.registerNumber,
    taxNumber: row.taxNumber,
    vatId: row.vatId,
    email: row.email,
    phone: row.phone,
    website: row.website,
    bankAccountHolder: row.bankAccountHolder,
    bankIban: row.bankIban,
    bankBic: row.bankBic,
    bankName: row.bankName,
    logoPath: row.logoPath,
    defaultPaymentTermsDays: row.defaultPaymentTermsDays,
    defaultTaxTreatment: row.defaultTaxTreatment,
    kleinunternehmerNotice: row.kleinunternehmerNotice,
    reverseChargeNotice: row.reverseChargeNotice,
    exemptNonEuNotice: row.exemptNonEuNotice,
    updatedAtIso: row.updatedAt.toISOString(),
  };
}

export async function updateCompanySettings(
  rawInput: unknown,
  db: DbClient = prisma
): Promise<SerializedCompanySettings> {
  const parsed = CompanySettingsUpdateSchema.safeParse(rawInput);
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    throw new InvoicingError(
      firstIssue?.message ?? "Ungültige Firmendaten.",
      400,
      "VALIDATION_ERROR"
    );
  }

  const data = parsed.data;
  const normalizedIban = data.bankIban ? normalizeIban(data.bankIban) : "";
  const normalizedBic = data.bankBic
    ? data.bankBic.replace(/\s+/g, "").toUpperCase()
    : "";
  const normalizedVatId = data.vatId ? normalizeVatId(data.vatId) : "";

  const updated = await db.companySettings.upsert({
    where: { id: "default" },
    create: {
      id: "default",
      ...data,
      bankIban: normalizedIban,
      bankBic: normalizedBic,
      vatId: normalizedVatId,
    },
    update: {
      ...data,
      bankIban: normalizedIban,
      bankBic: normalizedBic,
      vatId: normalizedVatId,
    },
  });

  return serializeCompanySettings(updated);
}

export function resolveDefaultTaxLegalNotice(
  taxTreatment: TaxTreatment,
  company: Pick<
    SerializedCompanySettings,
    "kleinunternehmerNotice" | "reverseChargeNotice" | "exemptNonEuNotice"
  >
): string | null {
  if (taxTreatment === "KLEINUNTERNEHMER") {
    return company.kleinunternehmerNotice;
  }
  if (taxTreatment === "REVERSE_CHARGE") {
    return company.reverseChargeNotice;
  }
  if (taxTreatment === "EXEMPT_NON_EU") {
    return company.exemptNonEuNotice;
  }
  return null;
}

// ============================================================================
// Billing Customers
// ============================================================================

export function serializeCustomer(row: {
  id: string;
  customerNumber: string | null;
  name: string;
  companyName: string | null;
  contactPerson: string | null;
  street: string;
  postalCode: string;
  city: string;
  country: string;
  email: string | null;
  phone: string | null;
  vatId: string | null;
  notes: string | null;
  leadId: string | null;
  bookingId: string | null;
  createdAt: Date;
  _count?: { invoices: number };
}): SerializedBillingCustomer {
  return {
    id: row.id,
    customerNumber: row.customerNumber,
    name: row.name,
    companyName: row.companyName,
    contactPerson: row.contactPerson,
    street: row.street,
    postalCode: row.postalCode,
    city: row.city,
    country: row.country,
    email: row.email,
    phone: row.phone,
    vatId: row.vatId,
    notes: row.notes,
    leadId: row.leadId,
    bookingId: row.bookingId,
    invoiceCount: row._count?.invoices,
    createdAtIso: row.createdAt.toISOString(),
  };
}

async function generateCustomerNumber(db: DbClient): Promise<string> {
  const count = await db.billingCustomer.count();
  for (let offset = 1; offset <= 20; offset++) {
    const candidate = `KD-${String(count + offset).padStart(4, "0")}`;
    const exists = await db.billingCustomer.findUnique({
      where: { customerNumber: candidate },
      select: { id: true },
    });
    if (!exists) return candidate;
  }
  return `KD-${Date.now().toString().slice(-6)}`;
}

export async function listBillingCustomers(
  db: DbClient = prisma
): Promise<SerializedBillingCustomer[]> {
  const rows = await db.billingCustomer.findMany({
    orderBy: [{ name: "asc" }],
    include: { _count: { select: { invoices: true } } },
  });
  return rows.map(serializeCustomer);
}

export async function createBillingCustomer(
  rawInput: unknown,
  db: DbClient = prisma
): Promise<SerializedBillingCustomer> {
  const parsed = BillingCustomerInputSchema.safeParse(rawInput);
  if (!parsed.success) {
    throw new InvoicingError(
      parsed.error.issues[0]?.message ?? "Ungültige Kundendaten.",
      400,
      "VALIDATION_ERROR"
    );
  }
  const data = parsed.data;
  const customerNumber =
    data.customerNumber?.trim() || (await generateCustomerNumber(db));

  const created = await db.billingCustomer.create({
    data: {
      customerNumber,
      name: data.name,
      companyName: data.companyName?.trim() || null,
      contactPerson: data.contactPerson?.trim() || null,
      street: data.street,
      postalCode: data.postalCode,
      city: data.city,
      country: data.country,
      email: data.email?.trim() || null,
      phone: data.phone?.trim() || null,
      vatId: data.vatId?.trim() ? normalizeVatId(data.vatId) : null,
      notes: data.notes?.trim() || null,
      leadId: data.leadId?.trim() || null,
      bookingId: data.bookingId?.trim() || null,
    },
    include: { _count: { select: { invoices: true } } },
  });

  return serializeCustomer(created);
}

export async function updateBillingCustomer(
  id: string,
  rawInput: unknown,
  db: DbClient = prisma
): Promise<SerializedBillingCustomer> {
  const parsed = BillingCustomerInputSchema.safeParse(rawInput);
  if (!parsed.success) {
    throw new InvoicingError(
      parsed.error.issues[0]?.message ?? "Ungültige Kundendaten.",
      400,
      "VALIDATION_ERROR"
    );
  }
  const data = parsed.data;
  const existing = await db.billingCustomer.findUnique({ where: { id } });
  if (!existing) {
    throw new InvoicingError("Kunde nicht gefunden.", 404, "NOT_FOUND");
  }

  const updated = await db.billingCustomer.update({
    where: { id },
    data: {
      customerNumber: data.customerNumber?.trim() || existing.customerNumber,
      name: data.name,
      companyName: data.companyName?.trim() || null,
      contactPerson: data.contactPerson?.trim() || null,
      street: data.street,
      postalCode: data.postalCode,
      city: data.city,
      country: data.country,
      email: data.email?.trim() || null,
      phone: data.phone?.trim() || null,
      vatId: data.vatId?.trim() ? normalizeVatId(data.vatId) : null,
      notes: data.notes?.trim() || null,
    },
    include: { _count: { select: { invoices: true } } },
  });

  return serializeCustomer(updated);
}

/**
 * 1-click creation (or lookup) of a BillingCustomer from an existing Lead or Booking.
 * Copies name, companyName, phone, and email — leaves postal address blank to be completed manually.
 */
export async function createBillingCustomerFromSource(
  params: { leadId?: string; bookingId?: string },
  db: DbClient = prisma
): Promise<{ customer: SerializedBillingCustomer; alreadyExisted: boolean }> {
  let leadId = params.leadId?.trim() || null;
  const bookingId = params.bookingId?.trim() || null;

  if (!leadId && !bookingId) {
    throw new InvoicingError(
      "leadId oder bookingId ist erforderlich.",
      400,
      "VALIDATION_ERROR"
    );
  }

  let leadRecord: {
    id: string;
    name: string;
    companyName: string | null;
    email: string | null;
    whatsappNumber: string;
  } | null = null;

  if (bookingId) {
    const booking = await db.booking.findUnique({
      where: { id: bookingId },
      include: { lead: true },
    });
    if (!booking) {
      throw new InvoicingError("Buchung nicht gefunden.", 404, "NOT_FOUND");
    }
    leadRecord = booking.lead;
    leadId = booking.lead.id;
  } else if (leadId) {
    leadRecord = await db.lead.findUnique({ where: { id: leadId } });
    if (!leadRecord) {
      throw new InvoicingError("Lead nicht gefunden.", 404, "NOT_FOUND");
    }
  }

  if (!leadRecord) {
    throw new InvoicingError("Quelle nicht gefunden.", 404, "NOT_FOUND");
  }

  // Reuse existing customer if already created for this Lead
  const existing = await db.billingCustomer.findFirst({
    where: { leadId: leadRecord.id },
    include: { _count: { select: { invoices: true } } },
  });
  if (existing) {
    return { customer: serializeCustomer(existing), alreadyExisted: true };
  }

  const customerNumber = await generateCustomerNumber(db);
  const created = await db.billingCustomer.create({
    data: {
      customerNumber,
      name: leadRecord.name,
      companyName: leadRecord.companyName || null,
      contactPerson: leadRecord.companyName ? leadRecord.name : null,
      street: "",
      postalCode: "",
      city: "",
      country: "DE",
      email: leadRecord.email || null,
      phone: leadRecord.whatsappNumber || null,
      vatId: null,
      notes: bookingId
        ? `Erstellt aus Buchung ${bookingId} (Bitte Rechnungsadresse ergänzen).`
        : `Erstellt aus Lead ${leadRecord.id} (Bitte Rechnungsadresse ergänzen).`,
      leadId: leadRecord.id,
      bookingId,
    },
    include: { _count: { select: { invoices: true } } },
  });

  return { customer: serializeCustomer(created), alreadyExisted: false };
}

// ============================================================================
// Atomic Sequential Invoice Number Reservation (RE-YYYY-NNN)
// ============================================================================

/**
 * Reserves the next gap-free sequential invoice number for `year` atomically
 * inside the active PostgreSQL transaction.
 *
 * Uses `INSERT ... ON CONFLICT ("year") DO UPDATE ... RETURNING "lastNumber"` which
 * acquires a row-level exclusive lock in PostgreSQL, ensuring zero duplicates and zero gaps
 * under concurrent issuance requests. Resets automatically to 001 for each new calendar year.
 */
export async function reserveNextInvoiceNumber(
  tx: Prisma.TransactionClient,
  year: number
): Promise<{ year: number; sequenceNumber: number; invoiceNumber: string }> {
  const rows = await tx.$queryRaw<Array<{ lastNumber: number }>>`
    INSERT INTO "invoicing_sequences" ("year", "lastNumber", "updatedAt")
    VALUES (${year}, 1, NOW())
    ON CONFLICT ("year")
    DO UPDATE SET
      "lastNumber" = "invoicing_sequences"."lastNumber" + 1,
      "updatedAt" = NOW()
    RETURNING "lastNumber"
  `;

  const sequenceNumber = Number(rows[0]?.lastNumber ?? 1);
  return {
    year,
    sequenceNumber,
    invoiceNumber: formatInvoiceNumber(year, sequenceNumber),
  };
}

// ============================================================================
// Invoice Serialization & PDF Data Builders
// ============================================================================

function toCompanySnapshot(company: SerializedCompanySettings): CompanySnapshot {
  return {
    legalName: company.legalName,
    street: company.street,
    postalCode: company.postalCode,
    city: company.city,
    country: company.country,
    managingDirector: company.managingDirector,
    registerCourt: company.registerCourt,
    registerNumber: company.registerNumber,
    taxNumber: company.taxNumber,
    vatId: company.vatId,
    email: company.email,
    phone: company.phone,
    website: company.website,
    bankAccountHolder: company.bankAccountHolder,
    bankIban: company.bankIban,
    bankBic: company.bankBic,
    bankName: company.bankName,
    logoPath: company.logoPath,
  };
}

function toCustomerSnapshot(customer: {
  id: string;
  customerNumber: string | null;
  name: string;
  companyName: string | null;
  contactPerson: string | null;
  street: string;
  postalCode: string;
  city: string;
  country: string;
  email: string | null;
  phone: string | null;
  vatId: string | null;
}): CustomerSnapshot {
  return {
    id: customer.id,
    customerNumber: customer.customerNumber,
    name: customer.name,
    companyName: customer.companyName,
    contactPerson: customer.contactPerson,
    street: customer.street,
    postalCode: customer.postalCode,
    city: customer.city,
    country: customer.country,
    email: customer.email,
    phone: customer.phone,
    vatId: customer.vatId,
  };
}

export function buildPdfDocumentDataFromInvoice(params: {
  invoice: {
    invoiceNumber: string | null;
    type: "INVOICE" | "CANCELLATION";
    status: "DRAFT" | "ISSUED" | "PAID" | "CANCELLED";
    currency: string;
    taxTreatment: TaxTreatment;
    issueDate: Date | null;
    serviceDate: Date | null;
    servicePeriodStart: Date | null;
    servicePeriodEnd: Date | null;
    dueDate: Date | null;
    paymentTermsDays: number;
    customerReference: string | null;
    buyerReference: string | null;
    paymentReference: string | null;
    notes: string | null;
    introText: string;
    outroText: string;
    taxLegalNotice: string | null;
    subtotalNetCents: number;
    totalDiscountCents: number;
    totalVatCents: number;
    totalGrossCents: number;
    taxBreakdownJson: unknown;
    issuerSnapshotJson: unknown;
    customerSnapshotJson: unknown;
    itemsSnapshotJson: unknown;
    correctedInvoice?: { invoiceNumber: string | null } | null;
    customer: CustomerSnapshot;
    items: Array<{
      position: number;
      description: string;
      quantity: { toString(): string } | string | number;
      unit: string;
      unitCode: string;
      unitPriceNetCents: number;
      discountPercent: { toString(): string } | string | number;
      discountCents: number;
      vatRateBps: number;
      vatCategoryCode: string;
      lineNetCents: number;
    }>;
  };
  liveCompany: SerializedCompanySettings;
}): InvoicePdfDocumentData {
  const { invoice, liveCompany } = params;
  const isDraft = invoice.status === "DRAFT";

  const issuer =
    (!isDraft && invoice.issuerSnapshotJson
      ? (invoice.issuerSnapshotJson as CompanySnapshot)
      : toCompanySnapshot(liveCompany));

  const customer =
    (!isDraft && invoice.customerSnapshotJson
      ? (invoice.customerSnapshotJson as CustomerSnapshot)
      : toCustomerSnapshot(invoice.customer));

  const items: InvoiceItemSnapshot[] =
    !isDraft && Array.isArray(invoice.itemsSnapshotJson)
      ? (invoice.itemsSnapshotJson as InvoiceItemSnapshot[])
      : invoice.items
          .slice()
          .sort((a, b) => a.position - b.position)
          .map((item) => ({
            position: item.position,
            description: item.description,
            quantity: String(item.quantity),
            unit: item.unit,
            unitCode: item.unitCode,
            unitPriceNetCents: item.unitPriceNetCents,
            discountPercent: String(item.discountPercent),
            discountCents: item.discountCents,
            vatRateBps: item.vatRateBps,
            vatCategoryCode: item.vatCategoryCode as InvoiceItemSnapshot["vatCategoryCode"],
            lineNetCents: item.lineNetCents,
          }));

  const taxBreakdown: TaxBreakdownBucket[] = Array.isArray(invoice.taxBreakdownJson)
    ? (invoice.taxBreakdownJson as TaxBreakdownBucket[])
    : [];

  const todayIso = toIsoDateOnly(new Date())!;
  const issueDateIso = toIsoDateOnly(invoice.issueDate) ?? todayIso;
  const dueDateIso =
    toIsoDateOnly(invoice.dueDate) ??
    toIsoDateOnly(addDaysUtc(parseIsoDateOnly(issueDateIso), invoice.paymentTermsDays));

  const invoiceNumber = invoice.invoiceNumber ?? "ENTWURF";
  const paymentReference =
    invoice.paymentReference ?? (isDraft ? "ENTWURF" : invoiceNumber);

  return {
    invoiceNumber,
    isDraft,
    type: invoice.type,
    currency: invoice.currency,
    taxTreatment: invoice.taxTreatment,
    issueDate: issueDateIso,
    serviceDate: toIsoDateOnly(invoice.serviceDate),
    servicePeriodStart: toIsoDateOnly(invoice.servicePeriodStart),
    servicePeriodEnd: toIsoDateOnly(invoice.servicePeriodEnd),
    dueDate: dueDateIso,
    paymentTermsDays: invoice.paymentTermsDays,
    customerReference: invoice.customerReference,
    buyerReference: invoice.buyerReference,
    paymentReference,
    notes: invoice.notes,
    introText: invoice.introText,
    outroText: invoice.outroText,
    taxLegalNotice: invoice.taxLegalNotice,
    correctedInvoiceNumber: invoice.correctedInvoice?.invoiceNumber ?? null,
    issuer,
    customer,
    items,
    taxBreakdown,
    subtotalNetCents: invoice.subtotalNetCents,
    totalDiscountCents: invoice.totalDiscountCents,
    totalVatCents: invoice.totalVatCents,
    totalGrossCents: invoice.totalGrossCents,
  };
}

// ============================================================================
// Invoice CRUD (Drafts) & Queries
// ============================================================================

export async function listInvoices(
  db: DbClient = prisma
): Promise<SerializedInvoiceListItem[]> {
  const rows = await db.invoice.findMany({
    orderBy: [{ createdAt: "desc" }],
    include: {
      customer: {
        select: { name: true, companyName: true },
      },
      correctedInvoice: {
        select: { invoiceNumber: true },
      },
    },
    take: 250,
  });

  const now = new Date();
  return rows.map((inv) => {
    const snapCustomer = inv.customerSnapshotJson as CustomerSnapshot | null;
    const customerName = snapCustomer?.name ?? inv.customer.name;
    const customerCompany = snapCustomer?.companyName ?? inv.customer.companyName;

    return {
      id: inv.id,
      invoiceNumber: inv.invoiceNumber,
      type: inv.type,
      status: inv.status,
      displayStatus: computeDisplayStatus({
        status: inv.status,
        type: inv.type,
        dueDate: inv.dueDate,
        now,
      }),
      currency: inv.currency,
      taxTreatment: inv.taxTreatment,
      issueDate: toIsoDateOnly(inv.issueDate),
      dueDate: toIsoDateOnly(inv.dueDate),
      customerName,
      customerCompany,
      subtotalNetCents: inv.subtotalNetCents,
      totalVatCents: inv.totalVatCents,
      totalGrossCents: inv.totalGrossCents,
      paidAmountCents: inv.paidAmountCents,
      correctedInvoiceNumber: inv.correctedInvoice?.invoiceNumber ?? null,
      createdAtIso: inv.createdAt.toISOString(),
      issuedAtIso: inv.issuedAt?.toISOString() ?? null,
    };
  });
}

export async function getInvoiceDetail(
  id: string,
  db: DbClient = prisma
): Promise<SerializedInvoiceDetail | null> {
  const inv = await db.invoice.findUnique({
    where: { id },
    include: {
      customer: true,
      items: { orderBy: { position: "asc" } },
      payments: { orderBy: { paidAt: "desc" } },
      auditLogs: { orderBy: { createdAt: "desc" } },
      correctedInvoice: { select: { id: true, invoiceNumber: true } },
      corrections: {
        select: {
          id: true,
          invoiceNumber: true,
          totalGrossCents: true,
          issuedAt: true,
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!inv) return null;

  const isDraft = inv.status === "DRAFT";
  const customerSnap: CustomerSnapshot =
    !isDraft && inv.customerSnapshotJson
      ? (inv.customerSnapshotJson as unknown as CustomerSnapshot)
      : toCustomerSnapshot(inv.customer);
  const issuerSnap: CompanySnapshot | null =
    !isDraft && inv.issuerSnapshotJson
      ? (inv.issuerSnapshotJson as unknown as CompanySnapshot)
      : null;

  const items: InvoiceItemSnapshot[] =
    !isDraft && Array.isArray(inv.itemsSnapshotJson)
      ? (inv.itemsSnapshotJson as unknown as InvoiceItemSnapshot[])
      : inv.items.map((it) => ({
          position: it.position,
          description: it.description,
          quantity: it.quantity.toString(),
          unit: it.unit,
          unitCode: it.unitCode,
          unitPriceNetCents: it.unitPriceNetCents,
          discountPercent: it.discountPercent.toString(),
          discountCents: it.discountCents,
          vatRateBps: it.vatRateBps,
          vatCategoryCode: it.vatCategoryCode as InvoiceItemSnapshot["vatCategoryCode"],
          lineNetCents: it.lineNetCents,
        }));

  return {
    id: inv.id,
    invoiceNumber: inv.invoiceNumber,
    type: inv.type,
    status: inv.status,
    displayStatus: computeDisplayStatus({
      status: inv.status,
      type: inv.type,
      dueDate: inv.dueDate,
    }),
    currency: inv.currency,
    taxTreatment: inv.taxTreatment,
    issueDate: toIsoDateOnly(inv.issueDate),
    serviceDate: toIsoDateOnly(inv.serviceDate),
    servicePeriodStart: toIsoDateOnly(inv.servicePeriodStart),
    servicePeriodEnd: toIsoDateOnly(inv.servicePeriodEnd),
    dueDate: toIsoDateOnly(inv.dueDate),
    paymentTermsDays: inv.paymentTermsDays,
    customerReference: inv.customerReference,
    buyerReference: inv.buyerReference,
    paymentReference: inv.paymentReference,
    paymentMeansCode: inv.paymentMeansCode,
    en16931Profile: inv.en16931Profile,
    notes: inv.notes,
    introText: inv.introText,
    outroText: inv.outroText,
    taxLegalNotice: inv.taxLegalNotice,
    customerName: customerSnap.name,
    customerCompany: customerSnap.companyName,
    subtotalNetCents: inv.subtotalNetCents,
    totalDiscountCents: inv.totalDiscountCents,
    totalVatCents: inv.totalVatCents,
    totalGrossCents: inv.totalGrossCents,
    paidAmountCents: inv.paidAmountCents,
    taxBreakdown: Array.isArray(inv.taxBreakdownJson)
      ? (inv.taxBreakdownJson as unknown as TaxBreakdownBucket[])
      : [],
    customerId: inv.customerId,
    customer: customerSnap,
    issuer: issuerSnap,
    correctedInvoiceId: inv.correctedInvoiceId,
    correctedInvoiceNumber: inv.correctedInvoice?.invoiceNumber ?? null,
    corrections: inv.corrections.map((c) => ({
      id: c.id,
      invoiceNumber: c.invoiceNumber,
      totalGrossCents: c.totalGrossCents,
      issuedAtIso: c.issuedAt?.toISOString() ?? null,
    })),
    items,
    payments: inv.payments.map((p) => ({
      id: p.id,
      paidAt: toIsoDateOnly(p.paidAt) ?? "",
      amountCents: p.amountCents,
      method: p.method,
      reference: p.reference,
      notes: p.notes,
      recordedBy: p.recordedBy,
      createdAtIso: p.createdAt.toISOString(),
    })),
    auditLogs: inv.auditLogs.map((a) => ({
      id: a.id,
      action: a.action,
      actor: a.actor,
      metadata:
        a.metadata && typeof a.metadata === "object"
          ? (a.metadata as Record<string, unknown>)
          : null,
      createdAtIso: a.createdAt.toISOString(),
    })),
    pdfSha256: inv.pdfSha256,
    hasStoredPdf: Boolean(inv.pdfBytes && inv.pdfBytes.length > 0),
    createdAtIso: inv.createdAt.toISOString(),
    issuedAtIso: inv.issuedAt?.toISOString() ?? null,
    paidAtIso: inv.paidAt?.toISOString() ?? null,
    cancelledAtIso: inv.cancelledAt?.toISOString() ?? null,
  };
}

export async function createInvoiceDraft(
  rawInput: unknown,
  actor: string = "admin",
  db: PrismaClient = prisma
): Promise<SerializedInvoiceDetail> {
  const parsed = InvoiceDraftInputSchema.safeParse(rawInput);
  if (!parsed.success) {
    throw new InvoicingError(
      parsed.error.issues[0]?.message ?? "Ungültige Rechnungsdaten.",
      400,
      "VALIDATION_ERROR"
    );
  }
  const input = parsed.data;

  const [company, customer] = await Promise.all([
    getOrInitCompanySettings(db),
    db.billingCustomer.findUnique({ where: { id: input.customerId } }),
  ]);

  if (!customer) {
    throw new InvoicingError("Ausgewählter Kunde nicht gefunden.", 404, "NOT_FOUND");
  }

  const calc = calculateInvoiceTotals(
    input.items.map((it) => ({
      quantity: it.quantity,
      unitPriceNetCents: it.unitPriceNetCents,
      discountPercent: it.discountPercent,
      discountCents: it.discountCents,
      vatRateBps: it.vatRateBps,
    })),
    input.taxTreatment
  );

  const issueDate = input.issueDate ? parseIsoDateOnly(input.issueDate) : null;
  const dueDate = issueDate
    ? addDaysUtc(issueDate, input.paymentTermsDays)
    : null;
  const taxLegalNotice =
    input.taxLegalNotice !== undefined
      ? input.taxLegalNotice?.trim() || null
      : resolveDefaultTaxLegalNotice(input.taxTreatment, company);

  const introText =
    input.introText?.trim() ||
    (customer.contactPerson
      ? buildPersonalizedIntroText(customer.contactPerson)
      : DEFAULT_INVOICE_INTRO_TEXT);
  const outroText = input.outroText?.trim() || DEFAULT_INVOICE_OUTRO_TEXT;

  const createdId = await db.$transaction(async (tx) => {
    const inv = await tx.invoice.create({
      data: {
        invoiceNumber: null, // NEVER assign a sequential number to a draft
        type: "INVOICE",
        status: "DRAFT",
        currency: "EUR",
        taxTreatment: input.taxTreatment,
        issueDate,
        serviceDate: input.serviceDate ? parseIsoDateOnly(input.serviceDate) : null,
        servicePeriodStart: input.servicePeriodStart
          ? parseIsoDateOnly(input.servicePeriodStart)
          : null,
        servicePeriodEnd: input.servicePeriodEnd
          ? parseIsoDateOnly(input.servicePeriodEnd)
          : null,
        dueDate,
        paymentTermsDays: input.paymentTermsDays,
        customerReference: input.customerReference?.trim() || null,
        buyerReference: input.buyerReference?.trim() || null,
        notes: input.notes?.trim() || null,
        introText,
        outroText,
        taxLegalNotice,
        subtotalNetCents: calc.subtotalNetCents,
        totalDiscountCents: calc.totalDiscountCents,
        totalVatCents: calc.totalVatCents,
        totalGrossCents: calc.totalGrossCents,
        taxBreakdownJson: calc.taxBreakdown as unknown as Prisma.InputJsonValue,
        customerId: customer.id,
        items: {
          create: input.items.map((it, idx) => {
            const lineCalc = calc.items[idx];
            return {
              position: idx + 1,
              description: it.description,
              quantity: it.quantity,
              unit: it.unit,
              unitCode: resolveUnitCode(it.unit, it.unitCode),
              unitPriceNetCents: it.unitPriceNetCents,
              discountPercent: it.discountPercent,
              discountCents: lineCalc.discountCents,
              vatRateBps: lineCalc.effectiveVatRateBps,
              vatCategoryCode: lineCalc.vatCategoryCode,
              lineNetCents: lineCalc.lineNetCents,
            };
          }),
        },
        auditLogs: {
          create: {
            action: "CREATED",
            actor,
            metadata: {
              customerId: customer.id,
              itemsCount: input.items.length,
              totalGrossCents: calc.totalGrossCents,
            },
          },
        },
      },
      select: { id: true },
    });
    return inv.id;
  }, INVOICING_TX_OPTIONS);

  const detail = await getInvoiceDetail(createdId, db);
  if (!detail) {
    throw new InvoicingError("Entwurf konnte nicht geladen werden.", 500, "INTERNAL");
  }
  return detail;
}

export async function updateInvoiceDraft(
  id: string,
  rawInput: unknown,
  actor: string = "admin",
  db: PrismaClient = prisma
): Promise<SerializedInvoiceDetail> {
  const existing = await db.invoice.findUnique({
    where: { id },
    select: { id: true, status: true, invoiceNumber: true },
  });

  if (!existing) {
    throw new InvoicingError("Rechnung nicht gefunden.", 404, "NOT_FOUND");
  }

  // GoBD server-level enforcement: issued/paid/cancelled invoices are strictly immutable
  if (existing.status !== "DRAFT") {
    throw new InvoicingError(
      `GoBD-Schutz: Ausgestellte Rechnung (${existing.invoiceNumber ?? id}) darf nicht mehr bearbeitet werden. Bitte erstellen Sie eine Stornorechnung.`,
      409,
      "INVOICE_IMMUTABLE"
    );
  }

  const parsed = InvoiceDraftInputSchema.safeParse(rawInput);
  if (!parsed.success) {
    throw new InvoicingError(
      parsed.error.issues[0]?.message ?? "Ungültige Rechnungsdaten.",
      400,
      "VALIDATION_ERROR"
    );
  }
  const input = parsed.data;

  const [company, customer] = await Promise.all([
    getOrInitCompanySettings(db),
    db.billingCustomer.findUnique({ where: { id: input.customerId } }),
  ]);
  if (!customer) {
    throw new InvoicingError("Ausgewählter Kunde nicht gefunden.", 404, "NOT_FOUND");
  }

  const calc = calculateInvoiceTotals(
    input.items.map((it) => ({
      quantity: it.quantity,
      unitPriceNetCents: it.unitPriceNetCents,
      discountPercent: it.discountPercent,
      discountCents: it.discountCents,
      vatRateBps: it.vatRateBps,
    })),
    input.taxTreatment
  );

  const issueDate = input.issueDate ? parseIsoDateOnly(input.issueDate) : null;
  const dueDate = issueDate
    ? addDaysUtc(issueDate, input.paymentTermsDays)
    : null;
  const taxLegalNotice =
    input.taxLegalNotice !== undefined
      ? input.taxLegalNotice?.trim() || null
      : resolveDefaultTaxLegalNotice(input.taxTreatment, company);

  await db.$transaction(async (tx) => {
    const current = await tx.invoice.findUnique({
      where: { id },
      select: { status: true },
    });
    if (!current || current.status !== "DRAFT") {
      throw new InvoicingError(
        "GoBD-Schutz: Rechnung wurde bereits ausgestellt und kann nicht mehr bearbeitet werden.",
        409,
        "INVOICE_IMMUTABLE"
      );
    }

    await tx.invoiceItem.deleteMany({ where: { invoiceId: id } });
    await tx.invoice.update({
      where: { id },
      data: {
        customerId: customer.id,
        taxTreatment: input.taxTreatment,
        issueDate,
        serviceDate: input.serviceDate ? parseIsoDateOnly(input.serviceDate) : null,
        servicePeriodStart: input.servicePeriodStart
          ? parseIsoDateOnly(input.servicePeriodStart)
          : null,
        servicePeriodEnd: input.servicePeriodEnd
          ? parseIsoDateOnly(input.servicePeriodEnd)
          : null,
        dueDate,
        paymentTermsDays: input.paymentTermsDays,
        customerReference: input.customerReference?.trim() || null,
        buyerReference: input.buyerReference?.trim() || null,
        notes: input.notes?.trim() || null,
        introText: input.introText?.trim() || DEFAULT_INVOICE_INTRO_TEXT,
        outroText: input.outroText?.trim() || DEFAULT_INVOICE_OUTRO_TEXT,
        taxLegalNotice,
        subtotalNetCents: calc.subtotalNetCents,
        totalDiscountCents: calc.totalDiscountCents,
        totalVatCents: calc.totalVatCents,
        totalGrossCents: calc.totalGrossCents,
        taxBreakdownJson: calc.taxBreakdown as unknown as Prisma.InputJsonValue,
        items: {
          create: input.items.map((it, idx) => {
            const lineCalc = calc.items[idx];
            return {
              position: idx + 1,
              description: it.description,
              quantity: it.quantity,
              unit: it.unit,
              unitCode: resolveUnitCode(it.unit, it.unitCode),
              unitPriceNetCents: it.unitPriceNetCents,
              discountPercent: it.discountPercent,
              discountCents: lineCalc.discountCents,
              vatRateBps: lineCalc.effectiveVatRateBps,
              vatCategoryCode: lineCalc.vatCategoryCode,
              lineNetCents: lineCalc.lineNetCents,
            };
          }),
        },
        auditLogs: {
          create: {
            action: "UPDATED",
            actor,
            metadata: {
              itemsCount: input.items.length,
              totalGrossCents: calc.totalGrossCents,
            },
          },
        },
      },
    });
  }, INVOICING_TX_OPTIONS);

  const detail = await getInvoiceDetail(id, db);
  if (!detail) {
    throw new InvoicingError("Entwurf nicht gefunden.", 404, "NOT_FOUND");
  }
  return detail;
}

export async function deleteInvoiceDraft(
  id: string,
  db: PrismaClient = prisma
): Promise<void> {
  const existing = await db.invoice.findUnique({
    where: { id },
    select: { id: true, status: true, invoiceNumber: true },
  });
  if (!existing) {
    throw new InvoicingError("Rechnung nicht gefunden.", 404, "NOT_FOUND");
  }
  if (existing.status !== "DRAFT") {
    throw new InvoicingError(
      `GoBD-Schutz: Ausgestellte Rechnung (${existing.invoiceNumber ?? id}) darf nicht gelöscht werden. Erstellen Sie stattdessen eine Stornorechnung.`,
      409,
      "INVOICE_IMMUTABLE"
    );
  }
  await db.invoice.delete({ where: { id } });
}

// ============================================================================
// Issuing (Draft -> Issued) with Atomic Sequential Number, Snapshots & PDF
// ============================================================================

export async function issueInvoice(
  id: string,
  options: {
    renderPdf: PdfRenderFn;
    actor?: string;
    issueDateOverride?: string;
    db?: PrismaClient;
  }
): Promise<SerializedInvoiceDetail> {
  const db = options.db ?? prisma;
  const actor = options.actor ?? "admin";

  const issuedId = await db.$transaction(async (tx) => {
    const invoice = await tx.invoice.findUnique({
      where: { id },
      include: {
        customer: true,
        items: { orderBy: { position: "asc" } },
        correctedInvoice: { select: { invoiceNumber: true } },
      },
    });

    if (!invoice) {
      throw new InvoicingError("Rechnung nicht gefunden.", 404, "NOT_FOUND");
    }
    if (invoice.status !== "DRAFT") {
      throw new InvoicingError(
        `Rechnung ${invoice.invoiceNumber ?? id} wurde bereits ausgestellt.`,
        409,
        "ALREADY_ISSUED"
      );
    }

    const company = await getOrInitCompanySettings(tx);
    const effectiveTaxLegalNotice =
      invoice.taxLegalNotice?.trim() ||
      resolveDefaultTaxLegalNotice(invoice.taxTreatment, company);

    const hasValidItemAmounts =
      invoice.items.length > 0 &&
      invoice.items.every(
        (it) => it.description.trim().length > 0 && Number(it.quantity.toString()) > 0
      );

    const issues = validateInvoiceForIssuance({
      company,
      customer: invoice.customer,
      taxTreatment: invoice.taxTreatment,
      serviceDate: invoice.serviceDate,
      servicePeriodStart: invoice.servicePeriodStart,
      servicePeriodEnd: invoice.servicePeriodEnd,
      itemsCount: invoice.items.length,
      hasValidItemAmounts,
      taxLegalNotice: effectiveTaxLegalNotice,
    });

    if (issues.length > 0) {
      throw new InvoicingError(
        `Rechnung kann nicht ausgestellt werden (${issues.length} Pflichtfeld${issues.length === 1 ? "" : "er"} unvollständig): ${issues.map((i) => i.message).join(" ")}`,
        422,
        "INCOMPLETE_MANDATORY_FIELDS",
        issues
      );
    }

    // Recompute totals authoritatively before locking snapshot
    const calc = calculateInvoiceTotals(
      invoice.items.map((it) => ({
        quantity: it.quantity.toString(),
        unitPriceNetCents: it.unitPriceNetCents,
        discountPercent: it.discountPercent.toString(),
        discountCents: 0, // discountPercent is authoritative; if pure fixed discount was stored without pct, handle below
        vatRateBps: it.vatRateBps,
      })).map((itemInput, idx) => {
        const orig = invoice.items[idx];
        const pct = Number(orig.discountPercent.toString());
        return {
          ...itemInput,
          discountPercent: pct > 0 ? orig.discountPercent.toString() : 0,
          discountCents: pct > 0 ? 0 : orig.discountCents,
        };
      }),
      invoice.taxTreatment
    );

    const issueDate = options.issueDateOverride
      ? parseIsoDateOnly(options.issueDateOverride)
      : invoice.issueDate ?? parseIsoDateOnly(toIsoDateOnly(new Date())!);
    const dueDate = addDaysUtc(issueDate, invoice.paymentTermsDays);
    const issueYear = issueDate.getUTCFullYear();

    // Reserve gap-free sequential number ONLY now inside transaction
    const seq = await reserveNextInvoiceNumber(tx, issueYear);

    const issuerSnapshot = toCompanySnapshot(company);
    const customerSnapshot = toCustomerSnapshot(invoice.customer);
    const itemsSnapshot: InvoiceItemSnapshot[] = invoice.items.map((it, idx) => {
      const lineCalc = calc.items[idx];
      return {
        position: idx + 1,
        description: it.description,
        quantity: it.quantity.toString(),
        unit: it.unit,
        unitCode: it.unitCode,
        unitPriceNetCents: it.unitPriceNetCents,
        discountPercent: it.discountPercent.toString(),
        discountCents: lineCalc.discountCents,
        vatRateBps: lineCalc.effectiveVatRateBps,
        vatCategoryCode: lineCalc.vatCategoryCode,
        lineNetCents: lineCalc.lineNetCents,
      };
    });

    const pdfDocData: InvoicePdfDocumentData = {
      invoiceNumber: seq.invoiceNumber,
      isDraft: false,
      type: invoice.type,
      currency: invoice.currency,
      taxTreatment: invoice.taxTreatment,
      issueDate: toIsoDateOnly(issueDate)!,
      serviceDate: toIsoDateOnly(invoice.serviceDate),
      servicePeriodStart: toIsoDateOnly(invoice.servicePeriodStart),
      servicePeriodEnd: toIsoDateOnly(invoice.servicePeriodEnd),
      dueDate: toIsoDateOnly(dueDate),
      paymentTermsDays: invoice.paymentTermsDays,
      customerReference: invoice.customerReference,
      buyerReference: invoice.buyerReference,
      paymentReference: seq.invoiceNumber,
      notes: invoice.notes,
      introText: invoice.introText,
      outroText: invoice.outroText,
      taxLegalNotice: effectiveTaxLegalNotice,
      correctedInvoiceNumber: invoice.correctedInvoice?.invoiceNumber ?? null,
      issuer: issuerSnapshot,
      customer: customerSnapshot,
      items: itemsSnapshot,
      taxBreakdown: calc.taxBreakdown,
      subtotalNetCents: calc.subtotalNetCents,
      totalDiscountCents: calc.totalDiscountCents,
      totalVatCents: calc.totalVatCents,
      totalGrossCents: calc.totalGrossCents,
    };

    const pdfUint8 = await options.renderPdf(pdfDocData);
    const pdfBuffer = Buffer.from(pdfUint8);
    const pdfSha256 = crypto
      .createHash("sha256")
      .update(pdfBuffer)
      .digest("hex");

    await tx.invoice.update({
      where: { id: invoice.id },
      data: {
        invoiceNumber: seq.invoiceNumber,
        invoiceYear: seq.year,
        sequenceNumber: seq.sequenceNumber,
        status: "ISSUED",
        issueDate,
        dueDate,
        paymentReference: seq.invoiceNumber,
        taxLegalNotice: effectiveTaxLegalNotice,
        subtotalNetCents: calc.subtotalNetCents,
        totalDiscountCents: calc.totalDiscountCents,
        totalVatCents: calc.totalVatCents,
        totalGrossCents: calc.totalGrossCents,
        taxBreakdownJson: calc.taxBreakdown as unknown as Prisma.InputJsonValue,
        issuedAt: new Date(),
        issuerSnapshotJson: issuerSnapshot as unknown as Prisma.InputJsonValue,
        customerSnapshotJson: customerSnapshot as unknown as Prisma.InputJsonValue,
        itemsSnapshotJson: itemsSnapshot as unknown as Prisma.InputJsonValue,
        pdfBytes: pdfBuffer,
        pdfSha256,
        auditLogs: {
          create: {
            action: "ISSUED",
            actor,
            metadata: {
              invoiceNumber: seq.invoiceNumber,
              totalGrossCents: calc.totalGrossCents,
              pdfSha256,
            },
          },
        },
      },
    });

    return invoice.id;
  }, INVOICING_TX_OPTIONS);

  const detail = await getInvoiceDetail(issuedId, db);
  if (!detail) {
    throw new InvoicingError("Ausgestellte Rechnung nicht gefunden.", 500, "INTERNAL");
  }
  return detail;
}

// ============================================================================
// Payment Recording (Issued -> Paid)
// ============================================================================

export async function recordInvoicePayment(
  invoiceId: string,
  rawInput: unknown,
  actor: string = "admin",
  db: PrismaClient = prisma
): Promise<SerializedInvoiceDetail> {
  const parsed = RecordPaymentInputSchema.safeParse(rawInput);
  if (!parsed.success) {
    throw new InvoicingError(
      parsed.error.issues[0]?.message ?? "Ungültige Zahlungsdaten.",
      400,
      "VALIDATION_ERROR"
    );
  }
  const input = parsed.data;

  await db.$transaction(async (tx) => {
    const invoice = await tx.invoice.findUnique({
      where: { id: invoiceId },
      select: {
        id: true,
        status: true,
        type: true,
        invoiceNumber: true,
        totalGrossCents: true,
        paidAmountCents: true,
      },
    });
    if (!invoice) {
      throw new InvoicingError("Rechnung nicht gefunden.", 404, "NOT_FOUND");
    }
    if (invoice.status === "DRAFT") {
      throw new InvoicingError(
        "Zahlungen können nur für ausgestellte Rechnungen erfasst werden.",
        409,
        "INVALID_STATE"
      );
    }
    if (invoice.status === "CANCELLED" || invoice.type === "CANCELLATION") {
      throw new InvoicingError(
        "Für stornierte Rechnungen oder Stornorechnungen kann keine Zahlung gebucht werden.",
        409,
        "INVALID_STATE"
      );
    }

    const paidAtDate = parseIsoDateOnly(input.paidAt);
    const nextPaidAmountCents = invoice.paidAmountCents + input.amountCents;
    const isFullyPaid = nextPaidAmountCents >= invoice.totalGrossCents;

    await tx.invoicePayment.create({
      data: {
        invoiceId: invoice.id,
        paidAt: paidAtDate,
        amountCents: input.amountCents,
        method: input.method,
        reference: input.reference?.trim() || null,
        notes: input.notes?.trim() || null,
        recordedBy: actor,
      },
    });

    await tx.invoice.update({
      where: { id: invoice.id },
      data: {
        paidAmountCents: nextPaidAmountCents,
        status: isFullyPaid ? "PAID" : invoice.status,
        paidAt: isFullyPaid ? new Date() : undefined,
        auditLogs: {
          create: {
            action: "PAYMENT_RECORDED",
            actor,
            metadata: {
              paidAt: input.paidAt,
              amountCents: input.amountCents,
              method: input.method,
              reference: input.reference?.trim() || null,
              totalPaidCents: nextPaidAmountCents,
              markedPaid: isFullyPaid,
            },
          },
        },
      },
    });
  }, INVOICING_TX_OPTIONS);

  const detail = await getInvoiceDetail(invoiceId, db);
  if (!detail) {
    throw new InvoicingError("Rechnung nicht gefunden.", 404, "NOT_FOUND");
  }
  return detail;
}

// ============================================================================
// GoBD Cancellation (Stornorechnung / Korrekturrechnung)
// ============================================================================

export async function createStornoInvoice(
  originalInvoiceId: string,
  options: {
    renderPdf: PdfRenderFn;
    reason?: string;
    actor?: string;
    issueDateOverride?: string;
    db?: PrismaClient;
  }
): Promise<{
  original: SerializedInvoiceDetail;
  storno: SerializedInvoiceDetail;
}> {
  const db = options.db ?? prisma;
  const actor = options.actor ?? "admin";
  const reason = options.reason?.trim() || null;

  const stornoId = await db.$transaction(async (tx) => {
    const original = await tx.invoice.findUnique({
      where: { id: originalInvoiceId },
      include: {
        customer: true,
        items: { orderBy: { position: "asc" } },
      },
    });

    if (!original) {
      throw new InvoicingError(
        "Originalrechnung nicht gefunden.",
        404,
        "NOT_FOUND"
      );
    }
    if (original.status === "DRAFT") {
      throw new InvoicingError(
        "Entwürfe benötigen keine Stornorechnung und können direkt gelöscht werden.",
        409,
        "INVALID_STATE"
      );
    }
    if (original.type === "CANCELLATION") {
      throw new InvoicingError(
        "Eine Stornorechnung kann nicht erneut storniert werden.",
        409,
        "INVALID_STATE"
      );
    }
    if (original.status === "CANCELLED") {
      throw new InvoicingError(
        `Rechnung ${original.invoiceNumber} wurde bereits storniert.`,
        409,
        "ALREADY_CANCELLED"
      );
    }

    const company = await getOrInitCompanySettings(tx);
    const issuerSnapshot: CompanySnapshot = original.issuerSnapshotJson
      ? (original.issuerSnapshotJson as unknown as CompanySnapshot)
      : toCompanySnapshot(company);
    const customerSnapshot: CustomerSnapshot = original.customerSnapshotJson
      ? (original.customerSnapshotJson as unknown as CustomerSnapshot)
      : toCustomerSnapshot(original.customer);

    const originalItems: InvoiceItemSnapshot[] = Array.isArray(
      original.itemsSnapshotJson
    )
      ? (original.itemsSnapshotJson as unknown as InvoiceItemSnapshot[])
      : original.items.map((it) => ({
          position: it.position,
          description: it.description,
          quantity: it.quantity.toString(),
          unit: it.unit,
          unitCode: it.unitCode,
          unitPriceNetCents: it.unitPriceNetCents,
          discountPercent: it.discountPercent.toString(),
          discountCents: it.discountCents,
          vatRateBps: it.vatRateBps,
          vatCategoryCode: it.vatCategoryCode as InvoiceItemSnapshot["vatCategoryCode"],
          lineNetCents: it.lineNetCents,
        }));

    const originalBreakdown: TaxBreakdownBucket[] = Array.isArray(
      original.taxBreakdownJson
    )
      ? (original.taxBreakdownJson as unknown as TaxBreakdownBucket[])
      : [];

    // Exact cent-for-cent negation of every line & tax bucket
    const negatedItems: InvoiceItemSnapshot[] = originalItems.map((it) => {
      const qtyStr = it.quantity.startsWith("-")
        ? it.quantity
        : `-${it.quantity}`;
      return {
        ...it,
        quantity: qtyStr,
        discountCents: -it.discountCents,
        lineNetCents: -it.lineNetCents,
      };
    });

    const negatedBreakdown: TaxBreakdownBucket[] = originalBreakdown.map((b) => ({
      ...b,
      netCents: -b.netCents,
      vatCents: -b.vatCents,
      grossCents: -b.grossCents,
    }));

    const subtotalNetCents = -original.subtotalNetCents;
    const totalDiscountCents = -original.totalDiscountCents;
    const totalVatCents = -original.totalVatCents;
    const totalGrossCents = -original.totalGrossCents;

    const issueDate = options.issueDateOverride
      ? parseIsoDateOnly(options.issueDateOverride)
      : parseIsoDateOnly(toIsoDateOnly(new Date())!);
    const issueYear = issueDate.getUTCFullYear();

    // Reserve a brand-new sequential number for the Stornorechnung
    const seq = await reserveNextInvoiceNumber(tx, issueYear);

    const introText = `Sehr geehrte Damen und Herren,\n\nhiermit stornieren wir unsere Rechnung Nr. ${original.invoiceNumber} vom ${toIsoDateOnly(original.issueDate) ?? "—"} vollständig${reason ? ` (${reason})` : ""}.`;
    const outroText =
      "Diese Stornorechnung dient Ihren Buchhaltungsunterlagen. Etwaige bereits geleistete Zahlungen werden erstattet oder verrechnet.";

    const pdfDocData: InvoicePdfDocumentData = {
      invoiceNumber: seq.invoiceNumber,
      isDraft: false,
      type: "CANCELLATION",
      currency: original.currency,
      taxTreatment: original.taxTreatment,
      issueDate: toIsoDateOnly(issueDate)!,
      serviceDate: toIsoDateOnly(original.serviceDate),
      servicePeriodStart: toIsoDateOnly(original.servicePeriodStart),
      servicePeriodEnd: toIsoDateOnly(original.servicePeriodEnd),
      dueDate: toIsoDateOnly(issueDate),
      paymentTermsDays: 0,
      customerReference: original.customerReference,
      buyerReference: original.buyerReference,
      paymentReference: seq.invoiceNumber,
      notes: reason ? `Stornogrund: ${reason}` : original.notes,
      introText,
      outroText,
      taxLegalNotice: original.taxLegalNotice,
      correctedInvoiceNumber: original.invoiceNumber,
      issuer: issuerSnapshot,
      customer: customerSnapshot,
      items: negatedItems,
      taxBreakdown: negatedBreakdown,
      subtotalNetCents,
      totalDiscountCents,
      totalVatCents,
      totalGrossCents,
    };

    const pdfUint8 = await options.renderPdf(pdfDocData);
    const pdfBuffer = Buffer.from(pdfUint8);
    const pdfSha256 = crypto
      .createHash("sha256")
      .update(pdfBuffer)
      .digest("hex");

    // Insert as DRAFT first (so GoBD item trigger allows inserting line items),
    // then atomically transition to ISSUED in the exact same transaction.
    const createdStorno = await tx.invoice.create({
      data: {
        invoiceNumber: null,
        type: "CANCELLATION",
        status: "DRAFT",
        currency: original.currency,
        taxTreatment: original.taxTreatment,
        issueDate,
        serviceDate: original.serviceDate,
        servicePeriodStart: original.servicePeriodStart,
        servicePeriodEnd: original.servicePeriodEnd,
        dueDate: issueDate,
        paymentTermsDays: 0,
        customerReference: original.customerReference,
        buyerReference: original.buyerReference,
        paymentReference: seq.invoiceNumber,
        notes: reason ? `Stornogrund: ${reason}` : original.notes,
        introText,
        outroText,
        taxLegalNotice: original.taxLegalNotice,
        subtotalNetCents,
        totalDiscountCents,
        totalVatCents,
        totalGrossCents,
        taxBreakdownJson: negatedBreakdown as unknown as Prisma.InputJsonValue,
        customerId: original.customerId,
        correctedInvoiceId: original.id,
        items: {
          create: negatedItems.map((it) => ({
            position: it.position,
            description: it.description,
            quantity: it.quantity,
            unit: it.unit,
            unitCode: it.unitCode,
            unitPriceNetCents: it.unitPriceNetCents,
            discountPercent: it.discountPercent,
            discountCents: it.discountCents,
            vatRateBps: it.vatRateBps,
            vatCategoryCode: it.vatCategoryCode,
            lineNetCents: it.lineNetCents,
          })),
        },
      },
      select: { id: true },
    });

    await tx.invoice.update({
      where: { id: createdStorno.id },
      data: {
        invoiceNumber: seq.invoiceNumber,
        invoiceYear: seq.year,
        sequenceNumber: seq.sequenceNumber,
        status: "ISSUED",
        issuedAt: new Date(),
        issuerSnapshotJson: issuerSnapshot as unknown as Prisma.InputJsonValue,
        customerSnapshotJson: customerSnapshot as unknown as Prisma.InputJsonValue,
        itemsSnapshotJson: negatedItems as unknown as Prisma.InputJsonValue,
        pdfBytes: pdfBuffer,
        pdfSha256,
        auditLogs: {
          create: {
            action: "STORNO_CREATED",
            actor,
            metadata: {
              invoiceNumber: seq.invoiceNumber,
              correctedInvoiceId: original.id,
              correctedInvoiceNumber: original.invoiceNumber,
              totalGrossCents,
              reason,
              pdfSha256,
            },
          },
        },
      },
    });

    // Mark original invoice as CANCELLED (allowed by GoBD trigger)
    await tx.invoice.update({
      where: { id: original.id },
      data: {
        status: "CANCELLED",
        cancelledAt: new Date(),
        auditLogs: {
          create: {
            action: "CANCELLED",
            actor,
            metadata: {
              stornoInvoiceId: createdStorno.id,
              stornoInvoiceNumber: seq.invoiceNumber,
              reason,
            },
          },
        },
      },
    });

    return createdStorno.id;
  }, INVOICING_TX_OPTIONS);

  const [originalDetail, stornoDetail] = await Promise.all([
    getInvoiceDetail(originalInvoiceId, db),
    getInvoiceDetail(stornoId, db),
  ]);

  if (!originalDetail || !stornoDetail) {
    throw new InvoicingError(
      "Stornorechnung konnte nicht geladen werden.",
      500,
      "INTERNAL"
    );
  }

  return { original: originalDetail, storno: stornoDetail };
}

export async function recordPdfDownloadAudit(
  invoiceId: string,
  actor: string = "admin",
  db: DbClient = prisma
): Promise<void> {
  await db.invoiceAuditLog.create({
    data: {
      invoiceId,
      action: "PDF_DOWNLOADED",
      actor,
      metadata: { downloadedAt: new Date().toISOString() },
    },
  });
}
