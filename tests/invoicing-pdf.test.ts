import { describe, expect, it } from "vitest";
import { extractText, getDocumentProxy } from "unpdf";
import { generateInvoicePdf } from "@/lib/invoicing/pdf";
import type { InvoicePdfDocumentData } from "@/lib/invoicing/types";

function buildSamplePdfData(
  overrides: Partial<InvoicePdfDocumentData> = {}
): InvoicePdfDocumentData {
  return {
    invoiceNumber: "RE-2027-001",
    isDraft: false,
    type: "INVOICE",
    currency: "EUR",
    taxTreatment: "STANDARD_19",
    issueDate: "2027-01-15",
    serviceDate: "2027-01-10",
    servicePeriodStart: null,
    servicePeriodEnd: null,
    dueDate: "2027-01-29",
    paymentTermsDays: 14,
    customerReference: "PO-2027-88",
    buyerReference: "04011000-12345-67",
    paymentReference: "RE-2027-001",
    notes: "Leistung gemäß Angebot Nr. ANG-2027-01.",
    introText:
      "Sehr geehrte Damen und Herren,\n\nfür unsere erbrachten Leistungen berechnen wir Ihnen wie folgt:",
    outroText: "Vielen Dank für Ihr Vertrauen!",
    taxLegalNotice: null,
    correctedInvoiceNumber: null,
    issuer: {
      legalName: "CoreLogic Systems UG (haftungsbeschränkt)",
      street: "Königstraße 42",
      postalCode: "47051",
      city: "Duisburg",
      country: "DE",
      managingDirector: "Tarek Balosh",
      registerCourt: "Amtsgericht Duisburg",
      registerNumber: "HRB 99999",
      taxNumber: "109/5700/1234",
      vatId: "DE123456789",
      email: "billing@corelogic-system.my",
      phone: "+49 203 123456",
      website: "https://www.corelogic-system.my",
      bankAccountHolder: "CoreLogic Systems UG (haftungsbeschränkt)",
      bankIban: "DE89370400440532013000",
      bankBic: "COBADEFFXXX",
      bankName: "Commerzbank AG",
      logoPath: "/corelogic_logo.png",
    },
    customer: {
      id: "cust_1",
      customerNumber: "KD-0001",
      name: "Jürgen Müller-Größer",
      companyName: "Rhein-Ruhr Lösungen GmbH",
      contactPerson: "Jürgen Müller-Größer",
      street: "Düsseldorfer Straße 18",
      postalCode: "40213",
      city: "Düsseldorf",
      country: "DE",
      email: "finanzen@rhein-ruhr.de",
      phone: "+49 211 987654",
      vatId: "DE987654321",
    },
    items: [
      {
        position: 1,
        description:
          "Individuelle Webentwicklung & KI-Prozesslösung (Überprüfung & Übergabe)",
        quantity: "1.0000",
        unit: "Pauschal",
        unitCode: "LS",
        unitPriceNetCents: 200_000,
        discountPercent: "0.00",
        discountCents: 0,
        vatRateBps: 1900,
        vatCategoryCode: "S",
        lineNetCents: 200_000,
      },
    ],
    taxBreakdown: [
      {
        vatRateBps: 1900,
        vatCategoryCode: "S",
        netCents: 200_000,
        vatCents: 38_000,
        grossCents: 238_000,
      },
    ],
    subtotalNetCents: 200_000,
    totalDiscountCents: 0,
    totalVatCents: 38_000,
    totalGrossCents: 238_000,
    ...overrides,
  };
}

async function readPdfText(pdfBytes: Uint8Array): Promise<{
  totalPages: number;
  fullText: string;
}> {
  const pdf = await getDocumentProxy(new Uint8Array(pdfBytes));
  const { totalPages, text } = await extractText(pdf, { mergePages: true });
  return { totalPages, fullText: String(text) };
}

describe("German DIN 5008 PDF Generator & Extracted Text Verification", () => {
  it("contains all mandatory §14 UStG, §35a GmbHG, German umlauts, and exact EUR totals", async () => {
    const pdfBytes = await generateInvoicePdf(buildSamplePdfData());
    expect(pdfBytes.byteLength).toBeGreaterThan(2000);

    const { totalPages, fullText } = await readPdfText(pdfBytes);
    expect(totalPages).toBe(1);

    // §35a GmbHG mandatory company & Handelsregister details
    expect(fullText).toContain("CoreLogic Systems UG (haftungsbeschränkt)");
    expect(fullText).toContain("Tarek Balosh");
    expect(fullText).toContain("Amtsgericht Duisburg");
    expect(fullText).toContain("HRB 99999");

    // §14 UStG tax IDs, customer address, umlauts (ä ö ü ß)
    expect(fullText).toContain("109/5700/1234");
    expect(fullText).toContain("DE123456789");
    expect(fullText).toContain("Rhein-Ruhr Lösungen GmbH");
    expect(fullText).toContain("Jürgen Müller-Größer");
    expect(fullText).toContain("Düsseldorfer Straße 18");
    expect(fullText).toContain("40213 Düsseldorf");

    // Dates & invoice number
    expect(fullText).toContain("RE-2027-001");
    expect(fullText).toContain("15.01.2027");
    expect(fullText).toContain("10.01.2027");
    expect(fullText).toContain("29.01.2027");
    expect(fullText).toContain("KD-0001");

    // Exact sample financial figures (de-DE format)
    expect(fullText).toContain("2.000,00 €");
    expect(fullText).toContain("380,00 €");
    expect(fullText).toContain("2.380,00 €");
    expect(fullText).toContain("Zwischensumme (Netto)");
    expect(fullText).toContain("zzgl. Umsatzsteuer (19 %)");
    expect(fullText).toContain("Gesamtbetrag (Brutto)");

    // Bank details & payment terms
    expect(fullText).toContain("14 Tagen");
    expect(fullText).toContain("DE89 3704 0044 0532 0130 00");
    expect(fullText).toContain("COBADEFFXXX");
    expect(fullText).toContain("Verwendungszweck: RE-2027-001");

    // Pagination & closing
    expect(fullText).toContain("Vielen Dank für Ihr Vertrauen!");
    expect(fullText).toContain("Seite 1 von 1");
  });

  it("paginates multi-page invoices cleanly with repeated table header and Seite x von y", async () => {
    const manyItems = Array.from({ length: 24 }, (_, idx) => ({
      position: idx + 1,
      description: `Entwicklungspaket Modul ${idx + 1}: Schnittstellen, Qualitätssicherung und Dokumentation`,
      quantity: "2.5000",
      unit: "Std.",
      unitCode: "HUR",
      unitPriceNetCents: 10_000,
      discountPercent: "0.00",
      discountCents: 0,
      vatRateBps: 1900,
      vatCategoryCode: "S" as const,
      lineNetCents: 25_000,
    }));

    const netTotal = 24 * 25_000; // 600,000 cents = 6.000,00 €
    const vatTotal = Math.round(netTotal * 0.19); // 114,000 cents = 1.140,00 €

    const pdfBytes = await generateInvoicePdf(
      buildSamplePdfData({
        invoiceNumber: "RE-2027-015",
        items: manyItems,
        taxBreakdown: [
          {
            vatRateBps: 1900,
            vatCategoryCode: "S",
            netCents: netTotal,
            vatCents: vatTotal,
            grossCents: netTotal + vatTotal,
          },
        ],
        subtotalNetCents: netTotal,
        totalVatCents: vatTotal,
        totalGrossCents: netTotal + vatTotal,
      })
    );

    const { totalPages, fullText } = await readPdfText(pdfBytes);
    expect(totalPages).toBeGreaterThanOrEqual(2);
    expect(fullText).toContain(`Seite 1 von ${totalPages}`);
    expect(fullText).toContain(`Seite ${totalPages} von ${totalPages}`);
    expect(fullText).toContain("Fortsetzung");
    // Repeated table header check: "Gesamt (Netto)" appears at least twice
    const headerOccurrences = fullText.match(/Gesamt \(Netto\)/g)?.length ?? 0;
    expect(headerOccurrences).toBeGreaterThanOrEqual(2);
  });

  it("renders Stornorechnung with negative totals and reference to the original invoice", async () => {
    const pdfBytes = await generateInvoicePdf(
      buildSamplePdfData({
        invoiceNumber: "RE-2027-002",
        type: "CANCELLATION",
        correctedInvoiceNumber: "RE-2027-001",
        items: [
          {
            position: 1,
            description: "Individuelle Webentwicklung",
            quantity: "-1.0000",
            unit: "Pauschal",
            unitCode: "LS",
            unitPriceNetCents: 200_000,
            discountPercent: "0.00",
            discountCents: 0,
            vatRateBps: 1900,
            vatCategoryCode: "S",
            lineNetCents: -200_000,
          },
        ],
        taxBreakdown: [
          {
            vatRateBps: 1900,
            vatCategoryCode: "S",
            netCents: -200_000,
            vatCents: -38_000,
            grossCents: -238_000,
          },
        ],
        subtotalNetCents: -200_000,
        totalVatCents: -38_000,
        totalGrossCents: -238_000,
      })
    );

    const { fullText } = await readPdfText(pdfBytes);
    expect(fullText).toContain("Stornorechnung Nr. RE-2027-002");
    expect(fullText).toContain("RE-2027-001");
    expect(fullText).toContain("-2.000,00 €");
    expect(fullText).toContain("-380,00 €");
    expect(fullText).toContain("-2.380,00 €");
  });
});
