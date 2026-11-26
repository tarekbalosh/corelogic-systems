import React from "react";
import { AlertTriangle } from "lucide-react";
import { toIsoDateOnly } from "@/lib/invoicing/money";
import {
  getOrInitCompanySettings,
  listInvoices,
} from "@/lib/invoicing/service";
import { validateCompanySettingsForIssuance } from "@/lib/invoicing/validators";
import { requireAdminSession } from "@/lib/security/admin-auth";
import { InvoicesWorkspace } from "@/components/admin/invoicing/invoices-workspace";

export const dynamic = "force-dynamic";

export default async function AdminInvoicesPage() {
  await requireAdminSession();

  const dbConfigured = Boolean(process.env.DATABASE_URL?.trim());
  let dbError: string | null = null;

  const [invoices, company] = dbConfigured
    ? await Promise.all([
        listInvoices().catch((err: unknown) => {
          dbError =
            err instanceof Error ? err.message : "Database query failed.";
          return [];
        }),
        getOrInitCompanySettings().catch((err: unknown) => {
          dbError =
            dbError ??
            (err instanceof Error ? err.message : "Database query failed.");
          return null;
        }),
      ])
    : [[], null];

  if (!dbConfigured || dbError || !company) {
    return (
      <div
        role="alert"
        className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900"
      >
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
        <div>
          <p className="font-bold">Invoicing tables not ready</p>
          <p className="mt-1 text-xs leading-relaxed text-amber-800">
            {!dbConfigured
              ? "Set DATABASE_URL in .env.local and run `npx prisma migrate deploy`."
              : "Unable to query invoicing tables. Run `npx prisma migrate deploy` to apply the invoicing migration."}
          </p>
        </div>
      </div>
    );
  }

  const companyMissingCount = validateCompanySettingsForIssuance(company).length;
  const currentMonthPrefix = (toIsoDateOnly(new Date()) ?? "").slice(0, 7);

  return (
    <InvoicesWorkspace
      invoices={invoices}
      companyMissingCount={companyMissingCount}
      currentMonthPrefix={currentMonthPrefix}
    />
  );
}
