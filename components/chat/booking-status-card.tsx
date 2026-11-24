"use client";

import React, { useEffect, useState } from "react";
import { CalendarCheck2, Clock3, AlertCircle } from "lucide-react";
import { CHAT_STRINGS, type UiLanguage } from "@/components/chat/chat-strings";

export type PolledBookingStatus =
  | "PENDING"
  | "CONFIRMED"
  | "REJECTED"
  | "CANCELLED";

interface BookingStatusCardProps {
  bookingId: string;
  sessionId: string;
  initialStatus: PolledBookingStatus;
  labelEn: string;
  labelAr: string;
  uiLang: UiLanguage;
  onStatusChange?: (bookingId: string, newStatus: PolledBookingStatus) => void;
}

const POLL_INTERVAL_MS = 20_000; // 20 seconds
const MAX_POLL_DURATION_MS = 30 * 60 * 1000; // 30 minutes

export function BookingStatusCard({
  bookingId,
  sessionId,
  initialStatus,
  labelEn,
  labelAr,
  uiLang,
  onStatusChange,
}: BookingStatusCardProps) {
  const [status, setStatus] = useState<PolledBookingStatus>(initialStatus);
  const strings = CHAT_STRINGS[uiLang];
  const displayLabel = uiLang === "ar" ? labelAr || labelEn : labelEn || labelAr;

  useEffect(() => {
    if (status !== "PENDING" || !bookingId || !sessionId) {
      return;
    }

    let cancelled = false;
    const startedAt = Date.now();

    const checkOnce = async () => {
      if (cancelled) return;
      if (Date.now() - startedAt > MAX_POLL_DURATION_MS) {
        return;
      }

      try {
        const res = await fetch(
          `/api/booking/${encodeURIComponent(bookingId)}/status?sessionId=${encodeURIComponent(sessionId)}`,
          { method: "GET", cache: "no-store" }
        );
        if (!res.ok) return;
        const data = (await res.json()) as { status?: PolledBookingStatus };
        if (
          !cancelled &&
          data.status &&
          data.status !== "PENDING"
        ) {
          setStatus(data.status);
          onStatusChange?.(bookingId, data.status);
        }
      } catch {
        // Ignore transient network hiccups during background status polling
      }
    };

    const intervalId = window.setInterval(() => {
      if (Date.now() - startedAt > MAX_POLL_DURATION_MS) {
        window.clearInterval(intervalId);
        return;
      }
      void checkOnce();
    }, POLL_INTERVAL_MS);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
    };
  }, [bookingId, sessionId, status, onStatusChange]);

  return (
    <div
      dir={uiLang === "ar" ? "rtl" : "ltr"}
      className="mt-2.5 rounded-2xl border border-slate-200/90 bg-gradient-to-br from-white to-slate-50 p-4 shadow-xs"
    >
      <div className="flex items-start gap-3">
        <div
          className={[
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
            status === "CONFIRMED"
              ? "bg-emerald-100 text-emerald-700"
              : status === "REJECTED" || status === "CANCELLED"
                ? "bg-amber-100 text-amber-700"
                : "bg-indigo-100 text-indigo-700",
          ].join(" ")}
        >
          {status === "CONFIRMED" ? (
            <CalendarCheck2 className="h-5 w-5" aria-hidden="true" />
          ) : status === "REJECTED" || status === "CANCELLED" ? (
            <AlertCircle className="h-5 w-5" aria-hidden="true" />
          ) : (
            <Clock3 className="h-5 w-5" aria-hidden="true" />
          )}
        </div>

        <div className="min-w-0 flex-1 space-y-1.5">
          <p className="text-xs font-bold text-slate-900">
            {strings.bookingPendingTitle}
          </p>
          <p className="text-xs font-medium text-slate-700" dir="auto">
            {displayLabel}
          </p>

          <div className="pt-1">
            {status === "CONFIRMED" ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-bold text-emerald-700">
                {strings.bookingConfirmedBadge}
              </span>
            ) : status === "REJECTED" || status === "CANCELLED" ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/15 px-3 py-1 text-xs font-semibold text-amber-800">
                {strings.bookingRejectedBadge}
              </span>
            ) : (
              <div className="space-y-1">
                <span className="inline-flex items-center gap-2 rounded-full bg-indigo-500/10 px-3 py-1 text-[11px] font-semibold text-indigo-700">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-indigo-600" />
                  <span>
                    {uiLang === "ar"
                      ? "بانتظار تأكيد الإدارة"
                      : "Pending team confirmation"}
                  </span>
                </span>
                <p className="text-[11px] leading-snug text-slate-500">
                  {strings.bookingPendingSubtitle}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
