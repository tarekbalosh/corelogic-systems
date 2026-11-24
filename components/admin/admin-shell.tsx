import React from "react";
import Link from "next/link";
import {
  CalendarClock,
  LogOut,
  Power,
  ShieldCheck,
  SlidersHorizontal,
  Users,
} from "lucide-react";
import {
  logoutAdminAction,
  toggleWidgetPauseAdminAction,
} from "@/lib/admin/actions";
import { getWidgetRuntimePauseState } from "@/lib/agent/runtime-flags";

interface AdminShellProps {
  activeTab: "leads" | "bookings" | "availability";
  title: string;
  subtitle: string;
  children: React.ReactNode;
}

export async function AdminShell({
  activeTab,
  title,
  subtitle,
  children,
}: AdminShellProps) {
  const widgetState = await getWidgetRuntimePauseState();

  const navItems: Array<{
    id: "leads" | "bookings" | "availability";
    label: string;
    href: string;
    icon: React.ComponentType<{ className?: string }>;
  }> = [
    { id: "leads", label: "Leads", href: "/admin/leads", icon: Users },
    {
      id: "bookings",
      label: "Bookings",
      href: "/admin/bookings",
      icon: CalendarClock,
    },
    {
      id: "availability",
      label: "Availability",
      href: "/admin/availability",
      icon: SlidersHorizontal,
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-20 text-slate-900">
      <div className="mx-auto max-w-7xl space-y-8 px-4 sm:px-6 lg:px-8">
        {/* Top Admin Bar */}
        <div className="flex flex-col justify-between gap-4 rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xs lg:flex-row lg:items-center">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 rounded-full bg-indigo-50 px-3 py-1 text-xs font-bold text-indigo-700">
              <ShieldCheck className="h-3.5 w-3.5" />
              <span>AI Agent Admin Console</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              {title}
            </h1>
            <p className="text-sm text-slate-500">{subtitle}</p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Live Widget Kill-Switch */}
            <div className="flex items-center gap-2.5 rounded-2xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs">
              <span
                className={[
                  "h-2.5 w-2.5 rounded-full",
                  widgetState.effectiveEnabled
                    ? "bg-emerald-500"
                    : "bg-slate-400",
                ].join(" ")}
              />
              <span className="font-semibold text-slate-700">
                Widget:{" "}
                {!widgetState.envEnabled
                  ? "Off (env CHAT_WIDGET_ENABLED=false)"
                  : widgetState.dbPaused
                    ? "Paused by Admin"
                    : "Live"}
              </span>

              {widgetState.envEnabled && (
                <form action={toggleWidgetPauseAdminAction}>
                  <input
                    type="hidden"
                    name="paused"
                    value={widgetState.dbPaused ? "false" : "true"}
                  />
                  <button
                    type="submit"
                    className={[
                      "inline-flex cursor-pointer items-center gap-1 rounded-xl px-2.5 py-1 text-xs font-bold transition-colors",
                      widgetState.dbPaused
                        ? "bg-emerald-600 text-white hover:bg-emerald-700"
                        : "bg-amber-100 text-amber-900 hover:bg-amber-200",
                    ].join(" ")}
                  >
                    <Power className="h-3 w-3" />
                    <span>{widgetState.dbPaused ? "Resume" : "Pause Now"}</span>
                  </button>
                </form>
              )}
            </div>

            <form action={logoutAdminAction}>
              <button
                type="submit"
                className="inline-flex cursor-pointer items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition-colors hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Sign out</span>
              </button>
            </form>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav
          aria-label="Admin sections"
          className="flex flex-wrap gap-2 rounded-2xl border border-slate-200/90 bg-white p-2 shadow-2xs"
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.id === activeTab;
            return (
              <Link
                key={item.id}
                href={item.href}
                className={[
                  "inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all",
                  isActive
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
                ].join(" ")}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Page Content */}
        <div>{children}</div>
      </div>
    </div>
  );
}
