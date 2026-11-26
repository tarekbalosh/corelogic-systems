import React from "react";

export default function AdminBookingsLoading() {
  return (
    <div className="space-y-6" aria-busy="true" aria-label="Loading bookings">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-[88px] animate-pulse rounded-2xl border border-slate-200 bg-white p-4"
          >
            <div className="h-3 w-20 rounded bg-slate-200" />
            <div className="mt-3 h-6 w-10 rounded bg-slate-200" />
          </div>
        ))}
      </div>
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="h-36 animate-pulse rounded-2xl border border-slate-200 bg-white p-6"
          />
        ))}
      </div>
    </div>
  );
}
