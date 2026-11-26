"use client";

import React, { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { BookingStatus } from "@prisma/client";
import {
  CalendarCheck2,
  CalendarClock,
  CalendarX2,
  Check,
  Clock,
  ExternalLink,
  Loader2,
  MessageCircle,
  ReceiptText,
  Save,
  X,
} from "lucide-react";
import {
  decideBookingAdminAction,
  saveAlternativeProposalAction,
} from "@/lib/admin/actions";
import { adminApiJson, InvoicingApiClientError } from "@/components/admin/invoicing/api-client";
import type { SerializedBillingCustomer } from "@/lib/invoicing/types";
import { cn } from "@/lib/utils";
import {
  EmptyState,
  FormField,
  PageHeader,
  StatCard,
  StatusBadge,
  adminInputClassName,
  useToast,
} from "@/components/admin/ui";

const BOOKING_STATUSES: BookingStatus[] = [
  "PENDING",
  "CONFIRMED",
  "REJECTED",
  "CANCELLED",
];

export interface SerializedBooking {
  id: string;
  status: BookingStatus;
  leadName: string;
  whatsappNumber: string;
  leadCompany: string | null;
  visitorLanguage: string | null;
  slotLabelMyt: string;
  slotLabelDe: string;
  customerNote: string | null;
  alternativeProposal: string | null;
}

function BookingCard({ booking }: { booking: SerializedBooking }) {
  const router = useRouter();
  const toast = useToast();
  const [proposal, setProposal] = useState(booking.alternativeProposal ?? "");
  const [pendingAction, setPendingAction] = useState<
    "CONFIRM" | "REJECT" | "SAVE" | null
  >(null);
  const [creatingCustomer, setCreatingCustomer] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleCreateBillingCustomer = async () => {
    setCreatingCustomer(true);
    try {
      const res = await adminApiJson<{
        customer: SerializedBillingCustomer;
        alreadyExisted: boolean;
      }>("/admin/api/customers/from-source", {
        method: "POST",
        body: { bookingId: booking.id },
      });
      toast.success(
        res.alreadyExisted
          ? "Billing customer found"
          : "Billing customer created",
        "Complete the postal address in the invoice editor before issuing."
      );
      router.push(`/admin/invoices/new?customerId=${res.customer.id}`);
    } catch (err) {
      const msg =
        err instanceof InvoicingApiClientError
          ? err.message
          : "Could not create billing customer.";
      toast.error("Billing customer error", msg);
    } finally {
      setCreatingCustomer(false);
    }
  };

  const waDigits = booking.whatsappNumber.replace(/\D/g, "");
  const isPendingStatus = booking.status === "PENDING";

  const handleDecision = (decision: "CONFIRM" | "REJECT") => {
    setPendingAction(decision);
    startTransition(async () => {
      try {
        const fd = new FormData();
        fd.set("bookingId", booking.id);
        fd.set("decision", decision);
        if (proposal.trim()) {
          fd.set("alternativeProposal", proposal.trim());
        }
        await decideBookingAdminAction(fd);
        router.refresh();
        toast.success(
          decision === "CONFIRM" ? "Booking confirmed" : "Booking rejected",
          `${booking.leadName} will receive the WhatsApp notification flow.`
        );
      } catch {
        toast.error(
          "Could not update booking",
          "Please try again or check server logs."
        );
      } finally {
        setPendingAction(null);
      }
    });
  };

  const handleSaveNote = (e: React.FormEvent) => {
    e.preventDefault();
    setPendingAction("SAVE");
    startTransition(async () => {
      try {
        const fd = new FormData();
        fd.set("bookingId", booking.id);
        fd.set("alternativeProposal", proposal);
        await saveAlternativeProposalAction(fd);
        router.refresh();
        toast.success("Note saved", "Alternative time note has been updated.");
      } catch {
        toast.error("Could not save note", "Please try again.");
      } finally {
        setPendingAction(null);
      }
    });
  };

  return (
    <article
      className={cn(
        "rounded-2xl border p-5 shadow-2xs transition-all sm:p-6",
        isPendingStatus
          ? "border-amber-300/90 bg-amber-50/35 shadow-[inset_4px_0_0_0_#f59e0b]"
          : "border-slate-200/90 bg-white"
      )}
    >
      <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-start">
        {/* Left: Booking Info */}
        <div className="min-w-0 flex-1 space-y-2.5">
          <div className="flex flex-wrap items-center gap-2.5">
            <StatusBadge status={booking.status} size="md" />
            {isPendingStatus && (
              <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-[11px] font-bold text-amber-900">
                Action required
              </span>
            )}
            <h3 className="font-heading text-base font-bold text-slate-900">
              {booking.leadName}
            </h3>
            {booking.leadCompany && (
              <span className="text-xs font-medium text-slate-500">
                · {booking.leadCompany}
              </span>
            )}
          </div>

          {/* Slot Time in MYT with explicit timezone tag */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-700 ring-1 ring-inset ring-indigo-200/70">
              <Clock className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span>{booking.slotLabelMyt}</span>
              <span className="rounded bg-indigo-600/10 px-1.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-indigo-800">
                MYT
              </span>
            </div>

            <a
              href={`https://wa.me/${waDigits}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50/70 px-3 py-1.5 text-xs font-semibold text-emerald-800 transition-colors hover:bg-emerald-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            >
              <MessageCircle className="h-3.5 w-3.5 shrink-0" />
              <span dir="ltr">{booking.whatsappNumber}</span>
              <ExternalLink className="h-3 w-3 shrink-0" />
            </a>

            <button
              type="button"
              disabled={creatingCustomer}
              onClick={handleCreateBillingCustomer}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-indigo-200 bg-indigo-50/80 px-3 py-1.5 text-xs font-semibold text-indigo-700 transition-colors hover:bg-indigo-100 disabled:opacity-60"
            >
              {creatingCustomer ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin shrink-0" />
              ) : (
                <ReceiptText className="h-3.5 w-3.5 shrink-0" />
              )}
              <span>Create Invoice</span>
            </button>
          </div>

          {booking.visitorLanguage === "de" && (
            <p className="text-xs font-semibold text-emerald-700">
              DE visitor view: {booking.slotLabelDe}
            </p>
          )}

          {booking.customerNote && (
            <div className="rounded-xl border border-slate-200/80 bg-white/80 px-3.5 py-2.5 text-xs text-slate-600">
              <span className="font-bold text-slate-700">Customer note: </span>
              <span dir="auto">{booking.customerNote}</span>
            </div>
          )}
        </div>

        {/* Right: Actions */}
        <div className="w-full shrink-0 lg:max-w-md">
          {isPendingStatus ? (
            <div className="space-y-3 rounded-2xl border border-amber-200/80 bg-white p-4">
              <FormField
                label="Alternative time suggestion (optional, used if rejecting)"
                htmlFor={`alt-${booking.id}`}
              >
                <input
                  id={`alt-${booking.id}`}
                  type="text"
                  value={proposal}
                  onChange={(e) => setProposal(e.target.value)}
                  placeholder="e.g., Tomorrow 15:00 MYT…"
                  className={adminInputClassName}
                />
              </FormField>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => handleDecision("CONFIRM")}
                  className="inline-flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-emerald-600 px-4 py-2 text-xs font-bold text-white shadow-2xs transition-colors hover:bg-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 disabled:opacity-60"
                >
                  {pendingAction === "CONFIRM" ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <Check className="h-3.5 w-3.5" />
                  )}
                  <span>Confirm & Notify</span>
                </button>
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => handleDecision("REJECT")}
                  className="inline-flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2 text-xs font-bold text-white shadow-2xs transition-colors hover:bg-rose-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500 disabled:opacity-60"
                >
                  {pendingAction === "REJECT" ? (
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <X className="h-3.5 w-3.5" />
                  )}
                  <span>Reject & Notify</span>
                </button>
              </div>
            </div>
          ) : (
            <form
              onSubmit={handleSaveNote}
              className="flex flex-col gap-2 rounded-2xl border border-slate-100 bg-slate-50/80 p-3.5 sm:flex-row sm:items-end"
            >
              <FormField
                label="Alternative time / internal note"
                htmlFor={`note-${booking.id}`}
                className="flex-1"
              >
                <input
                  id={`note-${booking.id}`}
                  type="text"
                  value={proposal}
                  onChange={(e) => setProposal(e.target.value)}
                  placeholder="Add alternative time note…"
                  className={adminInputClassName}
                />
              </FormField>
              <button
                type="submit"
                disabled={isPending}
                className="inline-flex shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:opacity-60"
              >
                {pendingAction === "SAVE" ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Save className="h-3.5 w-3.5" />
                )}
                <span>Save Note</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </article>
  );
}

export function BookingsWorkspace({
  bookings,
  timezoneLabel,
}: {
  bookings: SerializedBooking[];
  timezoneLabel: string;
}) {
  const [statusFilter, setStatusFilter] = useState<BookingStatus | "ALL">(
    "ALL"
  );

  const counts = useMemo(() => {
    const map: Record<BookingStatus, number> = {
      PENDING: 0,
      CONFIRMED: 0,
      REJECTED: 0,
      CANCELLED: 0,
    };
    for (const bk of bookings) {
      map[bk.status] += 1;
    }
    return { total: bookings.length, ...map };
  }, [bookings]);

  const filteredBookings = useMemo(() => {
    const list =
      statusFilter === "ALL"
        ? bookings
        : bookings.filter((b) => b.status === statusFilter);
    // Keep PENDING items surfaced first for quick action.
    return [...list].sort((a, b) => {
      if (a.status === "PENDING" && b.status !== "PENDING") return -1;
      if (a.status !== "PENDING" && b.status === "PENDING") return 1;
      return 0;
    });
  }, [bookings, statusFilter]);

  return (
    <div className="space-y-6">
      {/* Stat Cards (strictly derived from real bookings) */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard
          label="Total Bookings"
          value={counts.total}
          tone="slate"
          active={statusFilter === "ALL"}
          onClick={() => setStatusFilter("ALL")}
          icon={<CalendarClock className="h-5 w-5" />}
        />
        <StatCard
          label="Pending Review"
          value={counts.PENDING}
          tone="amber"
          active={statusFilter === "PENDING"}
          onClick={() => setStatusFilter("PENDING")}
          icon={<Clock className="h-5 w-5" />}
        />
        <StatCard
          label="Confirmed"
          value={counts.CONFIRMED}
          tone="emerald"
          active={statusFilter === "CONFIRMED"}
          onClick={() => setStatusFilter("CONFIRMED")}
          icon={<CalendarCheck2 className="h-5 w-5" />}
        />
        <StatCard
          label="Rejected / Cancelled"
          value={counts.REJECTED + counts.CANCELLED}
          tone="rose"
          active={statusFilter === "REJECTED"}
          onClick={() => setStatusFilter("REJECTED")}
          icon={<CalendarX2 className="h-5 w-5" />}
        />
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-2xs sm:flex-row sm:items-center sm:justify-between">
        <PageHeader
          title="Booking Requests"
          badge={`${timezoneLabel} (MYT)`}
          description="Confirm or reject triggers the same decision & WhatsApp notification flow."
        />

        <div
          role="group"
          aria-label="Filter bookings by status"
          className="flex flex-wrap items-center gap-1.5"
        >
          {(["ALL", ...BOOKING_STATUSES] as const).map((st) => {
            const active = statusFilter === st;
            const count = st === "ALL" ? counts.total : counts[st];
            const label =
              st === "ALL"
                ? "All"
                : st.charAt(0) + st.slice(1).toLowerCase();
            return (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                aria-pressed={active}
                className={cn(
                  "inline-flex cursor-pointer items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500",
                  active
                    ? "bg-slate-900 text-white"
                    : "bg-slate-100/80 text-slate-600 hover:bg-slate-200/70 hover:text-slate-900"
                )}
              >
                <span>{label}</span>
                <span
                  className={cn(
                    "rounded-full px-1.5 text-[10px] font-bold tabular-nums",
                    active
                      ? "bg-white/20 text-white"
                      : "bg-white text-slate-500"
                  )}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bookings List */}
      {filteredBookings.length === 0 ? (
        <div className="rounded-2xl border border-slate-200/90 bg-white shadow-2xs">
          <EmptyState
            icon={<CalendarClock className="h-5 w-5" />}
            title={
              bookings.length === 0
                ? "No consultation bookings yet"
                : "No bookings in this status"
            }
            description={
              bookings.length === 0
                ? "Incoming consultation requests booked via the AI assistant will appear here."
                : "Switch back to All to inspect other consultation requests."
            }
            action={
              statusFilter !== "ALL" ? (
                <button
                  type="button"
                  onClick={() => setStatusFilter("ALL")}
                  className="cursor-pointer rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Show all bookings
                </button>
              ) : undefined
            }
          />
        </div>
      ) : (
        <div className="space-y-4">
          {filteredBookings.map((bk) => (
            <BookingCard key={bk.id} booking={bk} />
          ))}
        </div>
      )}
    </div>
  );
}
