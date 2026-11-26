import React from "react";
import { AlertTriangle } from "lucide-react";
import {
  getOrInitCompanySettings,
  listBillingCustomers,
} from "@/lib/invoicing/service";
import { requireAdminSession } from "@/lib/security/admin-auth";
import { InvoiceEditor } from "@/components/admin/invoicing/invoice-editor";

export const dynamic = "force-dynamic";

interface NewInvoicePageProps {
  searchParams: Promise<{ customerId?: string }>;
}

export default async function AdminNewInvoicePage({
  searchParams,
}: NewInvoicePageProps) {
  await requireAdminSession();
  const params = await searchParams;

  const dbConfigured = Boolean(process.env.DATABASE_URL?.trim());
  let dbError: string | null = null;

  const [company, customers] = dbConfigured
    ? await Promise.all([
        getOrInitCompanySettings().catch((err: unknown) => {
          dbError =
            err instanceof Error ? err.message : "Database query failed.";
          return null;
        }),
        listBillingCustomers().catch(() => []),
      ])
    : [null, []];

  if (!dbConfigured || dbError || !company) {
    return (
      <div
        role="alert"
        className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900"
      >
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
        <div>
          <p className="font-bold">Database not ready</p>
          <p className="mt-1 text-xs leading-relaxed text-amber-800">
            Run `npx prisma migrate deploy` to create the invoicing tables.
          </p>
        </div>
      </div>
    );
  }

  return (
    <InvoiceEditor
      mode="create"
      company={company}
      initialCustomers={customers}
      preselectedCustomerId={params.customerId?.trim() || undefined}
    />
  );
}
