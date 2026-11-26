import React from "react";

export default function AdminNewInvoiceLoading() {
  return (
    <div className="space-y-6">
      <div className="h-16 animate-pulse rounded-2xl border border-slate-200 bg-white" />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-8">
          <div className="h-44 animate-pulse rounded-2xl border border-slate-200 bg-white" />
          <div className="h-56 animate-pulse rounded-2xl border border-slate-200 bg-white" />
          <div className="h-64 animate-pulse rounded-2xl border border-slate-200 bg-white" />
        </div>
        <div className="h-60 animate-pulse rounded-2xl border border-slate-200 bg-white lg:col-span-4" />
      </div>
    </div>
  );
}
