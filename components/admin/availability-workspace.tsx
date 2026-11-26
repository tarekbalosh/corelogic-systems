"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  CalendarOff,
  CheckCircle2,
  Clock,
  Loader2,
  Plus,
  Trash2,
} from "lucide-react";
import {
  createAvailabilityRuleAction,
  createBlockedDateAction,
  deleteAvailabilityRuleAction,
  deleteBlockedDateAction,
  toggleAvailabilityRuleAction,
} from "@/lib/admin/actions";
import {
  ConfirmDialog,
  EmptyState,
  FormField,
  PageHeader,
  StatCard,
  StatusBadge,
  adminInputClassName,
  useToast,
} from "@/components/admin/ui";

const WEEKDAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export interface SerializedAvailabilityRule {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  active: boolean;
}

export interface SerializedBlockedDate {
  id: string;
  dateKey: string;
  reason: string | null;
}

export function AvailabilityWorkspace({
  rules,
  blockedDates,
}: {
  rules: SerializedAvailabilityRule[];
  blockedDates: SerializedBlockedDate[];
}) {
  const router = useRouter();
  const toast = useToast();

  // New rule form state
  const [dayOfWeek, setDayOfWeek] = useState("1");
  const [startTime, setStartTime] = useState("10:00");
  const [endTime, setEndTime] = useState("12:30");
  const [creatingRule, startCreateRule] = useTransition();

  // New blocked date form state
  const [blockDate, setBlockDate] = useState("");
  const [blockReason, setBlockReason] = useState("");
  const [creatingBlock, startCreateBlock] = useTransition();

  // Row-level transitions + delete confirmation dialog
  const [togglingRuleId, setTogglingRuleId] = useState<string | null>(null);
  const [, startToggle] = useTransition();
  const [deleteTarget, setDeleteTarget] = useState<
    | { kind: "rule"; id: string; label: string }
    | { kind: "blocked"; id: string; label: string }
    | null
  >(null);
  const [deleting, startDelete] = useTransition();

  const activeRuleCount = rules.filter((r) => r.active).length;

  const handleCreateRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (endTime <= startTime) {
      toast.error("Invalid time window", "End time must be after start time.");
      return;
    }
    startCreateRule(async () => {
      try {
        const fd = new FormData();
        fd.set("dayOfWeek", dayOfWeek);
        fd.set("startTime", startTime);
        fd.set("endTime", endTime);
        await createAvailabilityRuleAction(fd);
        router.refresh();
        toast.success(
          "Availability window added",
          `${WEEKDAY_NAMES[Number(dayOfWeek)]} ${startTime}–${endTime} MYT is now active.`
        );
      } catch {
        toast.error("Could not add window", "Please try again.");
      }
    });
  };

  const handleToggleRule = (rule: SerializedAvailabilityRule) => {
    const nextActive = !rule.active;
    setTogglingRuleId(rule.id);
    startToggle(async () => {
      try {
        const fd = new FormData();
        fd.set("ruleId", rule.id);
        fd.set("nextActive", nextActive ? "true" : "false");
        await toggleAvailabilityRuleAction(fd);
        router.refresh();
        toast.success(
          nextActive ? "Window activated" : "Window paused",
          `${WEEKDAY_NAMES[rule.dayOfWeek]} ${rule.startTime}–${rule.endTime} MYT.`
        );
      } catch {
        toast.error("Could not update window", "Please try again.");
      } finally {
        setTogglingRuleId(null);
      }
    });
  };

  const handleCreateBlockedDate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!blockDate) return;
    startCreateBlock(async () => {
      try {
        const fd = new FormData();
        fd.set("date", blockDate);
        if (blockReason.trim()) fd.set("reason", blockReason.trim());
        await createBlockedDateAction(fd);
        setBlockDate("");
        setBlockReason("");
        router.refresh();
        toast.success(
          "Date blocked",
          `${blockDate} will be excluded from consultation slots.`
        );
      } catch {
        toast.error("Could not block date", "Please verify the date format.");
      }
    });
  };

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    const target = deleteTarget;
    startDelete(async () => {
      try {
        const fd = new FormData();
        if (target.kind === "rule") {
          fd.set("ruleId", target.id);
          await deleteAvailabilityRuleAction(fd);
          toast.success("Availability window removed", target.label);
        } else {
          fd.set("blockedId", target.id);
          await deleteBlockedDateAction(fd);
          toast.success("Blocked date removed", target.label);
        }
        setDeleteTarget(null);
        router.refresh();
      } catch {
        toast.error("Delete failed", "Please try again.");
      }
    });
  };

  return (
    <div className="space-y-6">
      {/* Stat Cards (strictly derived from real DB records) */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <StatCard
          label="Weekly Windows"
          value={rules.length}
          hint="Asia/Kuala_Lumpur (MYT)"
          tone="indigo"
          icon={<Clock className="h-5 w-5" />}
        />
        <StatCard
          label="Active Windows"
          value={activeRuleCount}
          hint={`${rules.length - activeRuleCount} paused`}
          tone="emerald"
          icon={<CheckCircle2 className="h-5 w-5" />}
        />
        <StatCard
          label="Blocked Dates"
          value={blockedDates.length}
          hint="Holidays & closures"
          tone="amber"
          icon={<CalendarOff className="h-5 w-5" />}
        />
      </div>

      {/* Main 2-column Grid */}
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
        {/* Weekly Availability Windows */}
        <section className="space-y-5 rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs sm:p-6">
          <PageHeader
            title="Weekly Availability Windows"
            badge="MYT"
            description="Default seed: Monday–Friday, 10:00–12:30 and 14:00–18:00."
          />

          <form
            onSubmit={handleCreateRule}
            className="grid grid-cols-1 gap-3 rounded-2xl border border-slate-100 bg-slate-50/80 p-4 sm:grid-cols-2 lg:grid-cols-4 lg:items-end"
          >
            <FormField label="Day" htmlFor="rule-day">
              <select
                id="rule-day"
                name="dayOfWeek"
                value={dayOfWeek}
                onChange={(e) => setDayOfWeek(e.target.value)}
                className={adminInputClassName}
              >
                {WEEKDAY_NAMES.map((dayName, idx) => (
                  <option key={dayName} value={idx}>
                    {dayName}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField label="Start (MYT)" htmlFor="rule-start">
              <input
                id="rule-start"
                type="time"
                name="startTime"
                required
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className={adminInputClassName}
              />
            </FormField>

            <FormField label="End (MYT)" htmlFor="rule-end">
              <input
                id="rule-end"
                type="time"
                name="endTime"
                required
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className={adminInputClassName}
              />
            </FormField>

            <button
              type="submit"
              disabled={creatingRule}
              className="inline-flex h-[34px] cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 text-xs font-bold text-white shadow-2xs transition-colors hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:opacity-60"
            >
              {creatingRule ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Plus className="h-3.5 w-3.5" />
              )}
              <span>Add Window</span>
            </button>
          </form>

          {rules.length === 0 ? (
            <EmptyState
              icon={<Clock className="h-5 w-5" />}
              title="No availability windows configured"
              description="Add a recurring weekday window above or run `npx prisma db seed` to restore default hours."
            />
          ) : (
            <ul className="divide-y divide-slate-100 rounded-xl border border-slate-100">
              {rules.map((rule) => {
                const dayName =
                  WEEKDAY_NAMES[rule.dayOfWeek] ?? `Day ${rule.dayOfWeek}`;
                const timeRange = `${rule.startTime} – ${rule.endTime} MYT`;
                const isToggling = togglingRuleId === rule.id;

                return (
                  <li
                    key={rule.id}
                    className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 text-sm transition-colors hover:bg-slate-50/70"
                  >
                    <div className="min-w-0">
                      <span className="font-bold text-slate-900">
                        {dayName}
                      </span>
                      <span className="ms-2 font-mono text-xs text-slate-600">
                        {timeRange}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        disabled={isToggling}
                        onClick={() => handleToggleRule(rule)}
                        aria-label={`${rule.active ? "Pause" : "Activate"} ${dayName} ${timeRange}`}
                        className="cursor-pointer rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:opacity-60"
                      >
                        <StatusBadge
                          status={rule.active ? "ACTIVE" : "PAUSED"}
                          label={
                            isToggling
                              ? "Saving…"
                              : rule.active
                                ? "Active"
                                : "Paused"
                          }
                        />
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setDeleteTarget({
                            kind: "rule",
                            id: rule.id,
                            label: `${dayName} (${timeRange})`,
                          })
                        }
                        aria-label={`Delete ${dayName} ${timeRange}`}
                        className="cursor-pointer rounded-xl p-1.5 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        {/* Blocked Dates */}
        <section className="space-y-5 rounded-2xl border border-slate-200/90 bg-white p-5 shadow-2xs sm:p-6">
          <PageHeader
            title="Blocked Dates & Holidays"
            description="Exclude specific calendar dates (public holidays, off-sites) from slot generation."
          />

          <form
            onSubmit={handleCreateBlockedDate}
            className="grid grid-cols-1 gap-3 rounded-2xl border border-slate-100 bg-slate-50/80 p-4 sm:grid-cols-3 sm:items-end"
          >
            <FormField label="Date" htmlFor="blocked-date" required>
              <input
                id="blocked-date"
                type="date"
                name="date"
                required
                value={blockDate}
                onChange={(e) => setBlockDate(e.target.value)}
                className={adminInputClassName}
              />
            </FormField>

            <FormField label="Reason" htmlFor="blocked-reason">
              <input
                id="blocked-reason"
                type="text"
                name="reason"
                value={blockReason}
                onChange={(e) => setBlockReason(e.target.value)}
                placeholder="Public holiday…"
                className={adminInputClassName}
              />
            </FormField>

            <button
              type="submit"
              disabled={creatingBlock}
              className="inline-flex h-[34px] cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-slate-900 px-3.5 text-xs font-bold text-white shadow-2xs transition-colors hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 disabled:opacity-60"
            >
              {creatingBlock ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Plus className="h-3.5 w-3.5" />
              )}
              <span>Block Date</span>
            </button>
          </form>

          {blockedDates.length === 0 ? (
            <EmptyState
              icon={<CalendarOff className="h-5 w-5" />}
              title="No blocked dates"
              description="All active weekday windows are currently open for booking."
            />
          ) : (
            <ul className="divide-y divide-slate-100 rounded-xl border border-slate-100">
              {blockedDates.map((bd) => (
                <li
                  key={bd.id}
                  className="flex items-center justify-between gap-3 px-4 py-3 text-sm transition-colors hover:bg-slate-50/70"
                >
                  <div className="min-w-0">
                    <span className="font-mono text-xs font-bold text-slate-900">
                      {bd.dateKey}
                    </span>
                    {bd.reason && (
                      <span className="ms-2 text-xs text-slate-500">
                        — {bd.reason}
                      </span>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      setDeleteTarget({
                        kind: "blocked",
                        id: bd.id,
                        label: bd.reason
                          ? `${bd.dateKey} (${bd.reason})`
                          : bd.dateKey,
                      })
                    }
                    aria-label={`Remove blocked date ${bd.dateKey}`}
                    className="cursor-pointer rounded-xl p-1.5 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        loading={deleting}
        variant="danger"
        title={
          deleteTarget?.kind === "rule"
            ? "Remove availability window?"
            : "Remove blocked date?"
        }
        description={
          deleteTarget
            ? `Are you sure you want to remove "${deleteTarget.label}"? Consultation slot availability will update immediately.`
            : ""
        }
        confirmLabel="Remove"
        cancelLabel="Cancel"
      />
    </div>
  );
}
