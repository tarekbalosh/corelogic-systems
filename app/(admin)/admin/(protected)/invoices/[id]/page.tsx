import React from "react";
import Link from "next/link";
import { AlertTriangle, ArrowLeft } from "lucide-react";
import {
  getInvoiceDetail,
  getOrInitCompanySettings,
  listBillingCustomers,
} from "@/lib/invoicing/service";
import { requireAdminSession } from "@/lib/security/admin-auth";
import { InvoiceDetailView } from "@/components/admin/invoicing/invoice-detail-view";
import { InvoiceEditor } from "@/components/admin/invoicing/invoice-editor";

export const dynamic = "force-dynamic";

interface InvoiceDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminInvoiceDetailPage({
  params,
}: InvoiceDetailPageProps) {
  await requireAdminSession();
  const { id } = await params;

  const [invoice, company, customers] = await Promise.all([
    getInvoiceDetail(id).catch(() => null),
    getOrInitCompanySettings().catch(() => null),
    listBillingCustomers().catch(() => []),
  ]);

  if (!invoice || !company) {
    return (
      <div className="space-y-4 rounded-2xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900">
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
          <div>
            <p className="font-bold">Invoice not found</p>
            <p className="mt-1 text-xs text-amber-800">
              The requested invoice does not exist or invoicing migrations have not been applied yet.
            </p>
          </div>
        </div>
        <Link
          href="/admin/invoices"
          className="inline-flex items-center gap-1.5 rounded-xl bg-white px-3.5 py-2 text-xs font-bold text-slate-800 ring-1 ring-slate-200 hover:bg-slate-50"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Invoices</span>
        </Link>
      </div>
    );
  }

  if (invoice.status === "DRAFT") {
    return (
      <InvoiceEditor
        mode="edit"
        company={company}
        initialCustomers={customers}
        initialInvoice={invoice}
      />
    );
  }

  return <InvoiceDetailView invoice={invoice} />;
}
