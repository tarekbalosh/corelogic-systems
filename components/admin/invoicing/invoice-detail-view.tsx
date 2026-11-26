"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Ban,
  CheckCircle2,
  Clock,
  CreditCard,
  Download,
  Eye,
  FileWarning,
  History,
  Loader2,
  Lock,
} from "lucide-react";
import { PAYMENT_METHOD_OPTIONS } from "@/lib/invoicing/constants";
import {
  eurosToCents,
  formatDateDe,
  formatEurDe,
  formatQuantityDe,
  formatVatRateDe,
  toIsoDateOnly,
} from "@/lib/invoicing/money";
import type { SerializedInvoiceDetail } from "@/lib/invoicing/types";
import {
  ConfirmDialog,
  Drawer,
  FormField,
  StatusBadge,
  adminInputClassName,
  useToast,
} from "@/components/admin/ui";
import { adminApiJson, InvoicingApiClientError } from "./api-client";

interface InvoiceDetailViewProps {
  invoice: SerializedInvoiceDetail;
}

const AUDIT_LABELS: Record<string, string> = {
  CREATED: "Draft created",
  UPDATED: "Draft updated",
  ISSUED: "Issued & locked (GoBD)",
  PDF_DOWNLOADED: "PDF downloaded",
  PAYMENT_RECORDED: "Payment recorded",
  CANCELLED: "Cancelled via Stornorechnung",
  STORNO_CREATED: "Stornorechnung issued",
  LEAD_DELETION_BLOCKED: "Lead deletion blocked (GoBD retention)",
};

export function InvoiceDetailView({ invoice }: InvoiceDetailViewProps) {
  const router = useRouter();
  const toast = useToast();

  const [previewOpen, setPreviewOpen] = useState(false);
  const [paymentDrawerOpen, setPaymentDrawerOpen] = useState(false);
  const [stornoDialogOpen, setStornoDialogOpen] = useState(false);
  const [stornoReason, setStornoReason] = useState("");
  const [submittingPayment, setSubmittingPayment] = useState(false);
  const [creatingStorno, setCreatingStorno] = useState(false);

  const remainingCents = Math.max(
    0,
    invoice.totalGrossCents - invoice.paidAmountCents
  );

  const [paymentForm, setPaymentForm] = useState({
    paidAt: toIsoDateOnly(new Date())!,
    amountEur: (remainingCents / 100).toFixed(2).replace(".", ","),
    method: PAYMENT_METHOD_OPTIONS[0] as string,
    reference: invoice.invoiceNumber ?? "",
    notes: "",
  });

  const canRecordPayment =
    invoice.type === "INVOICE" && invoice.status === "ISSUED";
  const canCreateStorno =
    invoice.type === "INVOICE" &&
    (invoice.status === "ISSUED" || invoice.status === "PAID");

  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingPayment(true);
    try {
      const amountCents = eurosToCents(paymentForm.amountEur);
      await adminApiJson(`/admin/api/invoices/${invoice.id}/payments`, {
        method: "POST",
        body: {
          paidAt: paymentForm.paidAt,
          amountCents,
          method: paymentForm.method,
          reference: paymentForm.reference.trim() || null,
          notes: paymentForm.notes.trim() || null,
        },
      });
      setPaymentDrawerOpen(false);
      toast.success(
        "Payment recorded",
        `${formatEurDe(amountCents)} booked for ${invoice.invoiceNumber}.`
      );
      router.refresh();
    } catch (err) {
      const msg =
        err instanceof InvoicingApiClientError
          ? err.message
          : "Could not record payment.";
      toast.error("Payment error", msg);
    } finally {
      setSubmittingPayment(false);
    }
  };

  const handleCreateStorno = async () => {
    setCreatingStorno(true);
    try {
      const res = await adminApiJson<{
        storno: SerializedInvoiceDetail;
        original: SerializedInvoiceDetail;
      }>(`/admin/api/invoices/${invoice.id}/storno`, {
        method: "POST",
        body: { reason: stornoReason.trim() || undefined },
      });
      setStornoDialogOpen(false);
      toast.success(
        `Stornorechnung ${res.storno.invoiceNumber} erstellt`,
        `${invoice.invoiceNumber} is now marked Cancelled.`
      );
      router.push(`/admin/invoices/${res.storno.id}`);
      router.refresh();
    } catch (err) {
      setStornoDialogOpen(false);
      const msg =
        err instanceof InvoicingApiClientError
          ? err.message
          : "Could not create Stornorechnung.";
      toast.error("Storno failed", msg);
    } finally {
      setCreatingStorno(false);
    }
  };

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
          <span className="font-mono text-base font-bold text-slate-900">
            {invoice.invoiceNumber}
          </span>
          <StatusBadge status={invoice.displayStatus} size="md" />
          {invoice.type === "CANCELLATION" && (
            <span className="rounded-full bg-rose-50 px-2.5 py-0.5 text-[11px] font-bold text-rose-700 ring-1 ring-inset ring-rose-200">
              Stornorechnung
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setPreviewOpen(true)}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            <Eye className="h-3.5 w-3.5" />
            <span>View PDF</span>
          </button>

          <a
            href={`/admin/api/invoices/${invoice.id}/pdf?download=1`}
            className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-2xs transition-colors hover:bg-indigo-700"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Download PDF</span>
          </a>

          {canRecordPayment && (
            <button
              type="button"
              onClick={() => setPaymentDrawerOpen(true)}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-emerald-700"
            >
              <CreditCard className="h-3.5 w-3.5" />
              <span>Record Payment</span>
            </button>
          )}

          {canCreateStorno && (
            <button
              type="button"
              onClick={() => setStornoDialogOpen(true)}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2 text-xs font-bold text-rose-700 hover:bg-rose-100"
            >
              <Ban className="h-3.5 w-3.5" />
              <span>Stornorechnung erstellen</span>
            </button>
          )}
        </div>
      </div>

      {/* GoBD Immutability Notice */}
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-slate-200 bg-slate-100/70 px-4 py-3 text-xs text-slate-700">
        <div className="flex items-center gap-2">
          <Lock className="h-4 w-4 shrink-0 text-slate-500" />
          <span>
            <span className="font-bold">GoBD-archiviert &amp; unveränderlich:</span>{" "}
            Ausgestellte Rechnungen sind schreibgeschützt (Snapshot + festes PDF).
          </span>
        </div>
        {invoice.pdfSha256 && (
          <span className="font-mono text-[10px] text-slate-500">
            PDF SHA-256: {invoice.pdfSha256.slice(0, 16)}…
          </span>
        )}
      </div>

      {/* Cross-reference banner for Storno / Cancelled */}
      {invoice.correctedInvoiceId && invoice.correctedInvoiceNumber && (
        <div className="flex items-center justify-between rounded-2xl border border-rose-200 bg-rose-50/80 px-4 py-3 text-xs text-rose-900">
          <div className="flex items-center gap-2">
            <FileWarning className="h-4 w-4 shrink-0 text-rose-600" />
            <span>
              Diese Stornorechnung korrigiert Originalrechnung{" "}
              <span className="font-mono font-bold">
                {invoice.correctedInvoiceNumber}
              </span>
              .
            </span>
          </div>
          <Link
            href={`/admin/invoices/${invoice.correctedInvoiceId}`}
            className="font-bold text-rose-700 underline"
          >
            Original öffnen →
          </Link>
        </div>
      )}

      {invoice.corrections.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-amber-200 bg-amber-50/80 px-4 py-3 text-xs text-amber-950">
          <span>
            Diese Rechnung wurde storniert durch:{" "}
            {invoice.corrections.map((c) => (
              <Link
                key={c.id}
                href={`/admin/invoices/${c.id}`}
                className="ml-1 font-mono font-bold text-amber-900 underline"
              >
                {c.invoiceNumber} ({formatEurDe(c.totalGrossCents)})
              </Link>
            ))}
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
        {/* Left 8 Cols: Frozen Snapshot Details & Line Table */}
        <div className="space-y-6 lg:col-span-8">
          {/* Parties & Key Dates */}
          <div className="grid grid-cols-1 gap-4 rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs sm:grid-cols-2">
            <div className="space-y-1 text-xs text-slate-600">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Rechnungsempfänger (Snapshot)
              </p>
              <p className="text-sm font-bold text-slate-900">
                {invoice.customer.companyName || invoice.customer.name}
              </p>
              {invoice.customer.companyName &&
                invoice.customer.name !== invoice.customer.companyName && (
                  <p>z. Hd. {invoice.customer.contactPerson || invoice.customer.name}</p>
                )}
              <p>{invoice.customer.street}</p>
              <p>
                {invoice.customer.postalCode} {invoice.customer.city} (
                {invoice.customer.country})
              </p>
              {invoice.customer.vatId && (
                <p className="font-semibold text-slate-700">
                  USt-IdNr.: {invoice.customer.vatId}
                </p>
              )}
              {invoice.customer.email && <p>{invoice.customer.email}</p>}
            </div>

            <dl className="space-y-1.5 text-xs">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Rechnungsdetails
              </p>
              <div className="flex justify-between">
                <dt className="text-slate-500">Rechnungsdatum</dt>
                <dd className="font-semibold text-slate-900">
                  {formatDateDe(invoice.issueDate)}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500">
                  {invoice.servicePeriodStart && invoice.servicePeriodEnd
                    ? "Leistungszeitraum"
                    : "Leistungsdatum"}
                </dt>
                <dd className="font-semibold text-slate-900">
                  {invoice.servicePeriodStart && invoice.servicePeriodEnd
                    ? `${formatDateDe(invoice.servicePeriodStart)} – ${formatDateDe(invoice.servicePeriodEnd)}`
                    : formatDateDe(invoice.serviceDate)}
                </dd>
              </div>
              {invoice.dueDate && invoice.type === "INVOICE" && (
                <div className="flex justify-between">
                  <dt className="text-slate-500">Fällig am</dt>
                  <dd className="font-semibold text-slate-900">
                    {formatDateDe(invoice.dueDate)}
                  </dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-slate-500">Verwendungszweck</dt>
                <dd className="font-mono font-bold text-indigo-700">
                  {invoice.paymentReference ?? invoice.invoiceNumber}
                </dd>
              </div>
              {invoice.customerReference && (
                <div className="flex justify-between">
                  <dt className="text-slate-500">Kundenreferenz</dt>
                  <dd className="font-semibold text-slate-900">
                    {invoice.customerReference}
                  </dd>
                </div>
              )}
            </dl>
          </div>

          {/* Line Items Table */}
          <div className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="px-4 py-3">Pos.</th>
                    <th className="px-4 py-3">Beschreibung</th>
                    <th className="px-4 py-3 text-right">Menge</th>
                    <th className="px-4 py-3 text-right">Einzelpreis</th>
                    <th className="px-4 py-3 text-right">USt.</th>
                    <th className="px-4 py-3 text-right">Gesamt (Netto)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {invoice.items.map((item) => (
                    <tr key={item.position}>
                      <td className="px-4 py-3 text-slate-400">
                        {item.position}
                      </td>
                      <td className="px-4 py-3 font-medium text-slate-900">
                        <p className="whitespace-pre-line">{item.description}</p>
                        {item.discountCents !== 0 && (
                          <p className="mt-0.5 text-[11px] text-slate-500">
                            Rabatt: {formatEurDe(-item.discountCents)}
                          </p>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-right tabular-nums text-slate-700">
                        {formatQuantityDe(item.quantity)} {item.unit}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-right tabular-nums text-slate-700">
                        {formatEurDe(item.unitPriceNetCents)}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-right tabular-nums text-slate-500">
                        {formatVatRateDe(item.vatRateBps)}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-right font-bold tabular-nums text-slate-900">
                        {formatEurDe(item.lineNetCents)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="border-t border-slate-200 bg-slate-50/70 p-4">
              <dl className="ml-auto max-w-xs space-y-1.5 text-xs">
                <div className="flex justify-between text-slate-700">
                  <dt>Zwischensumme (Netto)</dt>
                  <dd className="font-semibold tabular-nums">
                    {formatEurDe(invoice.subtotalNetCents)}
                  </dd>
                </div>
                {invoice.taxBreakdown.map((b) => (
                  <div
                    key={`${b.vatRateBps}-${b.vatCategoryCode}`}
                    className="flex justify-between text-slate-600"
                  >
                    <dt>
                      zzgl. Umsatzsteuer ({formatVatRateDe(b.vatRateBps)})
                    </dt>
                    <dd className="tabular-nums">{formatEurDe(b.vatCents)}</dd>
                  </div>
                ))}
                <div className="flex justify-between border-t border-slate-200 pt-2 text-sm font-bold text-slate-900">
                  <dt>Gesamtbetrag (Brutto)</dt>
                  <dd className="tabular-nums">
                    {formatEurDe(invoice.totalGrossCents)}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {invoice.taxLegalNotice && (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs font-medium text-slate-700">
              <span className="font-bold text-slate-900">Steuerhinweis: </span>
              {invoice.taxLegalNotice}
            </div>
          )}
        </div>

        {/* Right 4 Cols: Payments & Audit Log */}
        <div className="space-y-6 lg:col-span-4">
          {/* Payment Summary */}
          {invoice.type === "INVOICE" && (
            <section className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs">
              <div className="flex items-center justify-between">
                <h3 className="font-heading text-sm font-bold text-slate-900">
                  Zahlungsstatus
                </h3>
                {invoice.status === "PAID" ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                ) : (
                  <Clock className="h-4 w-4 text-amber-500" />
                )}
              </div>

              <dl className="mt-3 space-y-1.5 text-xs">
                <div className="flex justify-between">
                  <dt className="text-slate-500">Gesamtbetrag</dt>
                  <dd className="font-semibold tabular-nums text-slate-900">
                    {formatEurDe(invoice.totalGrossCents)}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-500">Eingegangen</dt>
                  <dd className="font-semibold tabular-nums text-emerald-700">
                    {formatEurDe(invoice.paidAmountCents)}
                  </dd>
                </div>
                <div className="flex justify-between border-t border-slate-100 pt-1.5">
                  <dt className="font-semibold text-slate-700">Offen</dt>
                  <dd className="font-bold tabular-nums text-slate-900">
                    {formatEurDe(remainingCents)}
                  </dd>
                </div>
              </dl>

              {invoice.payments.length > 0 && (
                <ul className="mt-4 space-y-2 border-t border-slate-100 pt-3">
                  {invoice.payments.map((p) => (
                    <li
                      key={p.id}
                      className="rounded-xl bg-emerald-50/70 px-3 py-2 text-xs"
                    >
                      <div className="flex justify-between font-bold text-emerald-900">
                        <span>{formatEurDe(p.amountCents)}</span>
                        <span>{formatDateDe(p.paidAt)}</span>
                      </div>
                      <p className="mt-0.5 text-[11px] text-emerald-800">
                        {p.method}
                        {p.reference ? ` · Ref: ${p.reference}` : ""}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          )}

          {/* Audit Log */}
          <section className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs">
            <div className="flex items-center gap-2">
              <History className="h-4 w-4 text-indigo-600" />
              <h3 className="font-heading text-sm font-bold text-slate-900">
                Audit Log (GoBD)
              </h3>
            </div>

            <ol className="mt-3 space-y-3">
              {invoice.auditLogs.map((log) => (
                <li
                  key={log.id}
                  className="border-l-2 border-slate-200 pl-3 text-xs"
                >
                  <p className="font-semibold text-slate-900">
                    {AUDIT_LABELS[log.action] ?? log.action}
                  </p>
                  <p className="mt-0.5 text-[11px] text-slate-500">
                    {log.actor} ·{" "}
                    {new Date(log.createdAtIso).toLocaleString("de-DE", {
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                  </p>
                </li>
              ))}
            </ol>
          </section>
        </div>
      </div>

      {/* Inline PDF Viewer Drawer */}
      <Drawer
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        title={`PDF · ${invoice.invoiceNumber}`}
        subtitle="Archived immutable PDF document"
        side="right"
        widthClass="w-full sm:max-w-3xl"
      >
        <iframe
          src={`/admin/api/invoices/${invoice.id}/pdf`}
          title={`Invoice ${invoice.invoiceNumber} PDF`}
          className="h-[78vh] w-full rounded-xl border border-slate-200 bg-slate-100"
        />
      </Drawer>

      {/* Record Payment Drawer */}
      <Drawer
        open={paymentDrawerOpen}
        onClose={() => setPaymentDrawerOpen(false)}
        title="Zahlung erfassen"
        subtitle={`Rechnung ${invoice.invoiceNumber} · Offen: ${formatEurDe(remainingCents)}`}
        side="right"
        widthClass="w-full sm:max-w-md"
      >
        <form onSubmit={handleRecordPayment} className="space-y-4">
          <FormField label="Zahlungsdatum" htmlFor="pay-date" required>
            <input
              id="pay-date"
              type="date"
              required
              value={paymentForm.paidAt}
              onChange={(e) =>
                setPaymentForm((p) => ({ ...p, paidAt: e.target.value }))
              }
              className={adminInputClassName}
            />
          </FormField>

          <FormField label="Betrag (EUR)" htmlFor="pay-amount" required>
            <input
              id="pay-amount"
              type="text"
              required
              inputMode="decimal"
              value={paymentForm.amountEur}
              onChange={(e) =>
                setPaymentForm((p) => ({ ...p, amountEur: e.target.value }))
              }
              className={adminInputClassName}
            />
          </FormField>

          <FormField label="Zahlungsmethode" htmlFor="pay-method" required>
            <select
              id="pay-method"
              value={paymentForm.method}
              onChange={(e) =>
                setPaymentForm((p) => ({ ...p, method: e.target.value }))
              }
              className={adminInputClassName}
            >
              {PAYMENT_METHOD_OPTIONS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </FormField>

          <FormField label="Bankreferenz / Verwendungszweck" htmlFor="pay-ref">
            <input
              id="pay-ref"
              type="text"
              value={paymentForm.reference}
              onChange={(e) =>
                setPaymentForm((p) => ({ ...p, reference: e.target.value }))
              }
              className={adminInputClassName}
            />
          </FormField>

          <FormField label="Notiz (optional)" htmlFor="pay-notes">
            <textarea
              id="pay-notes"
              rows={2}
              value={paymentForm.notes}
              onChange={(e) =>
                setPaymentForm((p) => ({ ...p, notes: e.target.value }))
              }
              className={adminInputClassName}
            />
          </FormField>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setPaymentDrawerOpen(false)}
              className="cursor-pointer rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              Abbrechen
            </button>
            <button
              type="submit"
              disabled={submittingPayment}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700 disabled:opacity-60"
            >
              {submittingPayment && (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              )}
              <span>Zahlung speichern</span>
            </button>
          </div>
        </form>
      </Drawer>

      {/* Stornorechnung Dialog */}
      <ConfirmDialog
        open={stornoDialogOpen}
        onClose={() => !creatingStorno && setStornoDialogOpen(false)}
        onConfirm={handleCreateStorno}
        loading={creatingStorno}
        variant="danger"
        title={`Stornorechnung für ${invoice.invoiceNumber} erstellen?`}
        description="Es wird eine neue fortlaufende Stornorechnung mit negativen Beträgen und Verweis auf die Originalrechnung erstellt und archiviert. Die Originalrechnung wird als storniert (Cancelled) markiert."
        confirmLabel="Stornorechnung ausstellen"
        cancelLabel="Abbrechen"
      >
        <FormField
          label="Stornogrund (optional)"
          htmlFor="storno-reason"
        >
          <input
            id="storno-reason"
            type="text"
            value={stornoReason}
            onChange={(e) => setStornoReason(e.target.value)}
            placeholder="z. B. Korrektur Rechnungsadresse / Leistungsänderung"
            className={adminInputClassName}
          />
        </FormField>
      </ConfirmDialog>
    </div>
  );
}
