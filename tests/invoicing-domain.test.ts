import { describe, expect, it } from "vitest";
import {
  calculateInvoiceTotals,
  eurosToCents,
  formatDateDe,
  formatEurDe,
  formatInvoiceNumber,
  formatQuantityDe,
  roundHalfUpBigInt,
} from "@/lib/invoicing/money";
import {
  isValidBic,
  isValidIban,
  isValidVatId,
  validateInvoiceForIssuance,
  type CompanySettingsValidationInput,
  type CustomerValidationInput,
} from "@/lib/invoicing/validators";
import { computeDisplayStatus } from "@/lib/invoicing/types";

const VALID_COMPANY: CompanySettingsValidationInput = {
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
  bankAccountHolder: "CoreLogic Systems UG (haftungsbeschränkt)",
  bankIban: "DE89370400440532013000", // Official ISO 13616 valid German test IBAN
  bankBic: "COBADEFFXXX",
  bankName: "Commerzbank AG",
};

const VALID_CUSTOMER: CustomerValidationInput = {
  name: "Max Mustermann",
  companyName: "Muster GmbH",
  street: "Berliner Allee 15",
  postalCode: "40212",
  city: "Düsseldorf",
  country: "DE",
  vatId: "DE987654321",
};

describe("German Invoicing Financial Math & Formatting", () => {
  it("calculates the exact reference sample: 2.000,00 € net + 19% = 380,00 € VAT, 2.380,00 € gross", () => {
    const calc = calculateInvoiceTotals(
      [
        {
          quantity: 1,
          unitPriceNetCents: eurosToCents("2000,00"),
          vatRateBps: 1900,
        },
      ],
      "STANDARD_19"
    );

    expect(calc.subtotalNetCents).toBe(200_000);
    expect(calc.totalVatCents).toBe(38_000);
    expect(calc.totalGrossCents).toBe(238_000);
    expect(calc.taxBreakdown).toHaveLength(1);
    expect(calc.taxBreakdown[0]).toMatchObject({
      vatRateBps: 1900,
      vatCategoryCode: "S",
      netCents: 200_000,
      vatCents: 38_000,
      grossCents: 238_000,
    });

    expect(formatEurDe(calc.subtotalNetCents)).toBe("2.000,00 €");
    expect(formatEurDe(calc.totalVatCents)).toBe("380,00 €");
    expect(formatEurDe(calc.totalGrossCents)).toBe("2.380,00 €");
    expect(formatDateDe("2027-01-15")).toBe("15.01.2027");
  });

  it("handles multiple VAT rates (19%, 7%, 0%), decimal quantities, discounts, and half-up rounding per tax bucket", () => {
    // 2 lines at 19% with net 103 cents each:
    // Per-line VAT would be roundHalfUp(103 * 0.19 = 19.57) = 20c each -> 40c total.
    // German §14 UStG bucket VAT is roundHalfUp(206 * 0.19 = 39.14) = 39c total!
    const bucketRoundingCalc = calculateInvoiceTotals(
      [
        { quantity: "1", unitPriceNetCents: 103, vatRateBps: 1900 },
        { quantity: "1", unitPriceNetCents: 103, vatRateBps: 1900 },
      ],
      "STANDARD_19"
    );
    expect(bucketRoundingCalc.subtotalNetCents).toBe(206);
    expect(bucketRoundingCalc.totalVatCents).toBe(39);
    expect(bucketRoundingCalc.totalGrossCents).toBe(245);

    // Multi-rate invoice with decimal quantity & percentage discount
    const mixed = calculateInvoiceTotals(
      [
        // 2.5 Std. x 120,00 € = 300,00 €, 10% Rabatt = -30,00 € -> 270,00 € net @ 19%
        {
          quantity: "2,5",
          unitPriceNetCents: 12_000,
          discountPercent: "10",
          vatRateBps: 1900,
        },
        // 1.3333 Std. x 100,00 € = 133,33 € net @ 19%
        {
          quantity: "1.3333",
          unitPriceNetCents: 10_000,
          vatRateBps: 1900,
        },
        // 3 Stk. x 15,50 € = 46,50 € net @ 7%
        {
          quantity: 3,
          unitPriceNetCents: 1_550,
          vatRateBps: 700,
        },
        // 1 Pauschal x 50,00 € = 50,00 € net @ 0%
        {
          quantity: 1,
          unitPriceNetCents: 5_000,
          vatRateBps: 0,
        },
      ],
      "STANDARD_19"
    );

    expect(mixed.totalDiscountCents).toBe(3_000);
    // 19% bucket: 27000 + 13333 = 40333 cents -> 19% = 7663.27 -> 7663 cents
    // 7% bucket: 4650 cents -> 7% = 325.5 -> half-up = 326 cents!
    // 0% bucket: 5000 cents -> 0% = 0 cents
    expect(mixed.subtotalNetCents).toBe(40_333 + 4_650 + 5_000);
    expect(mixed.taxBreakdown).toEqual([
      {
        vatRateBps: 1900,
        vatCategoryCode: "S",
        netCents: 40_333,
        vatCents: 7_663,
        grossCents: 47_996,
      },
      {
        vatRateBps: 700,
        vatCategoryCode: "S",
        netCents: 4_650,
        vatCents: 326,
        grossCents: 4_976,
      },
      {
        vatRateBps: 0,
        vatCategoryCode: "Z",
        netCents: 5_000,
        vatCents: 0,
        grossCents: 5_000,
      },
    ]);
    expect(mixed.totalVatCents).toBe(7_663 + 326);
    expect(mixed.totalGrossCents).toBe(mixed.subtotalNetCents + mixed.totalVatCents);

    // Half-up edge cases
    expect(roundHalfUpBigInt(BigInt(5), BigInt(2))).toBe(3);
    expect(roundHalfUpBigInt(BigInt(-5), BigInt(2))).toBe(-3);
    expect(formatQuantityDe("2.5000")).toBe("2,5");
    expect(formatQuantityDe("1.0000")).toBe("1");
    expect(formatInvoiceNumber(2027, 1)).toBe("RE-2027-001");
  });

  it("forces 0% VAT and proper EN 16931 VAT category codes for Kleinunternehmer, Reverse-Charge, and Non-EU", () => {
    const ku = calculateInvoiceTotals(
      [{ quantity: 1, unitPriceNetCents: 100_000, vatRateBps: 1900 }],
      "KLEINUNTERNEHMER"
    );
    expect(ku.totalVatCents).toBe(0);
    expect(ku.taxBreakdown[0].vatCategoryCode).toBe("E");

    const rc = calculateInvoiceTotals(
      [{ quantity: 1, unitPriceNetCents: 100_000, vatRateBps: 1900 }],
      "REVERSE_CHARGE"
    );
    expect(rc.totalVatCents).toBe(0);
    expect(rc.taxBreakdown[0].vatCategoryCode).toBe("AE");

    const nonEu = calculateInvoiceTotals(
      [{ quantity: 1, unitPriceNetCents: 100_000, vatRateBps: 1900 }],
      "EXEMPT_NON_EU"
    );
    expect(nonEu.totalVatCents).toBe(0);
    expect(nonEu.taxBreakdown[0].vatCategoryCode).toBe("G");
  });

  it("computes OVERDUE status dynamically from dueDate", () => {
    const now = new Date("2027-02-20T12:00:00.000Z");
    expect(
      computeDisplayStatus({
        status: "ISSUED",
        type: "INVOICE",
        dueDate: "2027-02-19",
        now,
      })
    ).toBe("OVERDUE");
    expect(
      computeDisplayStatus({
        status: "ISSUED",
        type: "INVOICE",
        dueDate: "2027-02-20",
        now,
      })
    ).toBe("ISSUED");
    expect(
      computeDisplayStatus({
        status: "PAID",
        type: "INVOICE",
        dueDate: "2027-02-01",
        now,
      })
    ).toBe("PAID");
  });
});

describe("IBAN, BIC, USt-IdNr & Mandatory Issuance Validation", () => {
  it("validates IBAN ISO 7064 checksum, BIC, and EU/DE USt-IdNr formats", () => {
    expect(isValidIban("DE89 3704 0044 0532 0130 00")).toBe(true);
    expect(isValidIban("DE89370400440532013001")).toBe(false); // bad checksum
    expect(isValidIban("DE893704004405320130")).toBe(false); // wrong length for DE
    expect(isValidIban("NOT-AN-IBAN")).toBe(false);

    expect(isValidBic("COBADEFFXXX")).toBe(true);
    expect(isValidBic("DEUTDEFF")).toBe(true);
    expect(isValidBic("BAD")).toBe(false);

    expect(isValidVatId("DE123456789")).toBe(true);
    expect(isValidVatId("ATU12345678")).toBe(true);
    expect(isValidVatId("NL123456789B01")).toBe(true);
    expect(isValidVatId("DE12345")).toBe(false);
    expect(isValidVatId("XX123456789")).toBe(false);
  });

  it("rejects issuance when issuer fields, customer address, service date, or IBAN are missing/invalid", () => {
    const issues = validateInvoiceForIssuance({
      company: {
        ...VALID_COMPANY,
        street: "",
        registerCourt: "",
        registerNumber: "",
        taxNumber: "",
        vatId: "",
        bankIban: "DE00370400440532013000", // invalid checksum
      },
      customer: {
        ...VALID_CUSTOMER,
        street: "",
        postalCode: "",
        city: "",
      },
      taxTreatment: "STANDARD_19",
      serviceDate: null,
      itemsCount: 0,
      hasValidItemAmounts: false,
    });

    const fields = issues.map((i) => i.field);
    expect(fields).toContain("street");
    expect(fields).toContain("registerCourt");
    expect(fields).toContain("registerNumber");
    expect(fields).toContain("taxNumber");
    expect(fields).toContain("bankIban");
    expect(fields).toContain("customer.street");
    expect(fields).toContain("customer.postalCode");
    expect(fields).toContain("customer.city");
    expect(fields).toContain("serviceDate");
    expect(fields).toContain("items");
  });

  it("requires both issuer and customer USt-IdNr for EU Reverse-Charge", () => {
    const issues = validateInvoiceForIssuance({
      company: { ...VALID_COMPANY, vatId: "" },
      customer: { ...VALID_CUSTOMER, vatId: "" },
      taxTreatment: "REVERSE_CHARGE",
      serviceDate: "2027-01-10",
      itemsCount: 1,
      hasValidItemAmounts: true,
      taxLegalNotice: "Steuerschuldnerschaft des Leistungsempfängers",
    });

    const fields = issues.map((i) => i.field);
    expect(fields).toContain("company.vatId");
    expect(fields).toContain("customer.vatId");
  });

  it("passes validation when all mandatory §14 UStG and §35a GmbHG fields are complete", () => {
    const issues = validateInvoiceForIssuance({
      company: VALID_COMPANY,
      customer: VALID_CUSTOMER,
      taxTreatment: "STANDARD_19",
      serviceDate: "2027-01-15",
      itemsCount: 1,
      hasValidItemAmounts: true,
    });

    expect(issues).toEqual([]);
  });
});
