import React from "react";

export default function AdminAvailabilityLoading() {
  return (
    <div
      className="space-y-6"
      aria-busy="true"
      aria-label="Loading availability"
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="h-[88px] animate-pulse rounded-2xl border border-slate-200 bg-white p-4"
          >
            <div className="h-3 w-24 rounded bg-slate-200" />
            <div className="mt-3 h-6 w-10 rounded bg-slate-200" />
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="h-96 animate-pulse rounded-2xl border border-slate-200 bg-white p-6" />
        <div className="h-96 animate-pulse rounded-2xl border border-slate-200 bg-white p-6" />
      </div>
    </div>
  );
}
