"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  AlertCircle,
  AlertTriangle,
  ArrowDownUp,
  Building2,
  Clock,
  Euro,
  FilePlus2,
  ReceiptText,
  Search,
  X,
} from "lucide-react";
import { formatDateDe, formatEurDe } from "@/lib/invoicing/money";
import type {
  ComputedInvoiceStatus,
  SerializedInvoiceListItem,
} from "@/lib/invoicing/types";
import { cn } from "@/lib/utils";
import {
  DataTable,
  EmptyState,
  PageHeader,
  StatCard,
  StatusBadge,
  type DataTableColumn,
} from "@/components/admin/ui";

const FILTER_STATUSES: ComputedInvoiceStatus[] = [
  "DRAFT",
  "ISSUED",
  "PAID",
  "OVERDUE",
  "CANCELLED",
];

const STATUS_LABELS: Record<ComputedInvoiceStatus, string> = {
  DRAFT: "Draft",
  ISSUED: "Issued",
  PAID: "Paid",
  OVERDUE: "Overdue",
  CANCELLED: "Cancelled",
};

interface InvoicesWorkspaceProps {
  invoices: SerializedInvoiceListItem[];
  companyMissingCount: number;
  currentMonthPrefix: string; // e.g. "2026-11"
}

export function InvoicesWorkspace({
  invoices,
  companyMissingCount,
  currentMonthPrefix,
}: InvoicesWorkspaceProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    ComputedInvoiceStatus | "ALL"
  >("ALL");
  const [sortBy, setSortBy] = useState<"date_desc" | "date_asc" | "amount_desc">(
    "date_desc"
  );

  // Real KPI calculations strictly from database records
  const stats = useMemo(() => {
    const counts: Record<ComputedInvoiceStatus, number> = {
      DRAFT: 0,
      ISSUED: 0,
      PAID: 0,
      OVERDUE: 0,
      CANCELLED: 0,
    };

    let billedThisMonthCents = 0;
    let unpaidOpenCents = 0;
    let unpaidOpenCount = 0;
    let overdueCents = 0;
    let overdueCount = 0;

    for (const inv of invoices) {
      counts[inv.displayStatus] += 1;

      // Billed this month: issued invoices (incl. cancellations, excl. drafts) whose issueDate is in current month
      if (
        inv.status !== "DRAFT" &&
        inv.issueDate &&
        inv.issueDate.startsWith(currentMonthPrefix)
      ) {
        billedThisMonthCents += inv.totalGrossCents;
      }

      // Open unpaid receivables (ISSUED or OVERDUE standard invoices)
      if (
        inv.type === "INVOICE" &&
        (inv.displayStatus === "ISSUED" || inv.displayStatus === "OVERDUE")
      ) {
        const remaining = Math.max(0, inv.totalGrossCents - inv.paidAmountCents);
        unpaidOpenCents += remaining;
        unpaidOpenCount += 1;
        if (inv.displayStatus === "OVERDUE") {
          overdueCents += remaining;
          overdueCount += 1;
        }
      }
    }

    return {
      total: invoices.length,
      counts,
      billedThisMonthCents,
      unpaidOpenCents,
      unpaidOpenCount,
      overdueCents,
      overdueCount,
    };
  }, [invoices, currentMonthPrefix]);

  const filteredInvoices = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const list = invoices.filter((inv) => {
      if (statusFilter !== "ALL" && inv.displayStatus !== statusFilter) {
        return false;
      }
      if (!q) return true;
      return (
        (inv.invoiceNumber ?? "entwurf").toLowerCase().includes(q) ||
        inv.customerName.toLowerCase().includes(q) ||
        (inv.customerCompany ?? "").toLowerCase().includes(q) ||
        (inv.correctedInvoiceNumber ?? "").toLowerCase().includes(q)
      );
    });

    return [...list].sort((a, b) => {
      if (sortBy === "amount_desc") {
        return b.totalGrossCents - a.totalGrossCents;
      }
      const aDate = a.issueDate ?? a.createdAtIso;
      const bDate = b.issueDate ?? b.createdAtIso;
      const cmp = aDate.localeCompare(bDate);
      return sortBy === "date_desc" ? -cmp : cmp;
    });
  }, [invoices, searchQuery, statusFilter, sortBy]);

  const columns: DataTableColumn<SerializedInvoiceListItem>[] = [
    {
      key: "number",
      header: "Rechnungsnr.",
      render: (inv) => (
        <div
          className="min-w-0"
          onMouseEnter={() => router.prefetch(`/admin/invoices/${inv.id}`)}
        >
          <div className="flex items-center gap-1.5">
            <Link
              href={`/admin/invoices/${inv.id}`}
              prefetch={true}
              onClick={(e) => e.stopPropagation()}
              className="font-mono text-xs font-bold text-slate-900 hover:text-indigo-700 hover:underline"
            >
              {inv.invoiceNumber ?? "Draft (unnumbered)"}
            </Link>
            {inv.type === "CANCELLATION" && (
              <span className="rounded bg-rose-50 px-1.5 py-0.5 text-[10px] font-bold uppercase text-rose-700 ring-1 ring-inset ring-rose-200">
                Storno
              </span>
            )}
          </div>
          {inv.correctedInvoiceNumber && (
            <p className="mt-0.5 text-[11px] text-slate-400">
              zu {inv.correctedInvoiceNumber}
            </p>
          )}
        </div>
      ),
    },
    {
      key: "customer",
      header: "Kunde",
      render: (inv) => (
        <div className="min-w-0">
          <p className="truncate font-semibold text-slate-900">
            {inv.customerCompany || inv.customerName}
          </p>
          {inv.customerCompany && inv.customerName !== inv.customerCompany && (
            <p className="truncate text-xs text-slate-500">{inv.customerName}</p>
          )}
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (inv) => <StatusBadge status={inv.displayStatus} />,
    },
    {
      key: "issueDate",
      header: "Datum",
      cellClassName: "hidden md:table-cell whitespace-nowrap text-xs text-slate-600 tabular-nums",
      headerClassName: "hidden md:table-cell",
      render: (inv) => (inv.issueDate ? formatDateDe(inv.issueDate) : "—"),
    },
    {
      key: "dueDate",
      header: "Fällig am",
      cellClassName: "hidden sm:table-cell whitespace-nowrap text-xs text-slate-600 tabular-nums",
      headerClassName: "hidden sm:table-cell",
      render: (inv) => (inv.dueDate ? formatDateDe(inv.dueDate) : "—"),
    },
    {
      key: "total",
      header: "Brutto (EUR)",
      headerClassName: "text-right",
      cellClassName: "whitespace-nowrap text-right font-bold tabular-nums text-slate-900",
      render: (inv) => (
        <span
          className={cn(
            inv.totalGrossCents < 0 ? "text-rose-700" : "text-slate-900"
          )}
        >
          {formatEurDe(inv.totalGrossCents)}
        </span>
      ),
    },
  ];

  const cycleSort = () => {
    setSortBy((prev) =>
      prev === "date_desc"
        ? "date_asc"
        : prev === "date_asc"
          ? "amount_desc"
          : "date_desc"
    );
  };

  const sortLabel =
    sortBy === "date_desc"
      ? "Date: Newest"
      : sortBy === "date_asc"
        ? "Date: Oldest"
        : "Amount: Highest";

  return (
    <div className="space-y-6">
      {/* Warning if Company Settings are incomplete */}
      {companyMissingCount > 0 && (
        <div
          role="status"
          className="flex flex-col justify-between gap-3 rounded-2xl border border-amber-200 bg-amber-50/80 p-4 text-amber-950 sm:flex-row sm:items-center"
        >
          <div className="flex items-start gap-2.5">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
            <p className="text-xs leading-relaxed">
              <span className="font-bold">Company profile incomplete:</span>{" "}
              {companyMissingCount} mandatory § 14 UStG / § 35a GmbHG field
              {companyMissingCount === 1 ? " is" : "s are"} missing. You can draft
              and preview invoices, but issuing is blocked until Settings → Company
              is completed.
            </p>
          </div>
          <Link
            href="/admin/settings/company"
            className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl bg-amber-900 px-3.5 py-2 text-xs font-bold text-white hover:bg-amber-800"
          >
            <Building2 className="h-3.5 w-3.5" />
            <span>Complete Company Settings</span>
          </Link>
        </div>
      )}

      {/* Real KPI Stat Cards */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <StatCard
          label="Billed This Month (Brutto)"
          value={formatEurDe(stats.billedThisMonthCents)}
          hint={`Calendar month ${currentMonthPrefix}`}
          tone="indigo"
          icon={<Euro className="h-5 w-5" />}
        />
        <StatCard
          label="Unpaid Open Receivables"
          value={formatEurDe(stats.unpaidOpenCents)}
          hint={`${stats.unpaidOpenCount} open invoice${stats.unpaidOpenCount === 1 ? "" : "s"}`}
          tone="amber"
          active={statusFilter === "ISSUED"}
          onClick={() =>
            setStatusFilter((prev) => (prev === "ISSUED" ? "ALL" : "ISSUED"))
          }
          icon={<Clock className="h-5 w-5" />}
        />
        <StatCard
          label="Overdue"
          value={formatEurDe(stats.overdueCents)}
          hint={`${stats.overdueCount} overdue invoice${stats.overdueCount === 1 ? "" : "s"}`}
          tone="rose"
          active={statusFilter === "OVERDUE"}
          onClick={() =>
            setStatusFilter((prev) => (prev === "OVERDUE" ? "ALL" : "OVERDUE"))
          }
          icon={<AlertCircle className="h-5 w-5" />}
        />
      </div>

      {/* Header + Toolbar */}
      <div className="space-y-3 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-2xs">
        <PageHeader
          title="Invoices & Stornorechnungen"
          badge="EUR · GoBD"
          description="Sequential numbering (RE-YYYY-NNN) is reserved atomically only upon issuing."
          actions={
            <div className="flex flex-wrap items-center gap-2">
              <Link
                href="/admin/settings/company"
                className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                <Building2 className="h-3.5 w-3.5" />
                <span>Company Settings</span>
              </Link>
              <Link
                href="/admin/invoices/new"
                className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-2xs transition-colors hover:bg-indigo-700"
              >
                <FilePlus2 className="h-3.5 w-3.5" />
                <span>New Invoice</span>
              </Link>
            </div>
          }
        />

        <div className="flex flex-col gap-3 border-t border-slate-100 pt-3 md:flex-row md:items-center md:justify-between">
          <div className="relative flex-1 md:max-w-sm">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-slate-400"
            />
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by RE-YYYY-NNN or customer…"
              aria-label="Search invoices by number or customer"
              className="block w-full rounded-xl border border-slate-200 bg-slate-50/70 py-2 pr-9 pl-10 text-xs font-medium text-slate-900 placeholder:text-slate-400 transition-colors focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                aria-label="Clear search"
                className="absolute top-1/2 right-2.5 -translate-y-1/2 cursor-pointer rounded-md p-1 text-slate-400 hover:bg-slate-200/60 hover:text-slate-700"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={cycleSort}
            className="inline-flex shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50"
          >
            <ArrowDownUp className="h-3.5 w-3.5 text-slate-400" />
            <span>{sortLabel}</span>
          </button>
        </div>

        <div
          role="group"
          aria-label="Filter invoices by status"
          className="flex flex-wrap items-center gap-1.5 border-t border-slate-100 pt-3"
        >
          {(["ALL", ...FILTER_STATUSES] as const).map((st) => {
            const active = statusFilter === st;
            const count = st === "ALL" ? stats.total : stats.counts[st];
            const label = st === "ALL" ? "All" : STATUS_LABELS[st];
            return (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                aria-pressed={active}
                className={cn(
                  "inline-flex cursor-pointer items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition-colors",
                  active
                    ? "bg-slate-900 text-white shadow-2xs"
                    : "bg-slate-100/80 text-slate-600 hover:bg-slate-200/70 hover:text-slate-900"
                )}
              >
                <span>{label}</span>
                <span
                  className={cn(
                    "rounded-full px-1.5 text-[10px] font-bold tabular-nums",
                    active ? "bg-white/20 text-white" : "bg-white text-slate-500"
                  )}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Data Table */}
      <DataTable
        caption="Invoices list"
        columns={columns}
        data={filteredInvoices}
        rowKey={(row) => row.id}
        onRowClick={(row) => router.push(`/admin/invoices/${row.id}`)}
        emptyState={
          <EmptyState
            icon={<ReceiptText className="h-5 w-5" />}
            title={
              invoices.length === 0
                ? "No invoices yet"
                : "No invoices match your filters"
            }
            description={
              invoices.length === 0
                ? "Create your first German EUR invoice draft or convert a Lead into a billing customer."
                : "Try clearing the search query or selecting a different status filter."
            }
            action={
              invoices.length === 0 ? (
                <Link
                  href="/admin/invoices/new"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white hover:bg-indigo-700"
                >
                  <FilePlus2 className="h-3.5 w-3.5" />
                  <span>Create First Invoice</span>
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setStatusFilter("ALL");
                  }}
                  className="cursor-pointer rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Clear filters
                </button>
              )
            }
          />
        }
      />
    </div>
  );
}
