import React from "react";
import { AlertTriangle } from "lucide-react";
import { getCachedAdminBookings } from "@/lib/admin/cache";
import { getBusinessTimezone } from "@/lib/booking/availability";
import { requireAdminSession } from "@/lib/security/admin-auth";
import { BookingsWorkspace } from "@/components/admin/bookings-workspace";

export const dynamic = "force-dynamic";

export default async function AdminBookingsPage() {
  await requireAdminSession();

  const tz = getBusinessTimezone();
  const dbConfigured = Boolean(process.env.DATABASE_URL?.trim());
  let dbError: string | null = null;

  const bookings = dbConfigured
    ? await getCachedAdminBookings().catch((err: unknown) => {
        dbError =
          err instanceof Error ? err.message : "Database query failed.";
        return [];
      })
    : [];

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
              ? "Set DATABASE_URL in .env.local and run `npx prisma migrate deploy`."
              : "Unable to query bookings table. Ensure migrations have been applied."}
          </p>
        </div>
      </div>
    );
  }

  return <BookingsWorkspace bookings={bookings} timezoneLabel={tz} />;
}
