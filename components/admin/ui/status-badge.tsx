import React from "react";
import { cn } from "@/lib/utils";

/**
 * Centralized status registry across current admin modules (Leads, Bookings, Availability)
 * and upcoming modules (Invoices: DRAFT, SENT, PAID, OVERDUE, VOID).
 */
export type AdminStatusKey =
  // Lead statuses
  | "NEW"
  | "CONTACTED"
  | "QUALIFIED"
  | "CLOSED"
  // Booking statuses
  | "PENDING"
  | "CONFIRMED"
  | "REJECTED"
  | "CANCELLED"
  // Availability statuses
  | "ACTIVE"
  | "PAUSED"
  // Invoice statuses
  | "DRAFT"
  | "ISSUED"
  | "SENT"
  | "PAID"
  | "OVERDUE"
  | "VOID"
  // Generic UI tones
  | "LIVE"
  | "OFF";

interface StatusStyleConfig {
  label: string;
  pillClass: string;
  dotClass: string;
}

export const STATUS_STYLE_MAP: Record<AdminStatusKey, StatusStyleConfig> = {
  // Leads
  NEW: {
    label: "New",
    pillClass: "bg-indigo-50 text-indigo-700 ring-1 ring-inset ring-indigo-200/80",
    dotClass: "bg-indigo-500",
  },
  CONTACTED: {
    label: "Contacted",
    pillClass: "bg-sky-50 text-sky-700 ring-1 ring-inset ring-sky-200/80",
    dotClass: "bg-sky-500",
  },
  QUALIFIED: {
    label: "Qualified",
    pillClass: "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200/80",
    dotClass: "bg-emerald-500",
  },
  CLOSED: {
    label: "Closed",
    pillClass: "bg-slate-100 text-slate-700 ring-1 ring-inset ring-slate-200",
    dotClass: "bg-slate-400",
  },

  // Bookings
  PENDING: {
    label: "Pending",
    pillClass: "bg-amber-50 text-amber-800 ring-1 ring-inset ring-amber-300/80",
    dotClass: "bg-amber-500",
  },
  CONFIRMED: {
    label: "Confirmed",
    pillClass: "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200/80",
    dotClass: "bg-emerald-500",
  },
  REJECTED: {
    label: "Rejected",
    pillClass: "bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-200/80",
    dotClass: "bg-rose-500",
  },
  CANCELLED: {
    label: "Cancelled",
    pillClass: "bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-200",
    dotClass: "bg-slate-400",
  },

  // Availability
  ACTIVE: {
    label: "Active",
    pillClass: "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200/80",
    dotClass: "bg-emerald-500",
  },
  PAUSED: {
    label: "Paused",
    pillClass: "bg-amber-50 text-amber-800 ring-1 ring-inset ring-amber-200/90",
    dotClass: "bg-amber-500",
  },

  // Invoices
  DRAFT: {
    label: "Draft",
    pillClass: "bg-slate-100 text-slate-700 ring-1 ring-inset ring-slate-200",
    dotClass: "bg-slate-400",
  },
  ISSUED: {
    label: "Issued",
    pillClass: "bg-indigo-50 text-indigo-700 ring-1 ring-inset ring-indigo-200/80",
    dotClass: "bg-indigo-500",
  },
  SENT: {
    label: "Sent",
    pillClass: "bg-sky-50 text-sky-700 ring-1 ring-inset ring-sky-200/80",
    dotClass: "bg-sky-500",
  },
  PAID: {
    label: "Paid",
    pillClass: "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200/80",
    dotClass: "bg-emerald-500",
  },
  OVERDUE: {
    label: "Overdue",
    pillClass: "bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-200/80",
    dotClass: "bg-rose-500",
  },
  VOID: {
    label: "Void",
    pillClass: "bg-slate-100 text-slate-500 ring-1 ring-inset ring-slate-200",
    dotClass: "bg-slate-400",
  },

  // Widget / Generic
  LIVE: {
    label: "Live",
    pillClass: "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200/80",
    dotClass: "bg-emerald-500",
  },
  OFF: {
    label: "Off",
    pillClass: "bg-slate-100 text-slate-600 ring-1 ring-inset ring-slate-200",
    dotClass: "bg-slate-400",
  },
};

export interface StatusBadgeProps {
  status: AdminStatusKey;
  label?: string;
  showDot?: boolean;
  size?: "sm" | "md";
  className?: string;
}

export function StatusBadge({
  status,
  label,
  showDot = true,
  size = "sm",
  className,
}: StatusBadgeProps) {
  const cfg = STATUS_STYLE_MAP[status] ?? STATUS_STYLE_MAP.CLOSED;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-semibold whitespace-nowrap",
        size === "sm" ? "px-2.5 py-0.5 text-[11px]" : "px-3 py-1 text-xs",
        cfg.pillClass,
        className
      )}
    >
      {showDot && (
        <span
          aria-hidden="true"
          className={cn("h-1.5 w-1.5 shrink-0 rounded-full", cfg.dotClass)}
        />
      )}
      <span>{label ?? cfg.label}</span>
    </span>
  );
}
