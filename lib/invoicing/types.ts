import type {
  InvoiceAuditAction,
  InvoiceStatus,
  InvoiceType,
  TaxTreatment,
} from "@prisma/client";
import type { TaxBreakdownBucket } from "./money";

export type ComputedInvoiceStatus = InvoiceStatus | "OVERDUE";

export interface CompanySnapshot {
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
}

export interface CustomerSnapshot {
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
}

export interface InvoiceItemSnapshot {
  position: number;
  description: string;
  quantity: string;
  unit: string;
  unitCode: string;
  unitPriceNetCents: number;
  discountPercent: string;
  discountCents: number;
  vatRateBps: number;
  vatCategoryCode: "S" | "Z" | "E" | "AE" | "G";
  lineNetCents: number;
}

export interface InvoicePdfDocumentData {
  invoiceNumber: string; // "ENTWURF" for drafts, "RE-YYYY-NNN" for issued
  isDraft: boolean;
  type: InvoiceType;
  currency: string;
  taxTreatment: TaxTreatment;
  issueDate: string; // YYYY-MM-DD
  serviceDate: string | null;
  servicePeriodStart: string | null;
  servicePeriodEnd: string | null;
  dueDate: string | null;
  paymentTermsDays: number;
  customerReference: string | null;
  buyerReference: string | null;
  paymentReference: string | null;
  notes: string | null;
  introText: string;
  outroText: string;
  taxLegalNotice: string | null;
  correctedInvoiceNumber: string | null;
  issuer: CompanySnapshot;
  customer: CustomerSnapshot;
  items: InvoiceItemSnapshot[];
  taxBreakdown: TaxBreakdownBucket[];
  subtotalNetCents: number;
  totalDiscountCents: number;
  totalVatCents: number;
  totalGrossCents: number;
}

export interface SerializedCompanySettings extends CompanySnapshot {
  id: string;
  defaultPaymentTermsDays: number;
  defaultTaxTreatment: TaxTreatment;
  kleinunternehmerNotice: string;
  reverseChargeNotice: string;
  exemptNonEuNotice: string;
  updatedAtIso: string;
}

export interface SerializedBillingCustomer {
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
  invoiceCount?: number;
  createdAtIso: string;
}

export interface SerializedInvoicePayment {
  id: string;
  paidAt: string; // YYYY-MM-DD
  amountCents: number;
  method: string;
  reference: string | null;
  notes: string | null;
  recordedBy: string;
  createdAtIso: string;
}

export interface SerializedInvoiceAuditLog {
  id: string;
  action: InvoiceAuditAction;
  actor: string;
  metadata: Record<string, unknown> | null;
  createdAtIso: string;
}

export interface SerializedInvoiceListItem {
  id: string;
  invoiceNumber: string | null;
  type: InvoiceType;
  status: InvoiceStatus;
  displayStatus: ComputedInvoiceStatus;
  currency: string;
  taxTreatment: TaxTreatment;
  issueDate: string | null;
  dueDate: string | null;
  customerName: string;
  customerCompany: string | null;
  subtotalNetCents: number;
  totalVatCents: number;
  totalGrossCents: number;
  paidAmountCents: number;
  correctedInvoiceNumber: string | null;
  createdAtIso: string;
  issuedAtIso: string | null;
}

export interface SerializedInvoiceDetail extends SerializedInvoiceListItem {
  serviceDate: string | null;
  servicePeriodStart: string | null;
  servicePeriodEnd: string | null;
  paymentTermsDays: number;
  customerReference: string | null;
  buyerReference: string | null;
  paymentReference: string | null;
  paymentMeansCode: string;
  en16931Profile: string;
  notes: string | null;
  introText: string;
  outroText: string;
  taxLegalNotice: string | null;
  totalDiscountCents: number;
  taxBreakdown: TaxBreakdownBucket[];
  customerId: string;
  customer: CustomerSnapshot;
  issuer: CompanySnapshot | null;
  correctedInvoiceId: string | null;
  corrections: Array<{
    id: string;
    invoiceNumber: string | null;
    totalGrossCents: number;
    issuedAtIso: string | null;
  }>;
  items: InvoiceItemSnapshot[];
  payments: SerializedInvoicePayment[];
  auditLogs: SerializedInvoiceAuditLog[];
  pdfSha256: string | null;
  hasStoredPdf: boolean;
  paidAtIso: string | null;
  cancelledAtIso: string | null;
}

/**
 * Computes effective display status, surfacing OVERDUE when an ISSUED invoice
 * (not a cancellation) is past its due date.
 */
export function computeDisplayStatus(params: {
  status: InvoiceStatus;
  type: InvoiceType;
  dueDate: Date | string | null;
  now?: Date;
}): ComputedInvoiceStatus {
  if (params.status !== "ISSUED" || params.type === "CANCELLATION" || !params.dueDate) {
    return params.status;
  }
  const now = params.now ?? new Date();
  const todayUtcMidnight = Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate()
  );
  const dueMs =
    typeof params.dueDate === "string"
      ? Date.parse(`${params.dueDate.slice(0, 10)}T00:00:00.000Z`)
      : Date.UTC(
          params.dueDate.getUTCFullYear(),
          params.dueDate.getUTCMonth(),
          params.dueDate.getUTCDate()
        );
  if (!Number.isNaN(dueMs) && dueMs < todayUtcMidnight) {
    return "OVERDUE";
  }
  return "ISSUED";
}
