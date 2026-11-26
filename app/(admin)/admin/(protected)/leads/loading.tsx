import React from "react";
import { DataTableSkeleton } from "@/components/admin/ui";

export default function AdminLeadsLoading() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Loading leads">
      {/* Stat cards skeleton */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="h-[88px] animate-pulse rounded-2xl border border-slate-200 bg-white p-4"
          >
            <div className="h-3 w-16 rounded bg-slate-200" />
            <div className="mt-3 h-6 w-10 rounded bg-slate-200" />
          </div>
        ))}
      </div>

      {/* Toolbar skeleton */}
      <div className="h-14 animate-pulse rounded-2xl border border-slate-200 bg-white" />

      {/* Split view skeleton */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="rounded-2xl border border-slate-200 bg-white lg:col-span-7">
          <DataTableSkeleton columns={5} rows={6} />
        </div>
        <div className="h-[520px] animate-pulse rounded-2xl border border-slate-200 bg-white p-6 lg:col-span-5" />
      </div>
    </div>
  );
}
