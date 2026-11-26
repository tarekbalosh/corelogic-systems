import React from "react";
import { AlertTriangle } from "lucide-react";
import prisma from "@/lib/db";
import {
  formatSlotLabels,
  getBusinessTimezone,
} from "@/lib/booking/availability";
import { requireAdminSession } from "@/lib/security/admin-auth";
import {
  BookingsWorkspace,
  type SerializedBooking,
} from "@/components/admin/bookings-workspace";

export const dynamic = "force-dynamic";

export default async function AdminBookingsPage() {
  await requireAdminSession();

  const tz = getBusinessTimezone();
  const dbConfigured = Boolean(process.env.DATABASE_URL?.trim());
  let dbError: string | null = null;

  const rawBookings = dbConfigured
    ? await prisma.booking
        .findMany({
          orderBy: [{ status: "asc" }, { startsAt: "asc" }],
          include: {
            lead: {
              include: {
                conversations: {
                  select: { language: true },
                  orderBy: { updatedAt: "desc" },
                  take: 1,
                },
              },
            },
          },
          take: 100,
        })
        .catch((err: unknown) => {
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

  const bookings: SerializedBooking[] = rawBookings.map((bk) => {
    const labels = formatSlotLabels(bk.startsAt, bk.endsAt, tz);
    return {
      id: bk.id,
      status: bk.status,
      leadName: bk.lead.name,
      whatsappNumber: bk.lead.whatsappNumber,
      leadCompany: bk.lead.companyName,
      visitorLanguage: bk.lead.conversations?.[0]?.language ?? null,
      slotLabelMyt: labels.label_en,
      slotLabelDe: labels.label_de,
      customerNote: bk.customerNote,
      alternativeProposal: bk.alternativeProposal,
    };
  });

  return <BookingsWorkspace bookings={bookings} timezoneLabel={tz} />;
}
