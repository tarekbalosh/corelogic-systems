import React from "react";
import type { BookingStatus } from "@prisma/client";
import { Check, ExternalLink, X } from "lucide-react";
import prisma from "@/lib/db";
import {
  decideBookingAdminAction,
  saveAlternativeProposalAction,
} from "@/lib/admin/actions";
import {
  formatSlotLabels,
  getBusinessTimezone,
} from "@/lib/booking/availability";
import { requireAdminSession } from "@/lib/security/admin-auth";
import { AdminShell } from "@/components/admin/admin-shell";

export const dynamic = "force-dynamic";

function bookingBadge(status: BookingStatus): string {
  switch (status) {
    case "PENDING":
      return "bg-amber-100 text-amber-900";
    case "CONFIRMED":
      return "bg-emerald-100 text-emerald-800";
    case "REJECTED":
      return "bg-rose-100 text-rose-800";
    case "CANCELLED":
      return "bg-slate-200 text-slate-700";
  }
}

export default async function AdminBookingsPage() {
  await requireAdminSession();

  const tz = getBusinessTimezone();
  const dbConfigured = Boolean(process.env.DATABASE_URL?.trim());
  let dbError: string | null = null;

  const bookings = dbConfigured
    ? await prisma.booking
        .findMany({
          orderBy: [{ status: "asc" }, { startsAt: "asc" }],
          include: {
            lead: true,
          },
          take: 100,
        })
        .catch((err: unknown) => {
          dbError =
            err instanceof Error ? err.message : "Database query failed.";
          return [];
        })
    : [];

  return (
    <AdminShell
      activeTab="bookings"
      title="Consultation Bookings"
      subtitle="Confirm or reject pending bookings. Actions run the same decision + customer WhatsApp notification flow as the WhatsApp buttons."
    >
      {!dbConfigured || dbError ? (
        <div className="rounded-3xl border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900">
          <strong>Database not ready:</strong>{" "}
          {!dbConfigured
            ? "Set DATABASE_URL in .env.local and run `npx prisma migrate deploy`."
            : "Unable to query bookings table. Ensure migrations have been applied."}
        </div>
      ) : bookings.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
          No consultation booking requests yet.
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((bk) => {
            const labels = formatSlotLabels(bk.startsAt, bk.endsAt, tz);
            const waDigits = bk.lead.whatsappNumber.replace(/\D/g, "");

            return (
              <div
                key={bk.id}
                className="rounded-3xl border border-slate-200 bg-white p-6 shadow-2xs"
              >
                <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span
                        className={`inline-flex rounded-full px-3 py-0.5 text-xs font-bold ${bookingBadge(bk.status)}`}
                      >
                        {bk.status}
                      </span>
                      <h2 className="text-base font-bold text-slate-900">
                        {bk.lead.name}
                      </h2>
                      <a
                        href={`https://wa.me/${waDigits}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 hover:underline"
                      >
                        <span>{bk.lead.whatsappNumber}</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>

                    <p className="text-sm font-semibold text-indigo-700">
                      {labels.label_en}
                    </p>
                    {bk.customerNote && (
                      <p className="text-xs text-slate-600">
                        <strong>Customer note:</strong> {bk.customerNote}
                      </p>
                    )}
                  </div>

                  {/* Confirm / Reject + Alternative Time Proposal */}
                  <div className="w-full max-w-md space-y-2.5">
                    {bk.status === "PENDING" ? (
                      <form
                        action={decideBookingAdminAction}
                        className="space-y-2.5"
                      >
                        <input type="hidden" name="bookingId" value={bk.id} />
                        <input
                          type="text"
                          name="alternativeProposal"
                          defaultValue={bk.alternativeProposal ?? ""}
                          placeholder="Optional alternative time suggestion (if rejecting)…"
                          className="block w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none"
                        />
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="submit"
                            name="decision"
                            value="CONFIRM"
                            className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white hover:bg-emerald-700"
                          >
                            <Check className="h-3.5 w-3.5" />
                            <span>Confirm & Notify Customer</span>
                          </button>
                          <button
                            type="submit"
                            name="decision"
                            value="REJECT"
                            className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white hover:bg-rose-700"
                          >
                            <X className="h-3.5 w-3.5" />
                            <span>Reject & Notify Customer</span>
                          </button>
                        </div>
                      </form>
                    ) : (
                      <form
                        action={saveAlternativeProposalAction}
                        className="flex items-center gap-2"
                      >
                        <input type="hidden" name="bookingId" value={bk.id} />
                        <input
                          type="text"
                          name="alternativeProposal"
                          defaultValue={bk.alternativeProposal ?? ""}
                          placeholder="Alternative time note…"
                          className="block flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 focus:border-indigo-500 focus:bg-white focus:outline-none"
                        />
                        <button
                          type="submit"
                          className="cursor-pointer rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100"
                        >
                          Save Note
                        </button>
                      </form>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </AdminShell>
  );
}
