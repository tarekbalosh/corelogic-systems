import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import {
  ADMIN_API_HEADERS,
  adminJsonResponse,
  requireAdminApiRequest,
} from "@/lib/invoicing/api-auth";
import { handleInvoicingApiError } from "@/lib/invoicing/api-errors";
import {
  DEFAULT_INVOICE_INTRO_TEXT,
  DEFAULT_INVOICE_OUTRO_TEXT,
  resolveUnitCode,
} from "@/lib/invoicing/constants";
import {
  addDaysUtc,
  calculateInvoiceTotals,
  parseIsoDateOnly,
  toIsoDateOnly,
} from "@/lib/invoicing/money";
import { generateInvoicePdf } from "@/lib/invoicing/pdf";
import {
  getOrInitCompanySettings,
  resolveDefaultTaxLegalNotice,
} from "@/lib/invoicing/service";
import type { InvoiceItemSnapshot, InvoicePdfDocumentData } from "@/lib/invoicing/types";
import { InvoiceDraftInputSchema } from "@/lib/invoicing/validators";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const guard = await requireAdminApiRequest(request, { mutate: true });
  if (guard instanceof NextResponse) return guard;

  try {
    const body = await request.json();
    const parsed = InvoiceDraftInputSchema.safeParse(body);
    if (!parsed.success) {
      return adminJsonResponse(
        {
          error:
            parsed.error.issues[0]?.message ??
            "Ungültige Eingaben für PDF-Vorschau.",
        },
        400
      );
    }

    const input = parsed.data;
    const [company, customer] = await Promise.all([
      getOrInitCompanySettings(),
      prisma.billingCustomer.findUnique({ where: { id: input.customerId } }),
    ]);

    if (!customer) {
      return adminJsonResponse(
        { error: "Ausgewählter Kunde nicht gefunden." },
        404
      );
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

    const todayIso = toIsoDateOnly(new Date())!;
    const issueDateIso = input.issueDate || todayIso;
    const dueDateIso = toIsoDateOnly(
      addDaysUtc(parseIsoDateOnly(issueDateIso), input.paymentTermsDays)
    );

    const items: InvoiceItemSnapshot[] = input.items.map((it, idx) => {
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
    });

    const docData: InvoicePdfDocumentData = {
      invoiceNumber: "ENTWURF",
      isDraft: true,
      type: "INVOICE",
      currency: "EUR",
      taxTreatment: input.taxTreatment,
      issueDate: issueDateIso,
      serviceDate: input.serviceDate || null,
      servicePeriodStart: input.servicePeriodStart || null,
      servicePeriodEnd: input.servicePeriodEnd || null,
      dueDate: dueDateIso,
      paymentTermsDays: input.paymentTermsDays,
      customerReference: input.customerReference?.trim() || null,
      buyerReference: input.buyerReference?.trim() || null,
      paymentReference: "ENTWURF",
      notes: input.notes?.trim() || null,
      introText: input.introText?.trim() || DEFAULT_INVOICE_INTRO_TEXT,
      outroText: input.outroText?.trim() || DEFAULT_INVOICE_OUTRO_TEXT,
      taxLegalNotice:
        input.taxLegalNotice !== undefined
          ? input.taxLegalNotice?.trim() || null
          : resolveDefaultTaxLegalNotice(input.taxTreatment, company),
      correctedInvoiceNumber: null,
      issuer: {
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
      },
      customer: {
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
      },
      items,
      taxBreakdown: calc.taxBreakdown,
      subtotalNetCents: calc.subtotalNetCents,
      totalDiscountCents: calc.totalDiscountCents,
      totalVatCents: calc.totalVatCents,
      totalGrossCents: calc.totalGrossCents,
    };

    const pdfBytes = await generateInvoicePdf(docData);
    return new NextResponse(Buffer.from(pdfBytes), {
      status: 200,
      headers: {
        ...ADMIN_API_HEADERS,
        "Content-Type": "application/pdf",
        "Content-Disposition": 'inline; filename="Rechnung_Entwurf_Vorschau.pdf"',
      },
    });
  } catch (err) {
    return handleInvoicingApiError(err);
  }
}
