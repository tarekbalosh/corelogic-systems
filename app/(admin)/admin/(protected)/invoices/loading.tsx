import React from "react";
import { DataTableSkeleton } from "@/components/admin/ui";

export default function AdminInvoicesLoading() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {[1, 2, 3].map((idx) => (
          <div
            key={idx}
            className="h-24 animate-pulse rounded-2xl border border-slate-200 bg-white p-4"
          />
        ))}
      </div>
      <DataTableSkeleton rows={6} columns={6} />
    </div>
  );
}
