import React from "react";
import { AlertTriangle } from "lucide-react";
import { getCachedAdminAvailability } from "@/lib/admin/cache";
import { requireAdminSession } from "@/lib/security/admin-auth";
import { AvailabilityWorkspace } from "@/components/admin/availability-workspace";

export const dynamic = "force-dynamic";

export default async function AdminAvailabilityPage() {
  await requireAdminSession();

  const dbConfigured = Boolean(process.env.DATABASE_URL?.trim());
  let dbError: string | null = null;

  const data = dbConfigured
    ? await getCachedAdminAvailability().catch((err: unknown) => {
        dbError =
          err instanceof Error ? err.message : "Database query failed.";
        return { rules: [], blockedDates: [] };
      })
    : { rules: [], blockedDates: [] };

  if (!dbConfigured || dbError) {
    return (
      <div
        role="alert"
        className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900"
      >
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
        <div>
          <p className="font-bold">Database not ready</p>
          <p className="mt-1 text-xs leading-relaxed text-amber-800">
            {!dbConfigured
              ? "Set DATABASE_URL in .env.local, run `npx prisma migrate deploy`, and run `npx prisma db seed`."
              : "Unable to query availability tables. Ensure migrations have been applied."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <AvailabilityWorkspace
      rules={data.rules}
      blockedDates={data.blockedDates}
    />
  );
}
