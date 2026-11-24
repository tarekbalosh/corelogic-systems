import React from "react";
import { Plus, Trash2 } from "lucide-react";
import prisma from "@/lib/db";
import {
  createAvailabilityRuleAction,
  createBlockedDateAction,
  deleteAvailabilityRuleAction,
  deleteBlockedDateAction,
  toggleAvailabilityRuleAction,
} from "@/lib/admin/actions";
import { normalizeBlockedDateKey } from "@/lib/booking/availability";
import { requireAdminSession } from "@/lib/security/admin-auth";
import { AdminShell } from "@/components/admin/admin-shell";

export const dynamic = "force-dynamic";

const WEEKDAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export default async function AdminAvailabilityPage() {
  await requireAdminSession();

  const dbConfigured = Boolean(process.env.DATABASE_URL?.trim());
  let dbError: string | null = null;

  const [rules, blockedDates] = dbConfigured
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

  return (
    <AdminShell
      activeTab="availability"
      title="Consultation Schedule & Blocked Dates"
      subtitle="All recurring windows are interpreted in Asia/Kuala_Lumpur (MYT)."
    >
      {!dbConfigured || dbError ? (
        <div className="rounded-3xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900">
          <strong>Database not ready:</strong>{" "}
          {!dbConfigured
            ? "Set DATABASE_URL in .env.local, run `npx prisma migrate deploy`, and run `npx prisma db seed`."
            : "Unable to query availability tables. Ensure migrations have been applied."}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Weekly Availability Rules */}
          <div className="space-y-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-2xs">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Weekly Availability Windows (MYT)
              </h2>
              <p className="text-xs text-slate-500">
                Default seed: Monday–Friday, 10:00–12:30 and 14:00–18:00.
              </p>
            </div>

            <form
              action={createAvailabilityRuleAction}
              className="grid grid-cols-1 gap-3 rounded-2xl bg-slate-50 p-4 sm:grid-cols-4"
            >
              <select
                name="dayOfWeek"
                defaultValue="1"
                aria-label="Day of week"
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-800"
              >
                {WEEKDAY_NAMES.map((dayName, idx) => (
                  <option key={dayName} value={idx}>
                    {dayName}
                  </option>
                ))}
              </select>
              <input
                type="time"
                name="startTime"
                required
                defaultValue="10:00"
                aria-label="Start time"
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-800"
              />
              <input
                type="time"
                name="endTime"
                required
                defaultValue="12:30"
                aria-label="End time"
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-800"
              />
              <button
                type="submit"
                className="inline-flex cursor-pointer items-center justify-center gap-1 rounded-xl bg-indigo-600 px-3 py-2 text-xs font-bold text-white hover:bg-indigo-700"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Window</span>
              </button>
            </form>

            {rules.length === 0 ? (
              <p className="text-xs text-slate-400">
                No rules configured yet. Run{" "}
                <code className="font-mono">npx prisma db seed</code> or add a
                window above.
              </p>
            ) : (
              <div className="divide-y divide-slate-100">
                {rules.map((rule) => (
                  <div
                    key={rule.id}
                    className="flex items-center justify-between gap-3 py-3 text-sm"
                  >
                    <div>
                      <span className="font-bold text-slate-900">
                        {WEEKDAY_NAMES[rule.dayOfWeek] ?? `Day ${rule.dayOfWeek}`}
                      </span>
                      <span className="ms-2 font-mono text-xs text-slate-600">
                        {rule.startTime} – {rule.endTime} MYT
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <form action={toggleAvailabilityRuleAction}>
                        <input type="hidden" name="ruleId" value={rule.id} />
                        <input
                          type="hidden"
                          name="nextActive"
                          value={rule.active ? "false" : "true"}
                        />
                        <button
                          type="submit"
                          className={[
                            "cursor-pointer rounded-full px-3 py-1 text-xs font-bold",
                            rule.active
                              ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                              : "bg-slate-200 text-slate-600 hover:bg-slate-300",
                          ].join(" ")}
                        >
                          {rule.active ? "Active" : "Paused"}
                        </button>
                      </form>

                      <form action={deleteAvailabilityRuleAction}>
                        <input type="hidden" name="ruleId" value={rule.id} />
                        <button
                          type="submit"
                          aria-label="Delete availability rule"
                          className="cursor-pointer rounded-xl p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </form>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Blocked Dates */}
          <div className="space-y-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-2xs">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Blocked Dates / Holidays
              </h2>
              <p className="text-xs text-slate-500">
                Block specific calendar dates (public holidays, team off-sites)
                from consultation slot generation.
              </p>
            </div>

            <form
              action={createBlockedDateAction}
              className="grid grid-cols-1 gap-3 rounded-2xl bg-slate-50 p-4 sm:grid-cols-3"
            >
              <input
                type="date"
                name="date"
                required
                aria-label="Blocked date"
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-800"
              />
              <input
                type="text"
                name="reason"
                placeholder="Reason (optional)…"
                aria-label="Reason"
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs text-slate-800"
              />
              <button
                type="submit"
                className="inline-flex cursor-pointer items-center justify-center gap-1 rounded-xl bg-slate-900 px-3 py-2 text-xs font-bold text-white hover:bg-slate-800"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Block Date</span>
              </button>
            </form>

            {blockedDates.length === 0 ? (
              <p className="text-xs text-slate-400">No blocked dates added.</p>
            ) : (
              <div className="divide-y divide-slate-100">
                {blockedDates.map((bd) => (
                  <div
                    key={bd.id}
                    className="flex items-center justify-between gap-3 py-3 text-sm"
                  >
                    <div>
                      <span className="font-mono text-xs font-bold text-slate-900">
                        {normalizeBlockedDateKey(bd.date)}
                      </span>
                      {bd.reason && (
                        <span className="ms-2 text-xs text-slate-500">
                          — {bd.reason}
                        </span>
                      )}
                    </div>

                    <form action={deleteBlockedDateAction}>
                      <input type="hidden" name="blockedId" value={bd.id} />
                      <button
                        type="submit"
                        aria-label="Remove blocked date"
                        className="cursor-pointer rounded-xl p-1.5 text-slate-400 hover:bg-rose-50 hover:text-rose-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </form>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </AdminShell>
  );
}
