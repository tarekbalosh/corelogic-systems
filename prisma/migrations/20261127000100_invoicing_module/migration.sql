-- German Invoicing Module (GoBD-compliant, EN 16931 / E-Rechnung ready)

-- CreateEnum
CREATE TYPE "invoicing_invoice_type" AS ENUM ('INVOICE', 'CANCELLATION');

-- CreateEnum
CREATE TYPE "invoicing_invoice_status" AS ENUM ('DRAFT', 'ISSUED', 'PAID', 'CANCELLED');

-- CreateEnum
CREATE TYPE "invoicing_tax_treatment" AS ENUM (
    'STANDARD_19',
    'REDUCED_7',
    'ZERO_RATED',
    'KLEINUNTERNEHMER',
    'REVERSE_CHARGE',
    'EXEMPT_NON_EU'
);

-- CreateEnum
CREATE TYPE "invoicing_audit_action" AS ENUM (
    'CREATED',
    'UPDATED',
    'ISSUED',
    'PDF_DOWNLOADED',
    'PAYMENT_RECORDED',
    'CANCELLED',
    'STORNO_CREATED',
    'LEAD_DELETION_BLOCKED'
);

-- CreateTable: Company Settings (Single Source of Truth)
CREATE TABLE "invoicing_company_settings" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "legalName" TEXT NOT NULL DEFAULT 'CoreLogic Systems UG (haftungsbeschränkt)',
    "street" TEXT NOT NULL DEFAULT '',
    "postalCode" TEXT NOT NULL DEFAULT '',
    "city" TEXT NOT NULL DEFAULT '',
    "country" TEXT NOT NULL DEFAULT 'DE',
    "managingDirector" TEXT NOT NULL DEFAULT 'Tarek Balosh',
    "registerCourt" TEXT NOT NULL DEFAULT '',
    "registerNumber" TEXT NOT NULL DEFAULT '',
    "taxNumber" TEXT NOT NULL DEFAULT '',
    "vatId" TEXT NOT NULL DEFAULT '',
    "email" TEXT NOT NULL DEFAULT '',
    "phone" TEXT NOT NULL DEFAULT '',
    "website" TEXT NOT NULL DEFAULT '',
    "bankAccountHolder" TEXT NOT NULL DEFAULT '',
    "bankIban" TEXT NOT NULL DEFAULT '',
    "bankBic" TEXT NOT NULL DEFAULT '',
    "bankName" TEXT NOT NULL DEFAULT '',
    "logoPath" TEXT NOT NULL DEFAULT '/corelogic_logo.png',
    "defaultPaymentTermsDays" INTEGER NOT NULL DEFAULT 14,
    "defaultTaxTreatment" "invoicing_tax_treatment" NOT NULL DEFAULT 'STANDARD_19',
    "kleinunternehmerNotice" TEXT NOT NULL,
    "reverseChargeNotice" TEXT NOT NULL,
    "exemptNonEuNotice" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "invoicing_company_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable: Billing Customers
CREATE TABLE "invoicing_customers" (
    "id" TEXT NOT NULL,
    "customerNumber" TEXT,
    "name" TEXT NOT NULL,
    "companyName" TEXT,
    "contactPerson" TEXT,
    "street" TEXT NOT NULL DEFAULT '',
    "postalCode" TEXT NOT NULL DEFAULT '',
    "city" TEXT NOT NULL DEFAULT '',
    "country" TEXT NOT NULL DEFAULT 'DE',
    "email" TEXT,
    "phone" TEXT,
    "vatId" TEXT,
    "notes" TEXT,
    "leadId" TEXT,
    "bookingId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "invoicing_customers_pkey" PRIMARY KEY ("id")
);

-- CreateTable: Atomic Yearly Sequential Counter
CREATE TABLE "invoicing_sequences" (
    "year" INTEGER NOT NULL,
    "lastNumber" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "invoicing_sequences_pkey" PRIMARY KEY ("year")
);

-- CreateTable: Invoices
CREATE TABLE "invoicing_invoices" (
    "id" TEXT NOT NULL,
    "invoiceNumber" TEXT,
    "invoiceYear" INTEGER,
    "sequenceNumber" INTEGER,
    "type" "invoicing_invoice_type" NOT NULL DEFAULT 'INVOICE',
    "status" "invoicing_invoice_status" NOT NULL DEFAULT 'DRAFT',
    "currency" TEXT NOT NULL DEFAULT 'EUR',
    "taxTreatment" "invoicing_tax_treatment" NOT NULL DEFAULT 'STANDARD_19',
    "issueDate" DATE,
    "serviceDate" DATE,
    "servicePeriodStart" DATE,
    "servicePeriodEnd" DATE,
    "dueDate" DATE,
    "paymentTermsDays" INTEGER NOT NULL DEFAULT 14,
    "customerReference" TEXT,
    "buyerReference" TEXT,
    "paymentReference" TEXT,
    "paymentMeansCode" TEXT NOT NULL DEFAULT '58',
    "en16931Profile" TEXT NOT NULL DEFAULT 'EN16931-READY',
    "notes" TEXT,
    "introText" TEXT NOT NULL,
    "outroText" TEXT NOT NULL,
    "taxLegalNotice" TEXT,
    "subtotalNetCents" INTEGER NOT NULL DEFAULT 0,
    "totalDiscountCents" INTEGER NOT NULL DEFAULT 0,
    "totalVatCents" INTEGER NOT NULL DEFAULT 0,
    "totalGrossCents" INTEGER NOT NULL DEFAULT 0,
    "paidAmountCents" INTEGER NOT NULL DEFAULT 0,
    "taxBreakdownJson" JSONB,
    "customerId" TEXT NOT NULL,
    "correctedInvoiceId" TEXT,
    "issuedAt" TIMESTAMP(3),
    "paidAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "issuerSnapshotJson" JSONB,
    "customerSnapshotJson" JSONB,
    "itemsSnapshotJson" JSONB,
    "pdfBytes" BYTEA,
    "pdfSha256" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "invoicing_invoices_pkey" PRIMARY KEY ("id")
);

-- CreateTable: Invoice Line Items
CREATE TABLE "invoicing_invoice_items" (
    "id" TEXT NOT NULL,
    "invoiceId" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "quantity" DECIMAL(12,4) NOT NULL,
    "unit" TEXT NOT NULL DEFAULT 'Std.',
    "unitCode" TEXT NOT NULL DEFAULT 'HUR',
    "unitPriceNetCents" INTEGER NOT NULL,
    "discountPercent" DECIMAL(5,2) NOT NULL DEFAULT 0,
    "discountCents" INTEGER NOT NULL DEFAULT 0,
    "vatRateBps" INTEGER NOT NULL DEFAULT 1900,
    "vatCategoryCode" TEXT NOT NULL DEFAULT 'S',
    "lineNetCents" INTEGER NOT NULL,

    CONSTRAINT "invoicing_invoice_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable: Invoice Payments
CREATE TABLE "invoicing_payments" (
    "id" TEXT NOT NULL,
    "invoiceId" TEXT NOT NULL,
    "paidAt" DATE NOT NULL,
    "amountCents" INTEGER NOT NULL,
    "method" TEXT NOT NULL,
    "reference" TEXT,
    "notes" TEXT,
    "recordedBy" TEXT NOT NULL DEFAULT 'admin',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "invoicing_payments_pkey" PRIMARY KEY ("id")
);

-- CreateTable: Invoice Audit Logs
CREATE TABLE "invoicing_audit_logs" (
    "id" TEXT NOT NULL,
    "invoiceId" TEXT NOT NULL,
    "action" "invoicing_audit_action" NOT NULL,
    "actor" TEXT NOT NULL DEFAULT 'admin',
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "invoicing_audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "invoicing_customers_customerNumber_key" ON "invoicing_customers"("customerNumber");
CREATE INDEX "invoicing_customers_leadId_idx" ON "invoicing_customers"("leadId");
CREATE INDEX "invoicing_customers_bookingId_idx" ON "invoicing_customers"("bookingId");
CREATE INDEX "invoicing_customers_name_idx" ON "invoicing_customers"("name");

CREATE UNIQUE INDEX "invoicing_invoices_invoiceNumber_key" ON "invoicing_invoices"("invoiceNumber");
CREATE UNIQUE INDEX "invoicing_invoices_invoiceYear_sequenceNumber_key" ON "invoicing_invoices"("invoiceYear", "sequenceNumber");
CREATE INDEX "invoicing_invoices_status_issueDate_idx" ON "invoicing_invoices"("status", "issueDate");
CREATE INDEX "invoicing_invoices_customerId_idx" ON "invoicing_invoices"("customerId");
CREATE INDEX "invoicing_invoices_correctedInvoiceId_idx" ON "invoicing_invoices"("correctedInvoiceId");
CREATE INDEX "invoicing_invoices_dueDate_idx" ON "invoicing_invoices"("dueDate");

CREATE INDEX "invoicing_invoice_items_invoiceId_position_idx" ON "invoicing_invoice_items"("invoiceId", "position");
CREATE INDEX "invoicing_payments_invoiceId_paidAt_idx" ON "invoicing_payments"("invoiceId", "paidAt");
CREATE INDEX "invoicing_audit_logs_invoiceId_createdAt_idx" ON "invoicing_audit_logs"("invoiceId", "createdAt");

-- AddForeignKey
ALTER TABLE "invoicing_customers"
    ADD CONSTRAINT "invoicing_customers_leadId_fkey"
    FOREIGN KEY ("leadId") REFERENCES "agent_leads"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "invoicing_customers"
    ADD CONSTRAINT "invoicing_customers_bookingId_fkey"
    FOREIGN KEY ("bookingId") REFERENCES "agent_bookings"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "invoicing_invoices"
    ADD CONSTRAINT "invoicing_invoices_customerId_fkey"
    FOREIGN KEY ("customerId") REFERENCES "invoicing_customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "invoicing_invoices"
    ADD CONSTRAINT "invoicing_invoices_correctedInvoiceId_fkey"
    FOREIGN KEY ("correctedInvoiceId") REFERENCES "invoicing_invoices"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "invoicing_invoice_items"
    ADD CONSTRAINT "invoicing_invoice_items_invoiceId_fkey"
    FOREIGN KEY ("invoiceId") REFERENCES "invoicing_invoices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "invoicing_payments"
    ADD CONSTRAINT "invoicing_payments_invoiceId_fkey"
    FOREIGN KEY ("invoiceId") REFERENCES "invoicing_invoices"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "invoicing_audit_logs"
    ADD CONSTRAINT "invoicing_audit_logs_invoiceId_fkey"
    FOREIGN KEY ("invoiceId") REFERENCES "invoicing_invoices"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- ============================================================================
-- GoBD Database-Level Immutability Enforcement Triggers
-- ============================================================================

CREATE OR REPLACE FUNCTION invoicing_enforce_invoice_immutability()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        IF OLD."status" <> 'DRAFT' THEN
            RAISE EXCEPTION 'GoBD violation: Issued, paid, or cancelled invoices cannot be deleted (invoiceNumber=%).', OLD."invoiceNumber";
        END IF;
        RETURN OLD;
    END IF;

    IF TG_OP = 'UPDATE' AND OLD."status" <> 'DRAFT' THEN
        -- Only allow controlled lifecycle transitions: status (ISSUED->PAID/CANCELLED), paidAmountCents, paidAt, cancelledAt, updatedAt.
        IF NEW."status" = 'DRAFT' THEN
            RAISE EXCEPTION 'GoBD violation: Issued invoice cannot revert to DRAFT.';
        END IF;

        IF NEW."invoiceNumber" IS DISTINCT FROM OLD."invoiceNumber"
            OR NEW."invoiceYear" IS DISTINCT FROM OLD."invoiceYear"
            OR NEW."sequenceNumber" IS DISTINCT FROM OLD."sequenceNumber"
            OR NEW."type" IS DISTINCT FROM OLD."type"
            OR NEW."currency" IS DISTINCT FROM OLD."currency"
            OR NEW."taxTreatment" IS DISTINCT FROM OLD."taxTreatment"
            OR NEW."issueDate" IS DISTINCT FROM OLD."issueDate"
            OR NEW."serviceDate" IS DISTINCT FROM OLD."serviceDate"
            OR NEW."servicePeriodStart" IS DISTINCT FROM OLD."servicePeriodStart"
            OR NEW."servicePeriodEnd" IS DISTINCT FROM OLD."servicePeriodEnd"
            OR NEW."dueDate" IS DISTINCT FROM OLD."dueDate"
            OR NEW."paymentTermsDays" IS DISTINCT FROM OLD."paymentTermsDays"
            OR NEW."customerReference" IS DISTINCT FROM OLD."customerReference"
            OR NEW."buyerReference" IS DISTINCT FROM OLD."buyerReference"
            OR NEW."paymentReference" IS DISTINCT FROM OLD."paymentReference"
            OR NEW."paymentMeansCode" IS DISTINCT FROM OLD."paymentMeansCode"
            OR NEW."notes" IS DISTINCT FROM OLD."notes"
            OR NEW."introText" IS DISTINCT FROM OLD."introText"
            OR NEW."outroText" IS DISTINCT FROM OLD."outroText"
            OR NEW."taxLegalNotice" IS DISTINCT FROM OLD."taxLegalNotice"
            OR NEW."subtotalNetCents" IS DISTINCT FROM OLD."subtotalNetCents"
            OR NEW."totalDiscountCents" IS DISTINCT FROM OLD."totalDiscountCents"
            OR NEW."totalVatCents" IS DISTINCT FROM OLD."totalVatCents"
            OR NEW."totalGrossCents" IS DISTINCT FROM OLD."totalGrossCents"
            OR NEW."taxBreakdownJson" IS DISTINCT FROM OLD."taxBreakdownJson"
            OR NEW."customerId" IS DISTINCT FROM OLD."customerId"
            OR NEW."correctedInvoiceId" IS DISTINCT FROM OLD."correctedInvoiceId"
            OR NEW."issuedAt" IS DISTINCT FROM OLD."issuedAt"
            OR NEW."issuerSnapshotJson" IS DISTINCT FROM OLD."issuerSnapshotJson"
            OR NEW."customerSnapshotJson" IS DISTINCT FROM OLD."customerSnapshotJson"
            OR NEW."itemsSnapshotJson" IS DISTINCT FROM OLD."itemsSnapshotJson"
            OR NEW."pdfBytes" IS DISTINCT FROM OLD."pdfBytes"
            OR NEW."pdfSha256" IS DISTINCT FROM OLD."pdfSha256"
        THEN
            RAISE EXCEPTION 'GoBD violation: Immutable invoice fields cannot be modified after issuing (invoiceNumber=%).', OLD."invoiceNumber";
        END IF;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_invoicing_invoices_immutable
BEFORE UPDATE OR DELETE ON "invoicing_invoices"
FOR EACH ROW
EXECUTE FUNCTION invoicing_enforce_invoice_immutability();

CREATE OR REPLACE FUNCTION invoicing_enforce_item_immutability()
RETURNS TRIGGER AS $$
DECLARE
    parent_status "invoicing_invoice_status";
BEGIN
    SELECT "status" INTO parent_status
    FROM "invoicing_invoices"
    WHERE "id" = COALESCE(NEW."invoiceId", OLD."invoiceId");

    IF parent_status IS NOT NULL AND parent_status <> 'DRAFT' THEN
        RAISE EXCEPTION 'GoBD violation: Line items of an issued invoice cannot be added, modified, or deleted.';
    END IF;

    IF TG_OP = 'DELETE' THEN
        RETURN OLD;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_invoicing_items_immutable
BEFORE INSERT OR UPDATE OR DELETE ON "invoicing_invoice_items"
FOR EACH ROW
EXECUTE FUNCTION invoicing_enforce_item_immutability();
