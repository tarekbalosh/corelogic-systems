"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { TaxTreatment } from "@prisma/client";
import {
  AlertTriangle,
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  CheckCircle2,
  Eye,
  FileCheck2,
  Loader2,
  Pencil,
  Plus,
  Save,
  Trash2,
  UserPlus,
} from "lucide-react";
import {
  ALLOWED_VAT_RATES_BPS,
  DEFAULT_INVOICE_INTRO_TEXT,
  DEFAULT_INVOICE_OUTRO_TEXT,
  INVOICE_UNIT_OPTIONS,
  TAX_TREATMENT_META,
  resolveUnitCode,
} from "@/lib/invoicing/constants";
import {
  addDaysUtc,
  calculateInvoiceTotals,
  eurosToCents,
  formatDateDe,
  formatEurDe,
  formatVatRateDe,
  parseIsoDateOnly,
  toIsoDateOnly,
} from "@/lib/invoicing/money";
import type {
  SerializedBillingCustomer,
  SerializedCompanySettings,
  SerializedInvoiceDetail,
} from "@/lib/invoicing/types";
import {
  validateInvoiceForIssuance,
  type IssuanceValidationIssue,
} from "@/lib/invoicing/validators";
import {
  ConfirmDialog,
  Drawer,
  FormField,
  StatusBadge,
  adminInputClassName,
  useToast,
} from "@/components/admin/ui";
import {
  adminApiJson,
  adminApiPdfBlob,
  InvoicingApiClientError,
} from "./api-client";

interface EditorItemRow {
  localId: string;
  description: string;
  quantity: string;
  unit: string;
  unitPriceEur: string;
  discountPercent: string;
  vatRateBps: number;
}

interface InvoiceEditorProps {
  mode: "create" | "edit";
  company: SerializedCompanySettings;
  initialCustomers: SerializedBillingCustomer[];
  initialInvoice?: SerializedInvoiceDetail;
  preselectedCustomerId?: string;
}

function centsToInputEur(cents: number): string {
  return (cents / 100).toFixed(2).replace(".", ",");
}

function safeParseEurosToCents(val: string): number {
  try {
    if (!val.trim()) return 0;
    return Math.max(0, eurosToCents(val));
  } catch {
    return 0;
  }
}

function resolveNoticeForTreatment(
  treatment: TaxTreatment,
  company: SerializedCompanySettings
): string {
  if (treatment === "KLEINUNTERNEHMER") return company.kleinunternehmerNotice;
  if (treatment === "REVERSE_CHARGE") return company.reverseChargeNotice;
  if (treatment === "EXEMPT_NON_EU") return company.exemptNonEuNotice;
  return "";
}

export function InvoiceEditor({
  mode,
  company,
  initialCustomers,
  initialInvoice,
  preselectedCustomerId,
}: InvoiceEditorProps) {
  const router = useRouter();
  const toast = useToast();

  const todayIso = useMemo(() => toIsoDateOnly(new Date())!, []);
  const [customers, setCustomers] =
    useState<SerializedBillingCustomer[]>(initialCustomers);

  const [customerId, setCustomerId] = useState<string>(
    initialInvoice?.customerId ??
      preselectedCustomerId ??
      initialCustomers[0]?.id ??
      ""
  );
  const [taxTreatment, setTaxTreatment] = useState<TaxTreatment>(
    initialInvoice?.taxTreatment ?? company.defaultTaxTreatment
  );
  const [issueDate, setIssueDate] = useState<string>(
    initialInvoice?.issueDate ?? todayIso
  );
  const [serviceMode, setServiceMode] = useState<"single" | "period">(
    initialInvoice?.servicePeriodStart && initialInvoice?.servicePeriodEnd
      ? "period"
      : "single"
  );
  const [serviceDate, setServiceDate] = useState<string>(
    initialInvoice?.serviceDate ?? todayIso
  );
  const [servicePeriodStart, setServicePeriodStart] = useState<string>(
    initialInvoice?.servicePeriodStart ?? ""
  );
  const [servicePeriodEnd, setServicePeriodEnd] = useState<string>(
    initialInvoice?.servicePeriodEnd ?? ""
  );
  const [paymentTermsDays, setPaymentTermsDays] = useState<number>(
    initialInvoice?.paymentTermsDays ?? company.defaultPaymentTermsDays
  );
  const [customerReference, setCustomerReference] = useState<string>(
    initialInvoice?.customerReference ?? ""
  );
  const [buyerReference, setBuyerReference] = useState<string>(
    initialInvoice?.buyerReference ?? ""
  );
  const [introText, setIntroText] = useState<string>(
    initialInvoice?.introText ?? DEFAULT_INVOICE_INTRO_TEXT
  );
  const [outroText, setOutroText] = useState<string>(
    initialInvoice?.outroText ?? DEFAULT_INVOICE_OUTRO_TEXT
  );
  const [taxLegalNotice, setTaxLegalNotice] = useState<string>(
    initialInvoice?.taxLegalNotice ??
      resolveNoticeForTreatment(
        initialInvoice?.taxTreatment ?? company.defaultTaxTreatment,
        company
      )
  );
  const [notes, setNotes] = useState<string>(initialInvoice?.notes ?? "");

  const [items, setItems] = useState<EditorItemRow[]>(() => {
    if (initialInvoice && initialInvoice.items.length > 0) {
      return initialInvoice.items.map((it, idx) => ({
        localId: `item-${idx}-${it.position}`,
        description: it.description,
        quantity: it.quantity.replace(".", ","),
        unit: it.unit,
        unitPriceEur: centsToInputEur(it.unitPriceNetCents),
        discountPercent:
          Number(it.discountPercent) > 0
            ? it.discountPercent.replace(".", ",")
            : "0",
        vatRateBps: it.vatRateBps,
      }));
    }
    return [
      {
        localId: "item-initial-1",
        description: "",
        quantity: "1",
        unit: "Pauschal",
        unitPriceEur: "0,00",
        discountPercent: "0",
        vatRateBps: TAX_TREATMENT_META[company.defaultTaxTreatment].defaultVatRateBps,
      },
    ];
  });

  // UI modal / drawer states
  const [saving, setSaving] = useState(false);
  const [issuing, setIssuing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmIssueOpen, setConfirmIssueOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [serverIssues, setServerIssues] = useState<IssuanceValidationIssue[]>(
    []
  );

  // Customer Drawer (Create or Edit selected customer)
  const [customerDrawerOpen, setCustomerDrawerOpen] = useState(false);
  const [editingCustomerId, setEditingCustomerId] = useState<string | null>(
    null
  );
  const [customerSaving, setCustomerSaving] = useState(false);
  const [customerForm, setCustomerForm] = useState({
    name: "",
    companyName: "",
    contactPerson: "",
    street: "",
    postalCode: "",
    city: "",
    country: "DE",
    email: "",
    phone: "",
    vatId: "",
    notes: "",
  });

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const selectedCustomer = useMemo(
    () => customers.find((c) => c.id === customerId) ?? null,
    [customers, customerId]
  );

  const dueDatePreview = useMemo(() => {
    if (!issueDate) return "—";
    try {
      const due = addDaysUtc(parseIsoDateOnly(issueDate), paymentTermsDays);
      return formatDateDe(due);
    } catch {
      return "—";
    }
  }, [issueDate, paymentTermsDays]);

  const taxMeta = TAX_TREATMENT_META[taxTreatment];

  // Live financial calculation (exact integer-cent math, identical to server)
  const liveCalc = useMemo(() => {
    try {
      return calculateInvoiceTotals(
        items.map((row) => ({
          quantity: row.quantity.trim() || "0",
          unitPriceNetCents: safeParseEurosToCents(row.unitPriceEur),
          discountPercent: row.discountPercent.trim() || "0",
          vatRateBps: row.vatRateBps,
        })),
        taxTreatment
      );
    } catch {
      return {
        items: [],
        taxBreakdown: [],
        subtotalNetCents: 0,
        totalDiscountCents: 0,
        totalVatCents: 0,
        totalGrossCents: 0,
      };
    }
  }, [items, taxTreatment]);

  // Live pre-issuance completeness check
  const readinessIssues = useMemo(() => {
    const hasValidItems =
      items.length > 0 &&
      items.every((row) => {
        const qty = Number(row.quantity.replace(",", "."));
        return row.description.trim().length > 0 && Number.isFinite(qty) && qty > 0;
      });

    return validateInvoiceForIssuance({
      company,
      customer: selectedCustomer ?? {
        name: "",
        companyName: "",
        street: "",
        postalCode: "",
        city: "",
        country: "DE",
        vatId: "",
      },
      taxTreatment,
      serviceDate: serviceMode === "single" ? serviceDate || null : null,
      servicePeriodStart:
        serviceMode === "period" ? servicePeriodStart || null : null,
      servicePeriodEnd:
        serviceMode === "period" ? servicePeriodEnd || null : null,
      itemsCount: items.length,
      hasValidItemAmounts: hasValidItems,
      taxLegalNotice,
    });
  }, [
    company,
    selectedCustomer,
    taxTreatment,
    serviceMode,
    serviceDate,
    servicePeriodStart,
    servicePeriodEnd,
    items,
    taxLegalNotice,
  ]);

  const handleTaxTreatmentChange = (next: TaxTreatment) => {
    setTaxTreatment(next);
    const nextMeta = TAX_TREATMENT_META[next];
    setTaxLegalNotice(resolveNoticeForTreatment(next, company));
    setItems((prev) =>
      prev.map((row) => ({
        ...row,
        vatRateBps: nextMeta.allowPerItemRate
          ? next === "REDUCED_7"
            ? 700
            : row.vatRateBps || nextMeta.defaultVatRateBps
          : nextMeta.defaultVatRateBps,
      }))
    );
  };

  const addLineItem = () => {
    setItems((prev) => [
      ...prev,
      {
        localId: `item-${Date.now()}-${prev.length}`,
        description: "",
        quantity: "1",
        unit: "Std.",
        unitPriceEur: "0,00",
        discountPercent: "0",
        vatRateBps: taxMeta.defaultVatRateBps,
      },
    ]);
  };

  const updateItem = <K extends keyof EditorItemRow>(
    localId: string,
    key: K,
    value: EditorItemRow[K]
  ) => {
    setItems((prev) =>
      prev.map((row) => (row.localId === localId ? { ...row, [key]: value } : row))
    );
  };

  const removeItem = (localId: string) => {
    setItems((prev) => (prev.length > 1 ? prev.filter((r) => r.localId !== localId) : prev));
  };

  const moveItem = (idx: number, delta: -1 | 1) => {
    const target = idx + delta;
    if (target < 0 || target >= items.length) return;
    setItems((prev) => {
      const next = [...prev];
      const [moved] = next.splice(idx, 1);
      next.splice(target, 0, moved);
      return next;
    });
  };

  const buildPayload = () => ({
    customerId,
    taxTreatment,
    issueDate: issueDate || null,
    serviceDate: serviceMode === "single" ? serviceDate || null : null,
    servicePeriodStart:
      serviceMode === "period" ? servicePeriodStart || null : null,
    servicePeriodEnd: serviceMode === "period" ? servicePeriodEnd || null : null,
    paymentTermsDays,
    customerReference: customerReference.trim() || null,
    buyerReference: buyerReference.trim() || null,
    notes: notes.trim() || null,
    introText,
    outroText,
    taxLegalNotice: taxLegalNotice.trim() || null,
    items: items.map((row) => ({
      description: row.description.trim(),
      quantity: row.quantity.trim().replace(",", "."),
      unit: row.unit,
      unitCode: resolveUnitCode(row.unit),
      unitPriceNetCents: safeParseEurosToCents(row.unitPriceEur),
      discountPercent: row.discountPercent.trim().replace(",", ".") || "0",
      discountCents: 0,
      vatRateBps: taxMeta.allowPerItemRate
        ? row.vatRateBps
        : taxMeta.defaultVatRateBps,
    })),
  });

  const saveDraftInternal = async (): Promise<SerializedInvoiceDetail | null> => {
    setServerIssues([]);
    if (!customerId) {
      toast.error("Customer required", "Please select or create a billing customer.");
      return null;
    }

    const payload = buildPayload();
    if (mode === "create") {
      const res = await adminApiJson<{ invoice: SerializedInvoiceDetail }>(
        "/admin/api/invoices",
        { method: "POST", body: payload }
      );
      return res.invoice;
    }

    const res = await adminApiJson<{ invoice: SerializedInvoiceDetail }>(
      `/admin/api/invoices/${initialInvoice!.id}`,
      { method: "PATCH", body: payload }
    );
    return res.invoice;
  };

  const handleSaveDraft = async () => {
    setSaving(true);
    try {
      const saved = await saveDraftInternal();
      if (!saved) return;
      toast.success(
        "Draft saved",
        "No invoice number was consumed. You can continue editing or preview the PDF."
      );
      if (mode === "create") {
        router.push(`/admin/invoices/${saved.id}`);
      } else {
        router.refresh();
      }
    } catch (err) {
      const msg =
        err instanceof InvoicingApiClientError
          ? err.message
          : "Could not save draft.";
      toast.error("Could not save draft", msg);
    } finally {
      setSaving(false);
    }
  };

  const handlePreviewPdf = async () => {
    if (!customerId) {
      toast.error("Customer required", "Select a customer to preview the PDF.");
      return;
    }
    setPreviewLoading(true);
    try {
      const blob = await adminApiPdfBlob("/admin/api/invoices/preview-pdf", {
        method: "POST",
        body: buildPayload(),
      });
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      const nextUrl = URL.createObjectURL(blob);
      setPreviewUrl(nextUrl);
      setPreviewOpen(true);
    } catch (err) {
      const msg =
        err instanceof InvoicingApiClientError
          ? err.message
          : "Could not render PDF preview.";
      toast.error("Preview failed", msg);
    } finally {
      setPreviewLoading(false);
    }
  };

  const handleConfirmIssue = async () => {
    setIssuing(true);
    setServerIssues([]);
    try {
      // Save latest form state first, then issue atomically
      const saved = await saveDraftInternal();
      if (!saved) {
        setConfirmIssueOpen(false);
        return;
      }

      const res = await adminApiJson<{ invoice: SerializedInvoiceDetail }>(
        `/admin/api/invoices/${saved.id}/issue`,
        {
          method: "POST",
          body: { issueDate: issueDate || undefined },
        }
      );

      setConfirmIssueOpen(false);
      toast.success(
        `Rechnung ${res.invoice.invoiceNumber} ausgestellt`,
        "Invoice is now finalized, numbered, archived as PDF, and GoBD-locked."
      );
      router.push(`/admin/invoices/${res.invoice.id}`);
      router.refresh();
    } catch (err) {
      setConfirmIssueOpen(false);
      if (err instanceof InvoicingApiClientError) {
        if (err.issues && err.issues.length > 0) {
          setServerIssues(err.issues);
        }
        toast.error("Issuing blocked", err.message);
      } else {
        toast.error("Issuing failed", "Unexpected error while issuing invoice.");
      }
    } finally {
      setIssuing(false);
    }
  };

  const handleDeleteDraft = async () => {
    if (!initialInvoice) return;
    setDeleting(true);
    try {
      await adminApiJson(`/admin/api/invoices/${initialInvoice.id}`, {
        method: "DELETE",
      });
      setConfirmDeleteOpen(false);
      toast.success(
        "Draft deleted",
        "The unissued draft was removed without affecting invoice numbering."
      );
      router.push("/admin/invoices");
      router.refresh();
    } catch (err) {
      setConfirmDeleteOpen(false);
      const msg =
        err instanceof InvoicingApiClientError
          ? err.message
          : "Could not delete draft.";
      toast.error("Delete failed", msg);
    } finally {
      setDeleting(false);
    }
  };

  const openNewCustomerDrawer = () => {
    setEditingCustomerId(null);
    setCustomerForm({
      name: "",
      companyName: "",
      contactPerson: "",
      street: "",
      postalCode: "",
      city: "",
      country: "DE",
      email: "",
      phone: "",
      vatId: "",
      notes: "",
    });
    setCustomerDrawerOpen(true);
  };

  const openEditCustomerDrawer = () => {
    if (!selectedCustomer) return;
    setEditingCustomerId(selectedCustomer.id);
    setCustomerForm({
      name: selectedCustomer.name,
      companyName: selectedCustomer.companyName ?? "",
      contactPerson: selectedCustomer.contactPerson ?? "",
      street: selectedCustomer.street,
      postalCode: selectedCustomer.postalCode,
      city: selectedCustomer.city,
      country: selectedCustomer.country || "DE",
      email: selectedCustomer.email ?? "",
      phone: selectedCustomer.phone ?? "",
      vatId: selectedCustomer.vatId ?? "",
      notes: selectedCustomer.notes ?? "",
    });
    setCustomerDrawerOpen(true);
  };

  const handleSaveCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    setCustomerSaving(true);
    try {
      if (editingCustomerId) {
        const res = await adminApiJson<{ customer: SerializedBillingCustomer }>(
          `/admin/api/customers/${editingCustomerId}`,
          { method: "PUT", body: customerForm }
        );
        setCustomers((prev) =>
          prev.map((c) => (c.id === res.customer.id ? res.customer : c))
        );
        toast.success("Customer updated", res.customer.name);
      } else {
        const res = await adminApiJson<{ customer: SerializedBillingCustomer }>(
          "/admin/api/customers",
          { method: "POST", body: customerForm }
        );
        setCustomers((prev) => [res.customer, ...prev]);
        setCustomerId(res.customer.id);
        toast.success("Customer created", res.customer.name);
      }
      setCustomerDrawerOpen(false);
    } catch (err) {
      const msg =
        err instanceof InvoicingApiClientError
          ? err.message
          : "Could not save customer.";
      toast.error("Customer error", msg);
    } finally {
      setCustomerSaving(false);
    }
  };

  const displayedIssues = serverIssues.length > 0 ? serverIssues : readinessIssues;

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col justify-between gap-3 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-2xs sm:flex-row sm:items-center">
        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/admin/invoices"
            className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-50"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Invoices</span>
          </Link>
          <StatusBadge status="DRAFT" size="md" />
          <h2 className="font-heading text-base font-bold text-slate-900">
            {mode === "create" ? "New Invoice Draft" : "Edit Invoice Draft"}
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {mode === "edit" && (
            <button
              type="button"
              onClick={() => setConfirmDeleteOpen(true)}
              disabled={saving || issuing || deleting}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-xs font-bold text-rose-700 hover:bg-rose-100 disabled:opacity-60"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Delete Draft</span>
            </button>
          )}
          <button
            type="button"
            onClick={handlePreviewPdf}
            disabled={previewLoading}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
          >
            {previewLoading ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Eye className="h-3.5 w-3.5" />
            )}
            <span>PDF-Vorschau</span>
          </button>
          <button
            type="button"
            onClick={handleSaveDraft}
            disabled={saving || issuing}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50 px-3.5 py-2 text-xs font-bold text-indigo-700 hover:bg-indigo-100 disabled:opacity-60"
          >
            {saving ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Save className="h-3.5 w-3.5" />
            )}
            <span>Save Draft</span>
          </button>
          <button
            type="button"
            onClick={() => setConfirmIssueOpen(true)}
            disabled={saving || issuing}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-2xs transition-colors hover:bg-indigo-700 disabled:opacity-60"
          >
            <FileCheck2 className="h-3.5 w-3.5" />
            <span>Rechnung ausstellen</span>
          </button>
        </div>
      </div>

      {/* Main 2-Column Layout */}
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
        {/* Left 8 Columns: Customer, Dates, Line Items, Texts */}
        <div className="space-y-6 lg:col-span-8">
          {/* Customer Selection */}
          <section className="space-y-4 rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-heading text-sm font-bold text-slate-900">
                1. Rechnungsempfänger (Billing Customer)
              </h3>
              <div className="flex items-center gap-2">
                {selectedCustomer && (
                  <button
                    type="button"
                    onClick={openEditCustomerDrawer}
                    className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    <Pencil className="h-3 w-3" />
                    <span>Edit Address</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={openNewCustomerDrawer}
                  className="inline-flex cursor-pointer items-center gap-1 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-bold text-white hover:bg-slate-800"
                >
                  <UserPlus className="h-3.5 w-3.5" />
                  <span>New Customer</span>
                </button>
              </div>
            </div>

            <FormField label="Select Customer" htmlFor="inv-customer" required>
              <select
                id="inv-customer"
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
                className={adminInputClassName}
              >
                <option value="">— Choose billing customer —</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.companyName ? `${c.companyName} (${c.name})` : c.name}
                    {c.customerNumber ? ` · ${c.customerNumber}` : ""}
                  </option>
                ))}
              </select>
            </FormField>

            {selectedCustomer && (
              <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-3.5 text-xs text-slate-700">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-bold text-slate-900">
                      {selectedCustomer.companyName || selectedCustomer.name}
                    </p>
                    {selectedCustomer.companyName &&
                      selectedCustomer.name !== selectedCustomer.companyName && (
                        <p>z. Hd. {selectedCustomer.contactPerson || selectedCustomer.name}</p>
                      )}
                    <p className="mt-0.5">
                      {selectedCustomer.street || (
                        <span className="font-semibold text-amber-700">
                          [Missing Street]
                        </span>
                      )}
                    </p>
                    <p>
                      {selectedCustomer.postalCode || (
                        <span className="font-semibold text-amber-700">[PLZ]</span>
                      )}{" "}
                      {selectedCustomer.city || (
                        <span className="font-semibold text-amber-700">[City]</span>
                      )}{" "}
                      ({selectedCustomer.country})
                    </p>
                  </div>
                  <div className="text-right text-[11px] text-slate-500">
                    {selectedCustomer.customerNumber && (
                      <p>Kd.-Nr.: {selectedCustomer.customerNumber}</p>
                    )}
                    {selectedCustomer.email && <p>{selectedCustomer.email}</p>}
                    {selectedCustomer.vatId && (
                      <p className="font-semibold text-slate-700">
                        USt-IdNr.: {selectedCustomer.vatId}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* Dates, Tax Treatment & References */}
          <section className="space-y-4 rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs">
            <h3 className="font-heading text-sm font-bold text-slate-900">
              2. Rechnungsdaten &amp; Steuerbehandlung (§ 14 UStG)
            </h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField label="Tax Treatment (Steuerbehandlung)" htmlFor="inv-tax" required>
                <select
                  id="inv-tax"
                  value={taxTreatment}
                  onChange={(e) =>
                    handleTaxTreatmentChange(e.target.value as TaxTreatment)
                  }
                  className={adminInputClassName}
                >
                  {Object.values(TAX_TREATMENT_META).map((meta) => (
                    <option key={meta.value} value={meta.value}>
                      {meta.label}
                    </option>
                  ))}
                </select>
              </FormField>

              <FormField
                label="Payment Terms (Zahlungsziel in Tagen)"
                htmlFor="inv-terms"
                hint={`Calculated due date: ${dueDatePreview}`}
              >
                <input
                  id="inv-terms"
                  type="number"
                  min={0}
                  max={180}
                  value={paymentTermsDays}
                  onChange={(e) =>
                    setPaymentTermsDays(Math.max(0, Number(e.target.value) || 0))
                  }
                  className={adminInputClassName}
                />
              </FormField>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <FormField label="Rechnungsdatum" htmlFor="inv-issueDate" required>
                <input
                  id="inv-issueDate"
                  type="date"
                  value={issueDate}
                  onChange={(e) => setIssueDate(e.target.value)}
                  className={adminInputClassName}
                />
              </FormField>

              <div className="sm:col-span-2">
                <div className="mb-1.5 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-700">
                    Leistungsdatum / Leistungszeitraum{" "}
                    <span className="text-rose-500">*</span>
                  </span>
                  <div className="inline-flex rounded-lg bg-slate-100 p-0.5 text-[11px] font-semibold">
                    <button
                      type="button"
                      onClick={() => setServiceMode("single")}
                      className={`cursor-pointer rounded-md px-2 py-0.5 ${
                        serviceMode === "single"
                          ? "bg-white text-slate-900 shadow-2xs"
                          : "text-slate-500"
                      }`}
                    >
                      Single Date
                    </button>
                    <button
                      type="button"
                      onClick={() => setServiceMode("period")}
                      className={`cursor-pointer rounded-md px-2 py-0.5 ${
                        serviceMode === "period"
                          ? "bg-white text-slate-900 shadow-2xs"
                          : "text-slate-500"
                      }`}
                    >
                      Period (Von–Bis)
                    </button>
                  </div>
                </div>

                {serviceMode === "single" ? (
                  <input
                    type="date"
                    aria-label="Leistungsdatum"
                    value={serviceDate}
                    onChange={(e) => setServiceDate(e.target.value)}
                    className={adminInputClassName}
                  />
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="date"
                      aria-label="Leistungszeitraum Start"
                      value={servicePeriodStart}
                      onChange={(e) => setServicePeriodStart(e.target.value)}
                      className={adminInputClassName}
                    />
                    <input
                      type="date"
                      aria-label="Leistungszeitraum Ende"
                      value={servicePeriodEnd}
                      onChange={(e) => setServicePeriodEnd(e.target.value)}
                      className={adminInputClassName}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                label="Customer / PO Reference (optional)"
                htmlFor="inv-custRef"
              >
                <input
                  id="inv-custRef"
                  type="text"
                  value={customerReference}
                  onChange={(e) => setCustomerReference(e.target.value)}
                  placeholder="z. B. Bestellung #2027-42"
                  className={adminInputClassName}
                />
              </FormField>
              <FormField
                label="Buyer Reference / Leitweg-ID (EN 16931 optional)"
                htmlFor="inv-buyerRef"
                hint="Stored for future XRechnung / E-Rechnung BT-10."
              >
                <input
                  id="inv-buyerRef"
                  type="text"
                  value={buyerReference}
                  onChange={(e) => setBuyerReference(e.target.value)}
                  placeholder="z. B. 04011000-12345-67"
                  className={adminInputClassName}
                />
              </FormField>
            </div>
          </section>

          {/* Line Items */}
          <section className="space-y-4 rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-heading text-sm font-bold text-slate-900">
                3. Rechnungspositionen (Line Items)
              </h3>
              <button
                type="button"
                onClick={addLineItem}
                className="inline-flex cursor-pointer items-center gap-1 rounded-xl bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-700 hover:bg-indigo-100"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Position</span>
              </button>
            </div>

            <div className="space-y-3">
              {items.map((row, idx) => {
                const lineCalc = liveCalc.items[idx];
                return (
                  <div
                    key={row.localId}
                    className="rounded-xl border border-slate-200/90 bg-slate-50/50 p-3.5"
                  >
                    <div className="mb-2.5 flex items-center justify-between gap-2">
                      <span className="inline-flex items-center rounded-md bg-slate-200/80 px-2 py-0.5 text-[11px] font-bold text-slate-700">
                        Pos. {idx + 1}
                      </span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => moveItem(idx, -1)}
                          disabled={idx === 0}
                          aria-label="Move position up"
                          className="cursor-pointer rounded-md p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-700 disabled:opacity-30"
                        >
                          <ArrowUp className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveItem(idx, 1)}
                          disabled={idx === items.length - 1}
                          aria-label="Move position down"
                          className="cursor-pointer rounded-md p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-700 disabled:opacity-30"
                        >
                          <ArrowDown className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeItem(row.localId)}
                          disabled={items.length <= 1}
                          aria-label="Remove position"
                          className="cursor-pointer rounded-md p-1 text-rose-500 hover:bg-rose-50 disabled:opacity-30"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <FormField label="Leistungsbeschreibung" required>
                        <textarea
                          rows={2}
                          value={row.description}
                          onChange={(e) =>
                            updateItem(row.localId, "description", e.target.value)
                          }
                          placeholder="z. B. Konzeption & Entwicklung Webapplikation (Next.js)"
                          className={adminInputClassName}
                        />
                      </FormField>

                      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-6">
                        <FormField label="Menge" required>
                          <input
                            type="text"
                            inputMode="decimal"
                            value={row.quantity}
                            onChange={(e) =>
                              updateItem(row.localId, "quantity", e.target.value)
                            }
                            placeholder="1"
                            className={adminInputClassName}
                          />
                        </FormField>

                        <FormField label="Einheit">
                          <select
                            value={row.unit}
                            onChange={(e) =>
                              updateItem(row.localId, "unit", e.target.value)
                            }
                            className={adminInputClassName}
                          >
                            {INVOICE_UNIT_OPTIONS.map((opt) => (
                              <option key={opt.label} value={opt.label}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        </FormField>

                        <FormField label="Einzelpreis (€ Netto)" required>
                          <input
                            type="text"
                            inputMode="decimal"
                            value={row.unitPriceEur}
                            onChange={(e) =>
                              updateItem(
                                row.localId,
                                "unitPriceEur",
                                e.target.value
                              )
                            }
                            placeholder="2000,00"
                            className={adminInputClassName}
                          />
                        </FormField>

                        <FormField label="Rabatt (%)">
                          <input
                            type="text"
                            inputMode="decimal"
                            value={row.discountPercent}
                            onChange={(e) =>
                              updateItem(
                                row.localId,
                                "discountPercent",
                                e.target.value
                              )
                            }
                            placeholder="0"
                            className={adminInputClassName}
                          />
                        </FormField>

                        <FormField label="USt.-Satz">
                          <select
                            value={
                              taxMeta.allowPerItemRate
                                ? row.vatRateBps
                                : taxMeta.defaultVatRateBps
                            }
                            disabled={!taxMeta.allowPerItemRate}
                            onChange={(e) =>
                              updateItem(
                                row.localId,
                                "vatRateBps",
                                Number(e.target.value)
                              )
                            }
                            className={adminInputClassName}
                          >
                            {ALLOWED_VAT_RATES_BPS.map((rate) => (
                              <option key={rate} value={rate}>
                                {formatVatRateDe(rate)}
                              </option>
                            ))}
                          </select>
                        </FormField>

                        <div className="flex flex-col justify-end">
                          <span className="text-[11px] font-semibold text-slate-500">
                            Gesamt (Netto)
                          </span>
                          <p className="mt-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-right text-xs font-bold tabular-nums text-slate-900">
                            {formatEurDe(lineCalc?.lineNetCents ?? 0)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Texts & Legal Notice */}
          <section className="space-y-4 rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs">
            <h3 className="font-heading text-sm font-bold text-slate-900">
              4. Einleitung, Schlusstext &amp; Steuerhinweis
            </h3>

            <FormField label="Einleitungstext (Intro)" htmlFor="inv-intro">
              <textarea
                id="inv-intro"
                rows={3}
                value={introText}
                onChange={(e) => setIntroText(e.target.value)}
                className={adminInputClassName}
              />
            </FormField>

            {(taxTreatment === "KLEINUNTERNEHMER" ||
              taxTreatment === "REVERSE_CHARGE" ||
              taxTreatment === "EXEMPT_NON_EU" ||
              taxLegalNotice.trim().length > 0) && (
              <FormField
                label="Steuerhinweis (Legal Tax Notice on PDF)"
                htmlFor="inv-taxNotice"
                hint="Auto-populated from Settings → Company; editable per invoice."
              >
                <textarea
                  id="inv-taxNotice"
                  rows={2}
                  value={taxLegalNotice}
                  onChange={(e) => setTaxLegalNotice(e.target.value)}
                  className={adminInputClassName}
                />
              </FormField>
            )}

            <FormField label="Schlusstext (Outro)" htmlFor="inv-outro">
              <textarea
                id="inv-outro"
                rows={2}
                value={outroText}
                onChange={(e) => setOutroText(e.target.value)}
                className={adminInputClassName}
              />
            </FormField>

            <FormField label="Zusätzlicher Hinweis / Notiz (optional)" htmlFor="inv-notes">
              <textarea
                id="inv-notes"
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Optionale Bemerkung auf der Rechnung…"
                className={adminInputClassName}
              />
            </FormField>
          </section>
        </div>

        {/* Right 4 Columns: Sticky Live Summary & Issuance Readiness */}
        <aside className="space-y-4 lg:sticky lg:top-24 lg:col-span-4">
          <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs">
            <h3 className="font-heading text-sm font-bold text-slate-900">
              Summenübersicht (EUR)
            </h3>
            <dl className="mt-4 space-y-2.5 text-xs">
              {liveCalc.totalDiscountCents > 0 && (
                <div className="flex items-center justify-between text-slate-500">
                  <dt>Enthaltener Rabatt</dt>
                  <dd className="tabular-nums">
                    {formatEurDe(-liveCalc.totalDiscountCents)}
                  </dd>
                </div>
              )}
              <div className="flex items-center justify-between text-slate-700">
                <dt>Zwischensumme (Netto)</dt>
                <dd className="font-semibold tabular-nums">
                  {formatEurDe(liveCalc.subtotalNetCents)}
                </dd>
              </div>
              {liveCalc.taxBreakdown.map((bucket) => (
                <div
                  key={`${bucket.vatRateBps}-${bucket.vatCategoryCode}`}
                  className="flex items-center justify-between text-slate-600"
                >
                  <dt>
                    zzgl. USt. ({formatVatRateDe(bucket.vatRateBps)}
                    {liveCalc.taxBreakdown.length > 1
                      ? ` auf ${formatEurDe(bucket.netCents)}`
                      : ""}
                    )
                  </dt>
                  <dd className="tabular-nums">{formatEurDe(bucket.vatCents)}</dd>
                </div>
              ))}
              <div className="flex items-center justify-between border-t border-slate-200 pt-3 text-sm font-bold text-slate-900">
                <dt>Gesamtbetrag (Brutto)</dt>
                <dd className="text-base tabular-nums text-indigo-700">
                  {formatEurDe(liveCalc.totalGrossCents)}
                </dd>
              </div>
            </dl>
          </div>

          {/* Pre-Issuance Checklist */}
          <div
            className={`rounded-2xl border p-4 text-xs ${
              displayedIssues.length === 0
                ? "border-emerald-200 bg-emerald-50/70 text-emerald-900"
                : "border-amber-200 bg-amber-50/80 text-amber-950"
            }`}
          >
            <div className="flex items-start gap-2.5">
              {displayedIssues.length === 0 ? (
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
              ) : (
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
              )}
              <div className="min-w-0 flex-1">
                <p className="font-bold">
                  {displayedIssues.length === 0
                    ? "Ready to issue (GoBD & § 14 UStG)"
                    : `${displayedIssues.length} mandatory check${displayedIssues.length === 1 ? "" : "s"} required before issuing`}
                </p>
                {displayedIssues.length > 0 && (
                  <>
                    <ul className="mt-2 space-y-1 text-[11px]">
                      {displayedIssues.map((iss, i) => (
                        <li key={`${iss.field}-${i}`} className="flex items-start gap-1.5">
                          <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-600" />
                          <span>{iss.message}</span>
                        </li>
                      ))}
                    </ul>
                    {displayedIssues.some((i) => i.section === "company") && (
                      <Link
                        href="/admin/settings/company"
                        className="mt-2.5 inline-flex items-center text-[11px] font-bold text-amber-900 underline"
                      >
                        Open Settings → Company →
                      </Link>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Live PDF Preview Drawer */}
      <Drawer
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        title="PDF-Vorschau (Entwurf)"
        subtitle="Server-rendered DIN 5008 preview with ENTWURF watermark"
        side="right"
        widthClass="w-full sm:max-w-3xl"
      >
        {previewUrl ? (
          <iframe
            src={previewUrl}
            title="Invoice PDF Preview"
            className="h-[78vh] w-full rounded-xl border border-slate-200 bg-slate-100"
          />
        ) : (
          <p className="text-xs text-slate-500">Generating preview…</p>
        )}
      </Drawer>

      {/* Create / Edit Billing Customer Drawer */}
      <Drawer
        open={customerDrawerOpen}
        onClose={() => setCustomerDrawerOpen(false)}
        title={
          editingCustomerId ? "Edit Billing Customer" : "New Billing Customer"
        }
        subtitle="Full postal address is mandatory under § 14 UStG before issuing."
        side="right"
        widthClass="w-full sm:max-w-lg"
      >
        <form onSubmit={handleSaveCustomer} className="space-y-3.5">
          <FormField label="Full Name / Contact" required>
            <input
              type="text"
              required
              value={customerForm.name}
              onChange={(e) =>
                setCustomerForm((p) => ({ ...p, name: e.target.value }))
              }
              className={adminInputClassName}
            />
          </FormField>
          <FormField label="Company Name (Firma, optional)">
            <input
              type="text"
              value={customerForm.companyName}
              onChange={(e) =>
                setCustomerForm((p) => ({ ...p, companyName: e.target.value }))
              }
              className={adminInputClassName}
            />
          </FormField>
          <FormField label="Street & House Number" required>
            <input
              type="text"
              value={customerForm.street}
              onChange={(e) =>
                setCustomerForm((p) => ({ ...p, street: e.target.value }))
              }
              placeholder="Beispielstraße 10"
              className={adminInputClassName}
            />
          </FormField>
          <div className="grid grid-cols-3 gap-2.5">
            <FormField label="PLZ" required>
              <input
                type="text"
                value={customerForm.postalCode}
                onChange={(e) =>
                  setCustomerForm((p) => ({ ...p, postalCode: e.target.value }))
                }
                placeholder="40213"
                className={adminInputClassName}
              />
            </FormField>
            <FormField label="City (Ort)" required>
              <input
                type="text"
                value={customerForm.city}
                onChange={(e) =>
                  setCustomerForm((p) => ({ ...p, city: e.target.value }))
                }
                placeholder="Düsseldorf"
                className={adminInputClassName}
              />
            </FormField>
            <FormField label="Country">
              <input
                type="text"
                maxLength={2}
                value={customerForm.country}
                onChange={(e) =>
                  setCustomerForm((p) => ({
                    ...p,
                    country: e.target.value.toUpperCase(),
                  }))
                }
                className={adminInputClassName}
              />
            </FormField>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            <FormField label="Email">
              <input
                type="email"
                value={customerForm.email}
                onChange={(e) =>
                  setCustomerForm((p) => ({ ...p, email: e.target.value }))
                }
                className={adminInputClassName}
              />
            </FormField>
            <FormField label="Phone">
              <input
                type="text"
                value={customerForm.phone}
                onChange={(e) =>
                  setCustomerForm((p) => ({ ...p, phone: e.target.value }))
                }
                className={adminInputClassName}
              />
            </FormField>
          </div>
          <FormField
            label="USt-IdNr. (optional, required for EU Reverse-Charge)"
            hint="e.g. DE123456789 or ATU12345678"
          >
            <input
              type="text"
              value={customerForm.vatId}
              onChange={(e) =>
                setCustomerForm((p) => ({ ...p, vatId: e.target.value }))
              }
              className={adminInputClassName}
            />
          </FormField>
          <FormField label="Notes">
            <textarea
              rows={2}
              value={customerForm.notes}
              onChange={(e) =>
                setCustomerForm((p) => ({ ...p, notes: e.target.value }))
              }
              className={adminInputClassName}
            />
          </FormField>
          <div className="flex justify-end gap-2 pt-3">
            <button
              type="button"
              onClick={() => setCustomerDrawerOpen(false)}
              className="cursor-pointer rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={customerSaving}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-700 disabled:opacity-60"
            >
              {customerSaving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              <span>{editingCustomerId ? "Save Customer" : "Create Customer"}</span>
            </button>
          </div>
        </form>
      </Drawer>

      {/* GoBD Final Issuance Confirmation Dialog */}
      <ConfirmDialog
        open={confirmIssueOpen}
        onClose={() => !issuing && setConfirmIssueOpen(false)}
        onConfirm={handleConfirmIssue}
        loading={issuing}
        variant="warning"
        title="Rechnung verbindlich ausstellen?"
        description="Das Ausstellen ist endgültig (GoBD): Es wird eine fortlaufende Rechnungsnummer (RE-YYYY-NNN) vergeben, ein unveränderlicher Snapshot aller Daten sowie die finale PDF-Datei archiviert. Nach dem Ausstellen kann die Rechnung weder bearbeitet noch gelöscht werden — Korrekturen sind ausschließlich über eine Stornorechnung möglich."
        confirmLabel="Verbindlich ausstellen"
        cancelLabel="Abbrechen"
      />

      {/* Delete Draft Confirmation */}
      <ConfirmDialog
        open={confirmDeleteOpen}
        onClose={() => !deleting && setConfirmDeleteOpen(false)}
        onConfirm={handleDeleteDraft}
        loading={deleting}
        variant="danger"
        title="Entwurf löschen?"
        description="Dieser unnummerierte Entwurf wird endgültig gelöscht. Es wird keine Rechnungsnummer verbraucht."
        confirmLabel="Entwurf löschen"
        cancelLabel="Abbrechen"
      />
    </div>
  );
}
