import React from "react";
import { cn } from "@/lib/utils";

export type StatCardTone =
  | "slate"
  | "indigo"
  | "sky"
  | "emerald"
  | "amber"
  | "rose";

const toneStyles: Record<
  StatCardTone,
  { iconBg: string; iconText: string; activeRing: string }
> = {
  slate: {
    iconBg: "bg-slate-100",
    iconText: "text-slate-600",
    activeRing: "ring-2 ring-slate-900 border-slate-900",
  },
  indigo: {
    iconBg: "bg-indigo-50",
    iconText: "text-indigo-600",
    activeRing: "ring-2 ring-indigo-500 border-indigo-400",
  },
  sky: {
    iconBg: "bg-sky-50",
    iconText: "text-sky-600",
    activeRing: "ring-2 ring-sky-500 border-sky-400",
  },
  emerald: {
    iconBg: "bg-emerald-50",
    iconText: "text-emerald-600",
    activeRing: "ring-2 ring-emerald-500 border-emerald-400",
  },
  amber: {
    iconBg: "bg-amber-50",
    iconText: "text-amber-700",
    activeRing: "ring-2 ring-amber-500 border-amber-400",
  },
  rose: {
    iconBg: "bg-rose-50",
    iconText: "text-rose-600",
    activeRing: "ring-2 ring-rose-500 border-rose-400",
  },
};

export interface StatCardProps {
  label: string;
  value: number | string;
  hint?: string;
  icon?: React.ReactNode;
  tone?: StatCardTone;
  active?: boolean;
  onClick?: () => void;
  className?: string;
}

export function StatCard({
  label,
  value,
  hint,
  icon,
  tone = "slate",
  active = false,
  onClick,
  className,
}: StatCardProps) {
  const styles = toneStyles[tone];
  const baseClass = cn(
    "flex items-center justify-between gap-3 rounded-2xl border border-slate-200/90 bg-white p-4 text-left shadow-2xs transition-all",
    onClick &&
      "cursor-pointer hover:border-slate-300 hover:shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500",
    active && styles.activeRing,
    className
  );

  const content = (
    <>
      <div className="min-w-0">
        <p className="truncate text-xs font-semibold text-slate-500">{label}</p>
        <p className="mt-1 font-heading text-2xl font-bold tracking-tight text-slate-900">
          {value}
        </p>
        {hint && <p className="mt-0.5 truncate text-[11px] text-slate-400">{hint}</p>}
      </div>
      {icon && (
        <div
          aria-hidden="true"
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
            styles.iconBg,
            styles.iconText
          )}
        >
          {icon}
        </div>
      )}
    </>
  );

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-pressed={active}
        className={cn(baseClass, "w-full")}
      >
        {content}
      </button>
    );
  }

  return <div className={baseClass}>{content}</div>;
}
