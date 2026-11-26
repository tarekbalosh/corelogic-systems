import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import type { PrismaClient } from "@prisma/client";
import {
  buildDefaultCompanySettingsRecord,
  createInvoiceDraft,
  createStornoInvoice,
  deleteInvoiceDraft,
  issueInvoice,
  recordInvoicePayment,
  reserveNextInvoiceNumber,
  updateInvoiceDraft,
  InvoicingError,
} from "@/lib/invoicing/service";
import { generateInvoicePdf } from "@/lib/invoicing/pdf";

// Mock next/headers & admin-auth for route-handler security tests
const mockIsAdminAuthenticated = vi.fn<() => Promise<boolean>>();
vi.mock("@/lib/security/admin-auth", () => ({
  isAdminAuthenticated: () => mockIsAdminAuthenticated(),
  requireAdminSession: vi.fn(),
  clearAdminSessionCookie: vi.fn(),
  setAdminSessionCookie: vi.fn(),
  verifyAdminTokenConstantTime: vi.fn(),
}));
vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));
vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

const mockPrismaInvoiceFindUnique = vi.fn();
const mockPrismaInvoiceFindMany = vi.fn();
const mockPrismaAuditCreateMany = vi.fn();
vi.mock("@/lib/db", () => ({
  default: {
    invoice: {
      findUnique: (...args: unknown[]) => mockPrismaInvoiceFindUnique(...args),
      findMany: (...args: unknown[]) => mockPrismaInvoiceFindMany(...args),
    },
    invoiceAuditLog: {
      createMany: (...args: unknown[]) => mockPrismaAuditCreateMany(...args),
    },
  },
}));

/**
 * In-memory transactional Prisma mock enforcing:
 * - Atomic per-year sequential numbering (simulating Postgres row lock on invoicing_sequences)
 * - Unique invoiceNumber & (invoiceYear, sequenceNumber)
 * - Full CRUD for CompanySettings, BillingCustomer, Invoice, InvoiceItem, InvoicePayment, InvoiceAuditLog
 */
function createMockInvoicingDb() {
  let idCounter = 1;
  const nextId = (prefix: string) => `${prefix}_${idCounter++}`;

  const company = {
    ...buildDefaultCompanySettingsRecord(),
    street: "Königstraße 42",
    postalCode: "47051",
    city: "Duisburg",
    registerCourt: "Amtsgericht Duisburg",
    registerNumber: "HRB 99999",
    taxNumber: "109/5700/1234",
    vatId: "DE123456789",
    email: "billing@corelogic-system.my",
    phone: "+49 203 123456",
    bankAccountHolder: "CoreLogic Systems UG (haftungsbeschränkt)",
    bankIban: "DE89370400440532013000",
    bankBic: "COBADEFFXXX",
    bankName: "Commerzbank AG",
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const customers = new Map<string, Record<string, unknown>>();
  const customerId = "cust_1";
  customers.set(customerId, {
    id: customerId,
    customerNumber: "KD-0001",
    name: "Max Mustermann",
    companyName: "Muster GmbH",
    contactPerson: "Max Mustermann",
    street: "Berliner Allee 15",
    postalCode: "40212",
    city: "Düsseldorf",
    country: "DE",
    email: "max@muster.de",
    phone: "+49 211 111111",
    vatId: "DE987654321",
    notes: null,
    leadId: "lead_1",
    bookingId: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  const sequences = new Map<number, number>();
  const invoices = new Map<string, Record<string, unknown>>();
  const items = new Map<string, Array<Record<string, unknown>>>();
  const payments = new Map<string, Array<Record<string, unknown>>>();
  const auditLogs = new Map<string, Array<Record<string, unknown>>>();

  // Mutex chain simulating Postgres row-level locking during concurrent transactions
  let seqLock: Promise<void> = Promise.resolve();

  const attachRelations = (inv: Record<string, unknown>) => {
    const id = String(inv.id);
    const cust = customers.get(String(inv.customerId)) ?? null;
    const corrected = inv.correctedInvoiceId
      ? invoices.get(String(inv.correctedInvoiceId)) ?? null
      : null;
    const corrections = Array.from(invoices.values()).filter(
      (other) => other.correctedInvoiceId === id
    );
    return {
      ...inv,
      customer: cust,
      items: [...(items.get(id) ?? [])],
      payments: [...(payments.get(id) ?? [])],
      auditLogs: [...(auditLogs.get(id) ?? [])],
      correctedInvoice: corrected
        ? { id: corrected.id, invoiceNumber: corrected.invoiceNumber }
        : null,
      corrections: corrections.map((c) => ({
        id: c.id,
        invoiceNumber: c.invoiceNumber,
        totalGrossCents: c.totalGrossCents,
        issuedAt: c.issuedAt ?? null,
      })),
    };
  };

  const client: Record<string, unknown> = {
    companySettings: {
      findUnique: async () => company,
      create: async () => company,
      upsert: async () => company,
    },
    billingCustomer: {
      findUnique: async ({ where }: { where: { id?: string; customerNumber?: string } }) => {
        if (where.id) return customers.get(where.id) ?? null;
        return null;
      },
      findMany: async () => Array.from(customers.values()),
      count: async () => customers.size,
    },
    invoice: {
      findUnique: async ({ where }: { where: { id: string } }) => {
        const found = invoices.get(where.id);
        return found ? attachRelations(found) : null;
      },
      findMany: async () => Array.from(invoices.values()).map(attachRelations),
      create: async ({ data }: { data: Record<string, unknown> }) => {
        const id = nextId("inv");
        const now = new Date();
        const nestedItems = (data.items as { create?: Array<Record<string, unknown>> })?.create ?? [];
        const nestedAudits = (data.auditLogs as { create?: Record<string, unknown> })?.create;

        const record: Record<string, unknown> = {
          id,
          invoiceNumber: null,
          invoiceYear: null,
          sequenceNumber: null,
          type: "INVOICE",
          status: "DRAFT",
          currency: "EUR",
          taxTreatment: "STANDARD_19",
          issueDate: null,
          serviceDate: null,
          servicePeriodStart: null,
          servicePeriodEnd: null,
          dueDate: null,
          paymentTermsDays: 14,
          customerReference: null,
          buyerReference: null,
          paymentReference: null,
          paymentMeansCode: "58",
          en16931Profile: "EN16931-READY",
          notes: null,
          introText: "",
          outroText: "",
          taxLegalNotice: null,
          subtotalNetCents: 0,
          totalDiscountCents: 0,
          totalVatCents: 0,
          totalGrossCents: 0,
          paidAmountCents: 0,
          taxBreakdownJson: null,
          correctedInvoiceId: null,
          issuedAt: null,
          paidAt: null,
          cancelledAt: null,
          issuerSnapshotJson: null,
          customerSnapshotJson: null,
          itemsSnapshotJson: null,
          pdfBytes: null,
          pdfSha256: null,
          ...data,
          createdAt: now,
          updatedAt: now,
        };
        delete record.items;
        delete record.auditLogs;

        invoices.set(id, record);
        items.set(
          id,
          nestedItems.map((it) => ({
            ...it,
            id: nextId("item"),
            invoiceId: id,
            quantity: { toString: () => String(it.quantity) },
            discountPercent: { toString: () => String(it.discountPercent ?? 0) },
          }))
        );
        payments.set(id, []);
        auditLogs.set(
          id,
          nestedAudits
            ? [{ id: nextId("audit"), invoiceId: id, ...nestedAudits, createdAt: now }]
            : []
        );

        return attachRelations(record);
      },
      update: async ({
        where,
        data,
      }: {
        where: { id: string };
        data: Record<string, unknown>;
      }) => {
        const existing = invoices.get(where.id);
        if (!existing) throw new Error("Not found");

        const nestedItems = (data.items as { create?: Array<Record<string, unknown>> })?.create;
        const nestedAudit = (data.auditLogs as { create?: Record<string, unknown> })?.create;

        const cleanData = { ...data };
        delete cleanData.items;
        delete cleanData.auditLogs;

        // Enforce unique invoiceNumber
        if (cleanData.invoiceNumber) {
          for (const other of invoices.values()) {
            if (other.id !== where.id && other.invoiceNumber === cleanData.invoiceNumber) {
              throw Object.assign(new Error("Unique constraint failed"), { code: "P2002" });
            }
          }
        }

        const updated = { ...existing, ...cleanData, updatedAt: new Date() };
        invoices.set(where.id, updated);

        if (nestedItems) {
          items.set(
            where.id,
            nestedItems.map((it) => ({
              ...it,
              id: nextId("item"),
              invoiceId: where.id,
              quantity: { toString: () => String(it.quantity) },
              discountPercent: { toString: () => String(it.discountPercent ?? 0) },
            }))
          );
        }
        if (nestedAudit) {
          const list = auditLogs.get(where.id) ?? [];
          list.unshift({
            id: nextId("audit"),
            invoiceId: where.id,
            ...nestedAudit,
            createdAt: new Date(),
          });
          auditLogs.set(where.id, list);
        }
        return attachRelations(updated);
      },
      delete: async ({ where }: { where: { id: string } }) => {
        invoices.delete(where.id);
        items.delete(where.id);
        payments.delete(where.id);
        auditLogs.delete(where.id);
      },
    },
    invoiceItem: {
      deleteMany: async ({ where }: { where: { invoiceId: string } }) => {
        items.set(where.invoiceId, []);
      },
    },
    invoicePayment: {
      create: async ({ data }: { data: Record<string, unknown> }) => {
        const id = nextId("pay");
        const invId = String(data.invoiceId);
        const list = payments.get(invId) ?? [];
        const rec = { id, ...data, createdAt: new Date() };
        list.unshift(rec);
        payments.set(invId, list);
        return rec;
      },
    },
    invoiceAuditLog: {
      create: async ({ data }: { data: Record<string, unknown> }) => {
        const invId = String(data.invoiceId);
        const list = auditLogs.get(invId) ?? [];
        const rec = { id: nextId("audit"), ...data, createdAt: new Date() };
        list.unshift(rec);
        auditLogs.set(invId, list);
        return rec;
      },
    },
    $queryRaw: async (_strings: TemplateStringsArray, yearVal: number) => {
      // Atomic serialized sequence increment simulating Postgres row lock
      let assigned = 0;
      const prev = seqLock;
      let release!: () => void;
      seqLock = new Promise<void>((res) => {
        release = res;
      });
      await prev;
      try {
        await new Promise((r) => setTimeout(r, 2)); // force interleaving across concurrent callers
        const nextVal = (sequences.get(yearVal) ?? 0) + 1;
        sequences.set(yearVal, nextVal);
        assigned = nextVal;
      } finally {
        release();
      }
      return [{ lastNumber: assigned }];
    },
    $transaction: async <T>(fn: (tx: unknown) => Promise<T>): Promise<T> => {
      return fn(client);
    },
  };

  return {
    db: client as unknown as PrismaClient,
    company,
    customerId,
    invoices,
  };
}

describe("Invoicing Lifecycle, Concurrency, Annual Reset & GoBD Immutability", () => {
  beforeEach(() => {
    mockIsAdminAuthenticated.mockReset();
  });

  it("assigns gap-free unique sequential numbers under concurrent requests and resets to 001 each year", async () => {
    const { db, customerId } = createMockInvoicingDb();

    // Create 8 drafts concurrently for 2027
    const draftIds: string[] = [];
    for (let i = 0; i < 8; i++) {
      const d = await createInvoiceDraft(
        {
          customerId,
          taxTreatment: "STANDARD_19",
          issueDate: "2027-03-10",
          serviceDate: "2027-03-10",
          paymentTermsDays: 14,
          items: [
            {
              description: `Leistung #${i + 1}`,
              quantity: 1,
              unit: "Pauschal",
              unitPriceNetCents: 100_000,
              vatRateBps: 1900,
            },
          ],
        },
        "admin",
        db
      );
      expect(d.invoiceNumber).toBeNull(); // Drafts never reserve numbers
      draftIds.push(d.id);
    }

    // Delete 1 extra draft before issuing — must NOT consume a number
    const throwaway = await createInvoiceDraft(
      {
        customerId,
        taxTreatment: "STANDARD_19",
        issueDate: "2027-03-10",
        serviceDate: "2027-03-10",
        paymentTermsDays: 14,
        items: [
          {
            description: "Deleted draft",
            quantity: 1,
            unit: "Stk.",
            unitPriceNetCents: 50_000,
            vatRateBps: 1900,
          },
        ],
      },
      "admin",
      db
    );
    await deleteInvoiceDraft(throwaway.id, db);

    // Issue all 8 drafts concurrently!
    const issuedResults = await Promise.all(
      draftIds.map((id) =>
        issueInvoice(id, {
          renderPdf: async () => new Uint8Array([0x25, 0x50, 0x44, 0x46]),
          issueDateOverride: "2027-03-10",
          db,
        })
      )
    );

    const assignedNumbers = issuedResults
      .map((inv) => inv.invoiceNumber)
      .sort();

    // Exact gap-free sequence RE-2027-001 through RE-2027-008
    expect(assignedNumbers).toEqual([
      "RE-2027-001",
      "RE-2027-002",
      "RE-2027-003",
      "RE-2027-004",
      "RE-2027-005",
      "RE-2027-006",
      "RE-2027-007",
      "RE-2027-008",
    ]);

    // Annual reset check: issuing in 2028 resets cleanly to RE-2028-001
    const seq2028 = await reserveNextInvoiceNumber(
      db as unknown as Parameters<typeof reserveNextInvoiceNumber>[0],
      2028
    );
    expect(seq2028.invoiceNumber).toBe("RE-2028-001");
  });

  it("runs complete lifecycle: draft -> issue (immutable) -> reject edit/delete -> payment -> Stornorechnung", async () => {
    const { db, customerId } = createMockInvoicingDb();

    const draft = await createInvoiceDraft(
      {
        customerId,
        taxTreatment: "STANDARD_19",
        issueDate: "2027-04-01",
        serviceDate: "2027-04-01",
        paymentTermsDays: 14,
        items: [
          {
            description: "Webentwicklung & KI-Integration",
            quantity: 1,
            unit: "Pauschal",
            unitPriceNetCents: 200_000,
            vatRateBps: 1900,
          },
        ],
      },
      "admin",
      db
    );

    const issued = await issueInvoice(draft.id, {
      renderPdf: generateInvoicePdf,
      issueDateOverride: "2027-04-01",
      db,
    });

    expect(issued.invoiceNumber).toBe("RE-2027-001");
    expect(issued.status).toBe("ISSUED");
    expect(issued.totalGrossCents).toBe(238_000);
    expect(issued.hasStoredPdf).toBe(true);
    expect(issued.pdfSha256).toMatch(/^[a-f0-9]{64}$/);
    expect(issued.issuer?.legalName).toBe(
      "CoreLogic Systems UG (haftungsbeschränkt)"
    );

    // GoBD: Editing an issued invoice MUST be rejected with 409 INVOICE_IMMUTABLE
    await expect(
      updateInvoiceDraft(
        issued.id,
        {
          customerId,
          taxTreatment: "STANDARD_19",
          items: [
            {
              description: "Tampered item",
              quantity: 1,
              unit: "Stk.",
              unitPriceNetCents: 100,
              vatRateBps: 1900,
            },
          ],
        },
        "admin",
        db
      )
    ).rejects.toMatchObject({
      statusCode: 409,
      code: "INVOICE_IMMUTABLE",
    });

    // GoBD: Deleting an issued invoice MUST be rejected with 409 INVOICE_IMMUTABLE
    await expect(deleteInvoiceDraft(issued.id, db)).rejects.toMatchObject({
      statusCode: 409,
      code: "INVOICE_IMMUTABLE",
    });

    // Record full payment -> transitions to PAID
    const paid = await recordInvoicePayment(
      issued.id,
      {
        paidAt: "2027-04-10",
        amountCents: 238_000,
        method: "SEPA-Überweisung",
        reference: "RE-2027-001",
      },
      "admin",
      db
    );
    expect(paid.status).toBe("PAID");
    expect(paid.paidAmountCents).toBe(238_000);
    expect(paid.payments).toHaveLength(1);

    // Create Stornorechnung -> new sequential number, exact negative amounts, references original
    const { original, storno } = await createStornoInvoice(issued.id, {
      renderPdf: generateInvoicePdf,
      reason: "Leistung storniert",
      issueDateOverride: "2027-04-12",
      db,
    });

    expect(original.status).toBe("CANCELLED");
    expect(storno.type).toBe("CANCELLATION");
    expect(storno.status).toBe("ISSUED");
    expect(storno.invoiceNumber).toBe("RE-2027-002");
    expect(storno.correctedInvoiceId).toBe(original.id);
    expect(storno.correctedInvoiceNumber).toBe("RE-2027-001");

    // Cent-for-cent reversal check
    expect(storno.subtotalNetCents).toBe(-200_000);
    expect(storno.totalVatCents).toBe(-38_000);
    expect(storno.totalGrossCents).toBe(-238_000);
    expect(original.totalGrossCents + storno.totalGrossCents).toBe(0);
    expect(original.totalVatCents + storno.totalVatCents).toBe(0);
  });

  it("blocks issuing when company settings have missing mandatory fields", async () => {
    const { db, company, customerId } = createMockInvoicingDb();
    company.bankIban = ""; // Missing IBAN
    company.registerNumber = ""; // Missing HRB

    const draft = await createInvoiceDraft(
      {
        customerId,
        taxTreatment: "STANDARD_19",
        serviceDate: "2027-04-01",
        items: [
          {
            description: "Consulting",
            quantity: 1,
            unit: "Std.",
            unitPriceNetCents: 15_000,
            vatRateBps: 1900,
          },
        ],
      },
      "admin",
      db
    );

    let caught: unknown;
    try {
      await issueInvoice(draft.id, {
        renderPdf: generateInvoicePdf,
        db,
      });
    } catch (err) {
      caught = err;
    }

    expect(caught).toBeInstanceOf(InvoicingError);
    const invErr = caught as InvoicingError;
    expect(invErr.statusCode).toBe(422);
    expect(invErr.code).toBe("INCOMPLETE_MANDATORY_FIELDS");
    expect(invErr.issues?.map((i) => i.field)).toEqual(
      expect.arrayContaining(["bankIban", "registerNumber"])
    );
  });
});

describe("Admin API Auth (401) & CSRF (403) Route Protection", () => {
  beforeEach(() => {
    mockIsAdminAuthenticated.mockReset();
  });

  it("returns 401 JSON without an authenticated admin session on all invoicing APIs", async () => {
    mockIsAdminAuthenticated.mockResolvedValue(false);

    const [invoicesRoute, invoiceByIdRoute, settingsRoute, issueRoute] =
      await Promise.all([
        import("@/app/(admin)/admin/api/invoices/route"),
        import("@/app/(admin)/admin/api/invoices/[id]/route"),
        import("@/app/(admin)/admin/api/company-settings/route"),
        import("@/app/(admin)/admin/api/invoices/[id]/issue/route"),
      ]);

    const resGet = await invoicesRoute.GET(
      new NextRequest("https://www.corelogic-system.my/admin/api/invoices")
    );
    expect(resGet.status).toBe(401);

    const resPost = await invoicesRoute.POST(
      new NextRequest("https://www.corelogic-system.my/admin/api/invoices", {
        method: "POST",
        headers: { "x-requested-with": "fetch" },
      })
    );
    expect(resPost.status).toBe(401);

    const resPatch = await invoiceByIdRoute.PATCH(
      new NextRequest("https://www.corelogic-system.my/admin/api/invoices/inv_1", {
        method: "PATCH",
        headers: { "x-requested-with": "fetch" },
      }),
      { params: Promise.resolve({ id: "inv_1" }) }
    );
    expect(resPatch.status).toBe(401);

    const resDelete = await invoiceByIdRoute.DELETE(
      new NextRequest("https://www.corelogic-system.my/admin/api/invoices/inv_1", {
        method: "DELETE",
        headers: { "x-requested-with": "fetch" },
      }),
      { params: Promise.resolve({ id: "inv_1" }) }
    );
    expect(resDelete.status).toBe(401);

    const resSettings = await settingsRoute.GET(
      new NextRequest("https://www.corelogic-system.my/admin/api/company-settings")
    );
    expect(resSettings.status).toBe(401);

    const resIssue = await issueRoute.POST(
      new NextRequest(
        "https://www.corelogic-system.my/admin/api/invoices/inv_1/issue",
        { method: "POST", headers: { "x-requested-with": "fetch" } }
      ),
      { params: Promise.resolve({ id: "inv_1" }) }
    );
    expect(resIssue.status).toBe(401);
  });

  it("rejects cross-origin and CSRF-less mutating requests with HTTP 403 even when authenticated", async () => {
    mockIsAdminAuthenticated.mockResolvedValue(true);

    const invoicesRoute = await import("@/app/(admin)/admin/api/invoices/route");
    const invoiceByIdRoute = await import(
      "@/app/(admin)/admin/api/invoices/[id]/route"
    );

    // 1. Cross-origin Origin header -> 403
    const crossOriginReq = new NextRequest(
      "https://www.corelogic-system.my/admin/api/invoices",
      {
        method: "POST",
        headers: {
          host: "www.corelogic-system.my",
          origin: "https://evil-attacker.example",
          "content-type": "application/json",
        },
        body: JSON.stringify({}),
      }
    );
    const res1 = await invoicesRoute.POST(crossOriginReq);
    expect(res1.status).toBe(403);

    // 2. Missing Origin, Referer, and X-Requested-With -> 403
    const noCsrfReq = new NextRequest(
      "https://www.corelogic-system.my/admin/api/invoices/inv_1",
      {
        method: "DELETE",
        headers: { host: "www.corelogic-system.my" },
      }
    );
    const res2 = await invoiceByIdRoute.DELETE(noCsrfReq, {
      params: Promise.resolve({ id: "inv_1" }),
    });
    expect(res2.status).toBe(403);

    // 3. Cross-site Sec-Fetch-Site -> 403
    const crossSiteFetch = new NextRequest(
      "https://www.corelogic-system.my/admin/api/invoices/inv_1",
      {
        method: "PATCH",
        headers: {
          host: "www.corelogic-system.my",
          "sec-fetch-site": "cross-site",
          "x-requested-with": "fetch",
        },
      }
    );
    const res3 = await invoiceByIdRoute.PATCH(crossSiteFetch, {
      params: Promise.resolve({ id: "inv_1" }),
    });
    expect(res3.status).toBe(403);
  });

  it("blocks PATCH and DELETE directly on the /admin/api/invoices/[id] API for issued invoices (HTTP 409)", async () => {
    mockIsAdminAuthenticated.mockResolvedValue(true);
    mockPrismaInvoiceFindUnique.mockResolvedValue({
      id: "inv_issued_1",
      status: "ISSUED",
      invoiceNumber: "RE-2027-001",
    });

    const invoiceByIdRoute = await import(
      "@/app/(admin)/admin/api/invoices/[id]/route"
    );

    const patchReq = new NextRequest(
      "https://www.corelogic-system.my/admin/api/invoices/inv_issued_1",
      {
        method: "PATCH",
        headers: {
          host: "www.corelogic-system.my",
          origin: "https://www.corelogic-system.my",
          "x-requested-with": "fetch",
          "content-type": "application/json",
        },
        body: JSON.stringify({ notes: "Tamper attempt" }),
      }
    );
    const patchRes = await invoiceByIdRoute.PATCH(patchReq, {
      params: Promise.resolve({ id: "inv_issued_1" }),
    });
    expect(patchRes.status).toBe(409);
    const patchBody = (await patchRes.json()) as { code?: string };
    expect(patchBody.code).toBe("INVOICE_IMMUTABLE");

    const delReq = new NextRequest(
      "https://www.corelogic-system.my/admin/api/invoices/inv_issued_1",
      {
        method: "DELETE",
        headers: {
          host: "www.corelogic-system.my",
          origin: "https://www.corelogic-system.my",
          "x-requested-with": "fetch",
        },
      }
    );
    const delRes = await invoiceByIdRoute.DELETE(delReq, {
      params: Promise.resolve({ id: "inv_issued_1" }),
    });
    expect(delRes.status).toBe(409);
    const delBody = (await delRes.json()) as { code?: string };
    expect(delBody.code).toBe("INVOICE_IMMUTABLE");
  });

  it(
    "blocks deleteLeadAdminAction when lead is linked to issued invoices (GoBD retention)",
    async () => {
      mockPrismaInvoiceFindMany.mockResolvedValue([
        { id: "inv_issued_1", invoiceNumber: "RE-2027-001" },
      ]);
      mockPrismaAuditCreateMany.mockResolvedValue({ count: 1 });

      const { deleteLeadAdminAction } = await import("@/lib/admin/actions");
      const fd = new FormData();
      fd.set("leadId", "lead_with_invoice");

      const result = await deleteLeadAdminAction(fd);
      expect(result.ok).toBe(false);
      expect(result.blockedByInvoices).toBe(true);
      expect(result.invoiceNumbers).toEqual(["RE-2027-001"]);
      expect(mockPrismaAuditCreateMany).toHaveBeenCalledTimes(1);
    },
    15_000
  );
});
