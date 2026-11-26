import React from "react";

export default function AdminInvoiceDetailLoading() {
  return (
    <div className="space-y-6">
      <div className="h-16 animate-pulse rounded-2xl border border-slate-200 bg-white" />
      <div className="h-12 animate-pulse rounded-2xl border border-slate-200 bg-slate-100" />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        <div className="space-y-6 lg:col-span-8">
          <div className="h-44 animate-pulse rounded-2xl border border-slate-200 bg-white" />
          <div className="h-64 animate-pulse rounded-2xl border border-slate-200 bg-white" />
        </div>
        <div className="space-y-6 lg:col-span-4">
          <div className="h-48 animate-pulse rounded-2xl border border-slate-200 bg-white" />
          <div className="h-52 animate-pulse rounded-2xl border border-slate-200 bg-white" />
        </div>
      </div>
    </div>
  );
}
