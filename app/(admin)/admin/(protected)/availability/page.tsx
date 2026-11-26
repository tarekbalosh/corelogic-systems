import React from "react";
import { AlertTriangle } from "lucide-react";
import prisma from "@/lib/db";
import { normalizeBlockedDateKey } from "@/lib/booking/availability";
import { requireAdminSession } from "@/lib/security/admin-auth";
import {
  AvailabilityWorkspace,
  type SerializedAvailabilityRule,
  type SerializedBlockedDate,
} from "@/components/admin/availability-workspace";

export const dynamic = "force-dynamic";

export default async function AdminAvailabilityPage() {
  await requireAdminSession();

  const dbConfigured = Boolean(process.env.DATABASE_URL?.trim());
  let dbError: string | null = null;

  const [rawRules, rawBlockedDates] = dbConfigured
    ? await Promise.all([
        prisma.availabilityRule.findMany({
          orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
        }),
        prisma.blockedDate.findMany({
          orderBy: { date: "asc" },
        }),
      ]).catch((err: unknown) => {
        dbError =
          err instanceof Error ? err.message : "Database query failed.";
        return [[], []] as const;
      })
    : ([[], []] as const);

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

  const rules: SerializedAvailabilityRule[] = rawRules.map((r) => ({
    id: r.id,
    dayOfWeek: r.dayOfWeek,
    startTime: r.startTime,
    endTime: r.endTime,
    active: r.active,
  }));

  const blockedDates: SerializedBlockedDate[] = rawBlockedDates.map((bd) => ({
    id: bd.id,
    dateKey: normalizeBlockedDateKey(bd.date),
    reason: bd.reason,
  }));

  return <AvailabilityWorkspace rules={rules} blockedDates={blockedDates} />;
}
