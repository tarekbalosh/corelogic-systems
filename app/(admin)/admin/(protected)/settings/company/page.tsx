import React from "react";
import { AlertTriangle } from "lucide-react";
import { getCachedCompanySettings } from "@/lib/admin/cache";
import { requireAdminSession } from "@/lib/security/admin-auth";
import { CompanySettingsForm } from "@/components/admin/invoicing/company-settings-form";

export const dynamic = "force-dynamic";

export default async function AdminCompanySettingsPage() {
  await requireAdminSession();

  const dbConfigured = Boolean(process.env.DATABASE_URL?.trim());
  let dbError: string | null = null;

  const settings = dbConfigured
    ? await getCachedCompanySettings().catch((err: unknown) => {
        dbError =
          err instanceof Error ? err.message : "Database query failed.";
        return null;
      })
    : null;

  if (!dbConfigured || dbError || !settings) {
    return (
      <div
        role="alert"
        className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900"
      >
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
        <div>
          <p className="font-bold">Company Settings table not ready</p>
          <p className="mt-1 text-xs leading-relaxed text-amber-800">
            {!dbConfigured
              ? "Set DATABASE_URL in .env.local and run `npx prisma migrate deploy`."
              : "Unable to query company settings. Run `npx prisma migrate deploy` first."}
          </p>
        </div>
      </div>
    );
  }

  return <CompanySettingsForm initialSettings={settings} />;
}
