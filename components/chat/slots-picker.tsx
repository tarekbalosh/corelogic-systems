"use client";

import React, { useMemo, useState } from "react";
import { Calendar, Check, Clock } from "lucide-react";
import type { AvailableSlot } from "@/lib/booking/availability";
import { CHAT_STRINGS, type UiLanguage } from "@/components/chat/chat-strings";

interface SlotsPickerProps {
  slots: AvailableSlot[];
  uiLang: UiLanguage;
  disabled: boolean;
  chosenStartsAt?: string;
  onSelectSlot: (slot: AvailableSlot) => void;
}

export function SlotsPicker({
  slots,
  uiLang,
  disabled,
  chosenStartsAt,
  onSelectSlot,
}: SlotsPickerProps) {
  const [localChosen, setLocalChosen] = useState<string | null>(
    chosenStartsAt ?? null
  );
  const selectedIso = chosenStartsAt ?? localChosen;
  const isLocked = disabled || Boolean(selectedIso);
  const strings = CHAT_STRINGS[uiLang];

  const groupedByDay = useMemo(() => {
    const groups: Array<{
      dayKey: string;
      dayHeader: string;
      items: AvailableSlot[];
    }> = [];
    const indexByKey = new Map<string, number>();

    for (const slot of slots) {
      const key =
        uiLang === "de"
          ? slot.dayKey_de || slot.dayKey || slot.startsAt.slice(0, 10)
          : slot.dayKey || slot.startsAt.slice(0, 10);
      const dayHeader =
        uiLang === "ar"
          ? slot.dayLabel_ar || slot.label_ar
          : uiLang === "de"
            ? slot.dayLabel_de || slot.label_de || slot.dayLabel_en
            : slot.dayLabel_en || slot.label_en;

      const existingIdx = indexByKey.get(key);
      if (existingIdx === undefined) {
        indexByKey.set(key, groups.length);
        groups.push({ dayKey: key, dayHeader, items: [slot] });
      } else {
        groups[existingIdx].items.push(slot);
      }
    }
    return groups;
  }, [slots, uiLang]);

  if (slots.length === 0) return null;

  return (
    <div
      dir={uiLang === "ar" ? "rtl" : "ltr"}
      className="mt-2.5 rounded-2xl border border-indigo-200/80 bg-white/95 p-3.5 shadow-xs"
    >
      <div className="mb-2.5 flex items-center gap-2 text-xs font-bold text-indigo-700">
        <Calendar className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
        <span>{strings.availableSlotsTitle}</span>
      </div>

      <div className="space-y-3">
        {groupedByDay.map((group) => (
          <div key={group.dayKey} className="space-y-1.5">
            <p className="text-[11px] font-semibold text-slate-500">
              {group.dayHeader}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {group.items.map((slot) => {
                const isSelected = selectedIso === slot.startsAt;
                const timeText =
                  uiLang === "ar"
                    ? slot.timeRange_ar || slot.label_ar
                    : uiLang === "de"
                      ? slot.timeRange_de || slot.label_de || slot.timeRange_en
                      : slot.timeRange_en || slot.label_en;

                return (
                  <button
                    key={slot.startsAt}
                    type="button"
                    disabled={isLocked}
                    onClick={() => {
                      if (isLocked) return;
                      setLocalChosen(slot.startsAt);
                      onSelectSlot(slot);
                    }}
                    className={[
                      "inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500",
                      isSelected
                        ? "border-indigo-600 bg-indigo-600 text-white shadow-xs"
                        : isLocked
                          ? "cursor-not-allowed border-slate-200 bg-slate-50 text-slate-400"
                          : "cursor-pointer border-slate-200 bg-slate-50/80 text-slate-700 hover:border-indigo-400 hover:bg-indigo-50 hover:text-indigo-700",
                    ].join(" ")}
                  >
                    {isSelected ? (
                      <Check className="h-3 w-3 shrink-0" aria-hidden="true" />
                    ) : (
                      <Clock
                        className="h-3 w-3 shrink-0 opacity-70"
                        aria-hidden="true"
                      />
                    )}
                    <span dir="auto">{timeText}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
