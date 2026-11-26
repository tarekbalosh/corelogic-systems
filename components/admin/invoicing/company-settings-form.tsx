"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { TaxTreatment } from "@prisma/client";
import {
  AlertTriangle,
  Building2,
  CheckCircle2,
  Landmark,
  Loader2,
  ReceiptText,
  Save,
  Scale,
  ShieldCheck,
} from "lucide-react";
import { TAX_TREATMENT_META } from "@/lib/invoicing/constants";
import type { SerializedCompanySettings } from "@/lib/invoicing/types";
import {
  isValidBic,
  isValidIban,
  isValidVatId,
  validateCompanySettingsForIssuance,
} from "@/lib/invoicing/validators";
import {
  FormField,
  PageHeader,
  adminInputClassName,
  useToast,
} from "@/components/admin/ui";
import { adminApiJson, InvoicingApiClientError } from "./api-client";

interface CompanySettingsFormProps {
  initialSettings: SerializedCompanySettings;
}

export function CompanySettingsForm({
  initialSettings,
}: CompanySettingsFormProps) {
  const router = useRouter();
  const toast = useToast();
  const [form, setForm] = useState<SerializedCompanySettings>(initialSettings);
  const [saving, setSaving] = useState(false);

  const missingIssues = useMemo(
    () => validateCompanySettingsForIssuance(form),
    [form]
  );

  const ibanState = useMemo(() => {
    if (!form.bankIban.trim()) return "empty" as const;
    return isValidIban(form.bankIban) ? ("valid" as const) : ("invalid" as const);
  }, [form.bankIban]);

  const bicState = useMemo(() => {
    if (!form.bankBic.trim()) return "empty" as const;
    return isValidBic(form.bankBic) ? ("valid" as const) : ("invalid" as const);
  }, [form.bankBic]);

  const vatIdState = useMemo(() => {
    if (!form.vatId.trim()) return "empty" as const;
    return isValidVatId(form.vatId) ? ("valid" as const) : ("invalid" as const);
  }, [form.vatId]);

  const setField = <K extends keyof SerializedCompanySettings>(
    key: K,
    value: SerializedCompanySettings[K]
  ) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await adminApiJson<{ settings: SerializedCompanySettings }>(
        "/admin/api/company-settings",
        {
          method: "PUT",
          body: form,
        }
      );
      setForm(res.settings);
      router.refresh();
      toast.success(
        "Company settings saved",
        "All future invoices and previews will read from these issuer details."
      );
    } catch (err) {
      const msg =
        err instanceof InvoicingApiClientError
          ? err.message
          : "Could not save company settings.";
      toast.error("Validation / Save error", msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs">
        <PageHeader
          title="Issuing Company Profile"
          badge="Single Source of Truth"
          description="Used on every German invoice PDF (§ 14 UStG / § 35a GmbHG) and ready to power Impressum later. Missing fields stay blank — never fabricated."
          actions={
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href="/admin/invoices"
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                <ReceiptText className="h-3.5 w-3.5" />
                <span>Back to Invoices</span>
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-2xs transition-colors hover:bg-indigo-700 disabled:opacity-60"
              >
                {saving ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Save className="h-3.5 w-3.5" />
                )}
                <span>Save Company Settings</span>
              </button>
            </div>
          }
        />
      </div>

      {/* Issuance Readiness Checklist */}
      {missingIssues.length > 0 ? (
        <div
          role="status"
          className="rounded-2xl border border-amber-200 bg-amber-50/80 p-5 text-amber-950"
        >
          <div className="flex items-start gap-3">
            <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold">
                Issuing invoices is locked until {missingIssues.length} mandatory{" "}
                {missingIssues.length === 1 ? "field is" : "fields are"} completed
              </p>
              <p className="mt-1 text-xs text-amber-900/90">
                You can still create and preview invoice drafts, but transitioning a draft to an issued invoice (
                <span className="font-semibold">Rechnung ausstellen</span>) requires all § 14 UStG &amp; § 35a GmbHG fields:
              </p>
              <ul className="mt-2.5 grid grid-cols-1 gap-1.5 text-xs text-amber-900 sm:grid-cols-2">
                {missingIssues.map((issue) => (
                  <li key={issue.field} className="flex items-start gap-1.5">
                    <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-600" />
                    <span>{issue.message}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50/80 p-4 text-emerald-900">
          <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
          <div className="text-xs">
            <span className="font-bold">Ready to issue German invoices.</span>{" "}
            All mandatory § 14 UStG and § 35a GmbHG issuer fields, tax identifiers, and SEPA bank details are valid.
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Legal Entity & Commercial Register (§ 35a GmbHG) */}
        <section className="space-y-4 rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Building2 className="h-4 w-4 text-indigo-600" />
            <h2 className="font-heading text-sm font-bold text-slate-900">
              Legal Entity &amp; Handelsregister (§ 35a GmbHG)
            </h2>
          </div>

          <FormField label="Full Legal Name (mit Rechtsform)" htmlFor="cs-legalName" required>
            <input
              id="cs-legalName"
              type="text"
              value={form.legalName}
              onChange={(e) => setField("legalName", e.target.value)}
              placeholder="CoreLogic Systems UG (haftungsbeschränkt)"
              className={adminInputClassName}
              required
            />
          </FormField>

          <FormField label="Managing Director (Geschäftsführer)" htmlFor="cs-director" required>
            <input
              id="cs-director"
              type="text"
              value={form.managingDirector}
              onChange={(e) => setField("managingDirector", e.target.value)}
              placeholder="Tarek Balosh"
              className={adminInputClassName}
            />
          </FormField>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <FormField
              label="Register Court (Amtsgericht)"
              htmlFor="cs-court"
              required
              hint="e.g., Amtsgericht Düsseldorf or Amtsgericht Duisburg"
            >
              <input
                id="cs-court"
                type="text"
                value={form.registerCourt}
                onChange={(e) => setField("registerCourt", e.target.value)}
                placeholder="Amtsgericht ..."
                className={adminInputClassName}
              />
            </FormField>
            <FormField
              label="Commercial Register No. (HRB)"
              htmlFor="cs-hrb"
              required
              hint="e.g., HRB 12345"
            >
              <input
                id="cs-hrb"
                type="text"
                value={form.registerNumber}
                onChange={(e) => setField("registerNumber", e.target.value)}
                placeholder="HRB ..."
                className={adminInputClassName}
              />
            </FormField>
          </div>

          <FormField label="Street & House Number (Straße & Nr.)" htmlFor="cs-street" required>
            <input
              id="cs-street"
              type="text"
              value={form.street}
              onChange={(e) => setField("street", e.target.value)}
              placeholder="Musterstraße 12"
              className={adminInputClassName}
            />
          </FormField>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <FormField label="Postal Code (PLZ)" htmlFor="cs-plz" required>
              <input
                id="cs-plz"
                type="text"
                value={form.postalCode}
                onChange={(e) => setField("postalCode", e.target.value)}
                placeholder="47051"
                className={adminInputClassName}
              />
            </FormField>
            <FormField label="City / Seat (Ort)" htmlFor="cs-city" required>
              <input
                id="cs-city"
                type="text"
                value={form.city}
                onChange={(e) => setField("city", e.target.value)}
                placeholder="Duisburg / Düsseldorf"
                className={adminInputClassName}
              />
            </FormField>
            <FormField label="Country (ISO-2)" htmlFor="cs-country" required>
              <input
                id="cs-country"
                type="text"
                maxLength={2}
                value={form.country}
                onChange={(e) => setField("country", e.target.value.toUpperCase())}
                placeholder="DE"
                className={adminInputClassName}
              />
            </FormField>
          </div>
        </section>

        {/* Tax, Contact & Bank Details */}
        <section className="space-y-4 rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
            <Landmark className="h-4 w-4 text-indigo-600" />
            <h2 className="font-heading text-sm font-bold text-slate-900">
              Tax Identifiers, Contact &amp; SEPA Bank Account
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <FormField
              label="Steuernummer"
              htmlFor="cs-taxNumber"
              hint="Either Steuernummer or USt-IdNr. is required (§ 14 UStG)."
            >
              <input
                id="cs-taxNumber"
                type="text"
                value={form.taxNumber}
                onChange={(e) => setField("taxNumber", e.target.value)}
                placeholder="109/5700/0000"
                className={adminInputClassName}
              />
            </FormField>
            <FormField
              label="USt-IdNr. (VAT ID)"
              htmlFor="cs-vatId"
              error={
                vatIdState === "invalid"
                  ? "Invalid EU/DE USt-IdNr. format (e.g. DE123456789)."
                  : undefined
              }
              hint={
                vatIdState === "valid"
                  ? "Valid USt-IdNr. format."
                  : "Required for Reverse-Charge EU B2B invoices."
              }
            >
              <input
                id="cs-vatId"
                type="text"
                value={form.vatId}
                onChange={(e) => setField("vatId", e.target.value)}
                placeholder="DE..."
                className={adminInputClassName}
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <FormField label="Business Email" htmlFor="cs-email" required>
              <input
                id="cs-email"
                type="email"
                value={form.email}
                onChange={(e) => setField("email", e.target.value)}
                placeholder="billing@..."
                className={adminInputClassName}
              />
            </FormField>
            <FormField label="Phone (Telefon)" htmlFor="cs-phone">
              <input
                id="cs-phone"
                type="text"
                value={form.phone}
                onChange={(e) => setField("phone", e.target.value)}
                placeholder="+49 ..."
                className={adminInputClassName}
              />
            </FormField>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <FormField label="Website" htmlFor="cs-website">
              <input
                id="cs-website"
                type="text"
                value={form.website}
                onChange={(e) => setField("website", e.target.value)}
                placeholder="https://www.corelogic-system.my"
                className={adminInputClassName}
              />
            </FormField>
            <FormField label="Logo Asset Path (public/)" htmlFor="cs-logo">
              <input
                id="cs-logo"
                type="text"
                value={form.logoPath}
                onChange={(e) => setField("logoPath", e.target.value)}
                placeholder="/corelogic_logo.png"
                className={adminInputClassName}
              />
            </FormField>
          </div>

          <div className="border-t border-slate-100 pt-3">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <FormField label="Account Holder (Kontoinhaber)" htmlFor="cs-holder" required>
                <input
                  id="cs-holder"
                  type="text"
                  value={form.bankAccountHolder}
                  onChange={(e) => setField("bankAccountHolder", e.target.value)}
                  placeholder="CoreLogic Systems UG (haftungsbeschränkt)"
                  className={adminInputClassName}
                />
              </FormField>
              <FormField label="Bank Name" htmlFor="cs-bankName" required>
                <input
                  id="cs-bankName"
                  type="text"
                  value={form.bankName}
                  onChange={(e) => setField("bankName", e.target.value)}
                  placeholder="z. B. Deutsche Bank / Commerzbank"
                  className={adminInputClassName}
                />
              </FormField>
            </div>

            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="sm:col-span-2">
                <FormField
                  label="IBAN (ISO 7064 Checksum Validated)"
                  htmlFor="cs-iban"
                  required
                  error={
                    ibanState === "invalid"
                      ? "Invalid IBAN checksum or length."
                      : undefined
                  }
                  hint={
                    ibanState === "valid"
                      ? "Valid IBAN checksum verified."
                      : "Spaces are automatically normalized on save."
                  }
                >
                  <input
                    id="cs-iban"
                    type="text"
                    value={form.bankIban}
                    onChange={(e) => setField("bankIban", e.target.value)}
                    placeholder="DE00 0000 0000 0000 0000 00"
                    className={adminInputClassName}
                  />
                </FormField>
              </div>
              <FormField
                label="BIC / SWIFT"
                htmlFor="cs-bic"
                required
                error={
                  bicState === "invalid"
                    ? "Expected 8 or 11 alphanumeric characters."
                    : undefined
                }
              >
                <input
                  id="cs-bic"
                  type="text"
                  value={form.bankBic}
                  onChange={(e) => setField("bankBic", e.target.value.toUpperCase())}
                  placeholder="COBADEFFXXX"
                  className={adminInputClassName}
                />
              </FormField>
            </div>
          </div>
        </section>
      </div>

      {/* Defaults & Editable Tax Legal Notices */}
      <section className="space-y-4 rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Scale className="h-4 w-4 text-indigo-600" />
            <h2 className="font-heading text-sm font-bold text-slate-900">
              Invoicing Defaults &amp; Tax Legal Notices
            </h2>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-bold text-amber-800 ring-1 ring-inset ring-amber-200">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Review notices with Steuerberater</span>
          </span>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            label="Default Payment Terms (Zahlungsziel in Tagen)"
            htmlFor="cs-terms"
          >
            <input
              id="cs-terms"
              type="number"
              min={0}
              max={180}
              value={form.defaultPaymentTermsDays}
              onChange={(e) =>
                setField("defaultPaymentTermsDays", Number(e.target.value) || 0)
              }
              className={adminInputClassName}
            />
          </FormField>

          <FormField
            label="Default Tax Treatment (Standard-Steuerbehandlung)"
            htmlFor="cs-taxTreatment"
            hint="Default is 19% standard German VAT; selectable per invoice."
          >
            <select
              id="cs-taxTreatment"
              value={form.defaultTaxTreatment}
              onChange={(e) =>
                setField("defaultTaxTreatment", e.target.value as TaxTreatment)
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
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <FormField
            label="Kleinunternehmer Notice (§ 19 UStG)"
            htmlFor="cs-ku-notice"
            hint="Editable legal text; remove [TODO: Steuerberater prüfen] after confirmation."
          >
            <textarea
              id="cs-ku-notice"
              rows={3}
              value={form.kleinunternehmerNotice}
              onChange={(e) => setField("kleinunternehmerNotice", e.target.value)}
              className={adminInputClassName}
            />
          </FormField>

          <FormField
            label="Reverse-Charge Notice (EU B2B)"
            htmlFor="cs-rc-notice"
            hint="Automatically attached when Reverse-Charge is selected (requires both USt-IdNr.)."
          >
            <textarea
              id="cs-rc-notice"
              rows={3}
              value={form.reverseChargeNotice}
              onChange={(e) => setField("reverseChargeNotice", e.target.value)}
              className={adminInputClassName}
            />
          </FormField>

          <FormField
            label="Non-EU Exempt / Place of Supply Notice"
            htmlFor="cs-noneu-notice"
            hint="Automatically attached for services outside Germany / EU."
          >
            <textarea
              id="cs-noneu-notice"
              rows={3}
              value={form.exemptNonEuNotice}
              onChange={(e) => setField("exemptNonEuNotice", e.target.value)}
              className={adminInputClassName}
            />
          </FormField>
        </div>

        <div className="flex justify-end border-t border-slate-100 pt-4">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-2xs transition-colors hover:bg-indigo-700 disabled:opacity-60"
          >
            {saving ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Save className="h-3.5 w-3.5" />
            )}
            <span>Save Company Settings</span>
          </button>
        </div>
      </section>
    </form>
  );
}
